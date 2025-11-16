<?php

declare(strict_types=1);

namespace App\Service;

use App\DTO\CurrentRatesMetaDto;
use App\DTO\CurrentRatesResponseDto;
use App\DTO\ExchangeRateDto;
use App\DTO\HistoricalRateDto;
use App\Exception\NBPApiException;

/**
 * Facade service coordinating NBP API client and exchange rate calculations
 */
class CurrencyService
{
    private NBPApiClient $nbpApiClient;
    private ExchangeRateCalculator $calculator;

    public function __construct(NBPApiClient $nbpApiClient, ExchangeRateCalculator $calculator)
    {
        $this->nbpApiClient = $nbpApiClient;
        $this->calculator = $calculator;
    }

    /**
     * Get current exchange rates for all supported currencies
     *
     * @return CurrentRatesResponseDto
     * @throws NBPApiException
     */
    public function getCurrentRates(): CurrentRatesResponseDto
    {
        $nbpData = $this->nbpApiClient->fetchCurrentRates();

        $publicationDate = $nbpData['effectiveDate'] ?? date('Y-m-d');
        $tradingDate = $nbpData['tradingDate'] ?? $publicationDate;

        // Determine if data is stale (not from today)
        $today = date('Y-m-d');
        $isStale = $publicationDate !== $today;

        $meta = new CurrentRatesMetaDto(
            $publicationDate,
            $isStale,
            new \DateTimeImmutable() // Last successful update timestamp
        );

        $rates = [];
        $nbpRates = $nbpData['rates'] ?? [];

        foreach ($this->calculator->getSupportedCurrencies() as $currencyCode) {
            $nbpRate = $this->findRateByCurrency($nbpRates, $currencyCode);

            if ($nbpRate === null) {
                continue; // Skip if currency not found in NBP data
            }

            $buyRate = $this->calculator->calculateBuyRate($nbpRate, $currencyCode);
            $sellRate = $this->calculator->calculateSellRate($nbpRate, $currencyCode);

            $rates[] = new ExchangeRateDto($currencyCode, $nbpRate, $buyRate, $sellRate);
        }

        return new CurrentRatesResponseDto($meta, $rates);
    }

    /**
     * Get historical exchange rates for specific currency (14 days)
     *
     * @param string $currencyCode Currency code (EUR, USD, etc.)
     * @param string|null $endDate End date in YYYY-MM-DD format (default: today)
     * @return HistoricalRateDto[]
     * @throws NBPApiException
     * @throws \InvalidArgumentException If currency not supported
     */
    public function getHistoricalRates(string $currencyCode, ?string $endDate = null): array
    {
        if (!$this->calculator->isCurrencySupported($currencyCode)) {
            throw new \InvalidArgumentException(
                sprintf('Currency "%s" is not supported', $currencyCode)
            );
        }

        $endDate = $endDate ?? date('Y-m-d');

        $nbpData = $this->nbpApiClient->fetchHistoricalRates($currencyCode, $endDate);
        $nbpRates = $nbpData['rates'] ?? [];

        $historicalRates = [];

        foreach ($nbpRates as $rateData) {
            $date = $rateData['effectiveDate'] ?? null;
            $nbpRate = $rateData['mid'] ?? null;

            if ($date === null || $nbpRate === null) {
                continue;
            }

            $buyRate = $this->calculator->calculateBuyRate($nbpRate, $currencyCode);
            $sellRate = $this->calculator->calculateSellRate($nbpRate, $currencyCode);

            $historicalRates[] = new HistoricalRateDto($date, $nbpRate, $buyRate, $sellRate);
        }

        // Sort by date descending (newest first)
        usort($historicalRates, function (HistoricalRateDto $a, HistoricalRateDto $b) {
            return $b->getDate() <=> $a->getDate();
        });

        return $historicalRates;
    }

    /**
     * Find NBP rate by currency code in rates array
     *
     * @param array $rates Array of NBP rates
     * @param string $currencyCode Currency code to find
     * @return float|null Average rate or null if not found
     */
    private function findRateByCurrency(array $rates, string $currencyCode): ?float
    {
        foreach ($rates as $rate) {
            if (($rate['code'] ?? '') === $currencyCode) {
                return (float) ($rate['mid'] ?? 0);
            }
        }

        return null;
    }
}
