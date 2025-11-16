<?php

declare(strict_types=1);

namespace Tests\Integration\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Response;

/**
 * Integration tests for CurrencyController API endpoints
 */
class CurrencyControllerTest extends WebTestCase
{
    public function testGetCurrentRatesReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/current');

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testGetCurrentRatesReturnsJsonContentType(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/current');

        $this->assertResponseHeaderSame('Content-Type', 'application/json');
    }

    public function testGetCurrentRatesHasCorrectJsonStructure(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/current');

        $data = json_decode($client->getResponse()->getContent(), true);

        // Check top-level structure
        $this->assertArrayHasKey('meta', $data);
        $this->assertArrayHasKey('data', $data);

        // Check meta structure
        $this->assertArrayHasKey('publicationDate', $data['meta']);
        $this->assertArrayHasKey('isStale', $data['meta']);
        $this->assertArrayHasKey('lastSuccessfulUpdate', $data['meta']);

        // Check data is array
        $this->assertIsArray($data['data']);

        // If data not empty, check first rate structure
        if (count($data['data']) > 0) {
            $rate = $data['data'][0];
            $this->assertArrayHasKey('code', $rate);
            $this->assertArrayHasKey('nbpAverageRate', $rate);
            $this->assertArrayHasKey('buyRate', $rate);
            $this->assertArrayHasKey('sellRate', $rate);
        }
    }

    public function testGetCurrentRatesContainsSupportedCurrencies(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/current');

        $data = json_decode($client->getResponse()->getContent(), true);
        $codes = array_column($data['data'], 'code');

        // Should contain supported currencies
        $supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

        foreach ($supportedCurrencies as $currency) {
            $this->assertContains($currency, $codes, "Missing currency: $currency");
        }
    }

    public function testGetHistoricalRatesForEURReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/historical/EUR');

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testGetHistoricalRatesForUSDReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/historical/USD');

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testGetHistoricalRatesWithDateParameterReturns200(): void
    {
        $client = static::createClient();
        $date = '2024-11-01'; // Historical date
        $client->request('GET', '/api/rates/historical/EUR', ['date' => $date]);

        $response = $client->getResponse();

        // Should return 200 or 404 if NBP doesn't have data for that date
        $this->assertContains(
            $response->getStatusCode(),
            [Response::HTTP_OK, Response::HTTP_NOT_FOUND]
        );
    }

    public function testGetHistoricalRatesHasCorrectJsonStructure(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/historical/EUR');

        $data = json_decode($client->getResponse()->getContent(), true);

        // Check top-level structure
        $this->assertArrayHasKey('data', $data);
        $this->assertIsArray($data['data']);

        // If data not empty, check first rate structure
        if (count($data['data']) > 0) {
            $rate = $data['data'][0];
            $this->assertArrayHasKey('date', $rate);
            $this->assertArrayHasKey('nbpAverageRate', $rate);
            $this->assertArrayHasKey('buyRate', $rate);
            $this->assertArrayHasKey('sellRate', $rate);
        }
    }

    public function testGetHistoricalRatesWithInvalidDateFormatReturns400(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/historical/EUR', ['date' => 'invalid-date']);

        $this->assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    public function testGetHistoricalRatesInvalidDateErrorResponseHasCorrectStructure(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/historical/EUR', ['date' => 'invalid-date']);

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('error', $data);
        $this->assertArrayHasKey('message', $data);
        $this->assertEquals('INVALID_DATE', $data['error']);
        $this->assertStringContainsString('YYYY-MM-DD', $data['message']);
    }

    public function testGetCurrentRatesCalculatesCorrectBuyRateForEUR(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/current');

        $data = json_decode($client->getResponse()->getContent(), true);

        // Find EUR in response
        $eurRate = null;
        foreach ($data['data'] as $rate) {
            if ($rate['code'] === 'EUR') {
                $eurRate = $rate;
                break;
            }
        }

        if ($eurRate) {
            $expectedBuyRate = $eurRate['nbpAverageRate'] - 0.15;
            $this->assertEqualsWithDelta($expectedBuyRate, $eurRate['buyRate'], 0.0001);
        }
    }

    public function testGetCurrentRatesCalculatesCorrectSellRateForCZK(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/rates/current');

        $data = json_decode($client->getResponse()->getContent(), true);

        // Find CZK in response
        $czkRate = null;
        foreach ($data['data'] as $rate) {
            if ($rate['code'] === 'CZK') {
                $czkRate = $rate;
                break;
            }
        }

        if ($czkRate) {
            $this->assertNull($czkRate['buyRate'], 'CZK should not have buy rate');

            $expectedSellRate = $czkRate['nbpAverageRate'] + 0.20;
            $this->assertEqualsWithDelta($expectedSellRate, $czkRate['sellRate'], 0.0001);
        }
    }
}
