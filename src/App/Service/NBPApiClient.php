<?php

declare(strict_types=1);

namespace App\Service;

use App\Exception\NBPApiException;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\RequestException;
use Psr\Cache\CacheItemPoolInterface;
use Psr\Cache\InvalidArgumentException as CacheInvalidArgumentException;

/**
 * Client for NBP API with caching and retry mechanism
 */
class NBPApiClient
{
    private Client $httpClient;
    private CacheItemPoolInterface $cache;
    private string $baseUrl;
    private int $currentTtl;
    private int $historicalTtl;

    private const MAX_RETRIES = 3;
    private const RETRY_DELAY_MS = 500; // 500ms base delay for exponential backoff

    public function __construct(
        Client $httpClient,
        CacheItemPoolInterface $cache,
        string $baseUrl,
        int $currentTtl,
        int $historicalTtl
    ) {
        $this->httpClient = $httpClient;
        $this->cache = $cache;
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->currentTtl = $currentTtl;
        $this->historicalTtl = $historicalTtl;
    }

    /**
     * Fetch current exchange rates for all currencies from NBP Table A
     *
     * @return array NBP API response with rates
     * @throws NBPApiException
     */
    public function fetchCurrentRates(): array
    {
        $cacheKey = 'nbp.table.a.current';
        $ttl = $this->currentTtl;

        return $this->fetchWithCache($cacheKey, $ttl, function () {
            $url = sprintf('%s/exchangerates/tables/A/?format=json', $this->baseUrl);
            $response = $this->executeWithRetry($url);

            // NBP returns array with one element for table A
            return $response[0] ?? [];
        });
    }

    /**
     * Fetch historical exchange rates for specific currency
     *
     * @param string $currencyCode Currency code (e.g., EUR, USD)
     * @param string $endDate End date in YYYY-MM-DD format
     * @return array NBP API response with historical rates (14 days)
     * @throws NBPApiException
     */
    public function fetchHistoricalRates(string $currencyCode, string $endDate): array
    {
        $cacheKey = sprintf('nbp.rates.%s.%s.14days', strtolower($currencyCode), $endDate);
        $ttl = $this->historicalTtl;

        return $this->fetchWithCache($cacheKey, $ttl, function () use ($currencyCode, $endDate) {
            // Calculate start date (21 days before end date to ensure 14 business days)
            // NBP publishes rates only on business days, so we need to fetch more calendar days
            $endDateTime = new \DateTimeImmutable($endDate);
            $startDateTime = $endDateTime->modify('-21 days');
            $startDate = $startDateTime->format('Y-m-d');

            $url = sprintf(
                '%s/exchangerates/rates/A/%s/%s/%s/?format=json',
                $this->baseUrl,
                strtoupper($currencyCode),
                $startDate,
                $endDate
            );

            return $this->executeWithRetry($url);
        });
    }

    /**
     * Execute HTTP request with cache and stale cache fallback
     *
     * @param string $cacheKey Cache key
     * @param int $ttl Cache TTL in seconds
     * @param callable $fetchCallback Callback to fetch fresh data
     * @return array Response data
     * @throws NBPApiException
     */
    private function fetchWithCache(string $cacheKey, int $ttl, callable $fetchCallback): array
    {
        try {
            $cacheItem = $this->cache->getItem($cacheKey);

            // Try to fetch fresh data
            try {
                $data = $fetchCallback();

                // Save to cache
                $cacheItem->set($data);
                $cacheItem->expiresAfter($ttl);
                $this->cache->save($cacheItem);

                return $data;
            } catch (NBPApiException $e) {
                // If API fails, try to return stale cache
                if ($cacheItem->isHit()) {
                    // Return stale data - better than nothing
                    return $cacheItem->get();
                }

                // No stale cache available, re-throw exception
                throw $e;
            }
        } catch (CacheInvalidArgumentException $e) {
            // Cache error - fetch without cache
            return $fetchCallback();
        }
    }

    /**
     * Execute HTTP GET request with retry mechanism
     *
     * @param string $url Full URL to request
     * @return array Decoded JSON response
     * @throws NBPApiException
     */
    private function executeWithRetry(string $url): array
    {
        $lastException = null;

        for ($attempt = 1; $attempt <= self::MAX_RETRIES; $attempt++) {
            try {
                $response = $this->httpClient->get($url);
                $body = (string) $response->getBody();

                return json_decode($body, true, 512, JSON_THROW_ON_ERROR);
            } catch (RequestException $e) {
                $lastException = $e;

                if ($e->hasResponse()) {
                    $statusCode = $e->getResponse()->getStatusCode();

                    // Don't retry client errors (4xx)
                    if ($statusCode >= 400 && $statusCode < 500) {
                        throw NBPApiException::fromHttpError(
                            $statusCode,
                            $e->getMessage()
                        );
                    }
                }

                // Exponential backoff: 500ms, 1000ms, 2000ms
                if ($attempt < self::MAX_RETRIES) {
                    usleep(self::RETRY_DELAY_MS * 1000 * pow(2, $attempt - 1));
                }
            } catch (GuzzleException $e) {
                $lastException = $e;

                // Retry on connection errors
                if ($attempt < self::MAX_RETRIES) {
                    usleep(self::RETRY_DELAY_MS * 1000 * pow(2, $attempt - 1));
                }
            } catch (\JsonException $e) {
                throw NBPApiException::fromConnectionError('Invalid JSON response from NBP API');
            }
        }

        // All retries failed
        if ($lastException instanceof RequestException && $lastException->hasResponse()) {
            throw NBPApiException::fromHttpError(
                $lastException->getResponse()->getStatusCode(),
                $lastException->getMessage()
            );
        }

        throw NBPApiException::fromConnectionError(
            $lastException ? $lastException->getMessage() : 'Unknown error'
        );
    }
}
