<?php

declare(strict_types=1);

namespace Tests\Unit\Service;

use App\Service\ExchangeRateCalculator;
use InvalidArgumentException;
use PHPUnit\Framework\TestCase;

/**
 * Unit tests for ExchangeRateCalculator
 */
class ExchangeRateCalculatorTest extends TestCase
{
    private ExchangeRateCalculator $calculator;

    protected function setUp(): void
    {
        $margins = [
            'EUR' => ['buy' => -0.15, 'sell' => 0.11],
            'USD' => ['buy' => -0.15, 'sell' => 0.11],
            'CZK' => ['buy' => null, 'sell' => 0.20],
            'IDR' => ['buy' => null, 'sell' => 0.20],
            'BRL' => ['buy' => null, 'sell' => 0.20],
        ];

        $supportedCurrencies = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

        $this->calculator = new ExchangeRateCalculator($margins, $supportedCurrencies);
    }

    public function testCalculateBuyRateForEUR(): void
    {
        $nbpRate = 4.3250;
        $buyRate = $this->calculator->calculateBuyRate($nbpRate, 'EUR');

        $this->assertNotNull($buyRate);
        $this->assertEquals(4.1750, $buyRate); // 4.3250 - 0.15 = 4.1750
    }

    public function testCalculateBuyRateForUSD(): void
    {
        $nbpRate = 4.0000;
        $buyRate = $this->calculator->calculateBuyRate($nbpRate, 'USD');

        $this->assertNotNull($buyRate);
        $this->assertEquals(3.8500, $buyRate); // 4.0000 - 0.15 = 3.8500
    }

    public function testCalculateBuyRateForCZKReturnsNull(): void
    {
        $nbpRate = 0.1850;
        $buyRate = $this->calculator->calculateBuyRate($nbpRate, 'CZK');

        $this->assertNull($buyRate); // CZK doesn't support buying
    }

    public function testCalculateBuyRateForIDRReturnsNull(): void
    {
        $nbpRate = 0.0003;
        $buyRate = $this->calculator->calculateBuyRate($nbpRate, 'IDR');

        $this->assertNull($buyRate); // IDR doesn't support buying
    }

    public function testCalculateBuyRateForBRLReturnsNull(): void
    {
        $nbpRate = 0.8200;
        $buyRate = $this->calculator->calculateBuyRate($nbpRate, 'BRL');

        $this->assertNull($buyRate); // BRL doesn't support buying
    }

    public function testCalculateSellRateForEUR(): void
    {
        $nbpRate = 4.3250;
        $sellRate = $this->calculator->calculateSellRate($nbpRate, 'EUR');

        $this->assertEquals(4.4350, $sellRate); // 4.3250 + 0.11 = 4.4350
    }

    public function testCalculateSellRateForUSD(): void
    {
        $nbpRate = 4.0000;
        $sellRate = $this->calculator->calculateSellRate($nbpRate, 'USD');

        $this->assertEquals(4.1100, $sellRate); // 4.0000 + 0.11 = 4.1100
    }

    public function testCalculateSellRateForCZK(): void
    {
        $nbpRate = 0.1850;
        $sellRate = $this->calculator->calculateSellRate($nbpRate, 'CZK');

        $this->assertEquals(0.3850, $sellRate); // 0.1850 + 0.20 = 0.3850
    }

    public function testCalculateSellRateForIDR(): void
    {
        $nbpRate = 0.0003;
        $sellRate = $this->calculator->calculateSellRate($nbpRate, 'IDR');

        $this->assertEquals(0.2003, $sellRate); // 0.0003 + 0.20 = 0.2003
    }

    public function testCalculateSellRateForBRL(): void
    {
        $nbpRate = 0.8200;
        $sellRate = $this->calculator->calculateSellRate($nbpRate, 'BRL');

        $this->assertEquals(1.0200, $sellRate); // 0.8200 + 0.20 = 1.0200
    }

    public function testCalculateBuyRateThrowsExceptionForUnsupportedCurrency(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Currency "XXX" is not supported');

        $this->calculator->calculateBuyRate(1.0, 'XXX');
    }

    public function testCalculateSellRateThrowsExceptionForUnsupportedCurrency(): void
    {
        $this->expectException(InvalidArgumentException::class);
        $this->expectExceptionMessage('Currency "YYY" is not supported');

        $this->calculator->calculateSellRate(1.0, 'YYY');
    }

    public function testIsCurrencySupportedReturnsTrueForSupportedCurrency(): void
    {
        $this->assertTrue($this->calculator->isCurrencySupported('EUR'));
        $this->assertTrue($this->calculator->isCurrencySupported('USD'));
        $this->assertTrue($this->calculator->isCurrencySupported('CZK'));
    }

    public function testIsCurrencySupportedReturnsFalseForUnsupportedCurrency(): void
    {
        $this->assertFalse($this->calculator->isCurrencySupported('GBP'));
        $this->assertFalse($this->calculator->isCurrencySupported('JPY'));
    }

    public function testGetSupportedCurrenciesReturnsArray(): void
    {
        $currencies = $this->calculator->getSupportedCurrencies();

        $this->assertIsArray($currencies);
        $this->assertCount(5, $currencies);
        $this->assertContains('EUR', $currencies);
        $this->assertContains('USD', $currencies);
        $this->assertContains('CZK', $currencies);
        $this->assertContains('IDR', $currencies);
        $this->assertContains('BRL', $currencies);
    }

    public function testRoundingToFourDecimalPlaces(): void
    {
        $nbpRate = 4.12345678;

        $buyRate = $this->calculator->calculateBuyRate($nbpRate, 'EUR');
        $sellRate = $this->calculator->calculateSellRate($nbpRate, 'EUR');

        // Check that results are rounded to 4 decimal places
        $this->assertEquals(3.9735, $buyRate); // 4.12345678 - 0.15 = 3.97345678 → 3.9735
        $this->assertEquals(4.2335, $sellRate); // 4.12345678 + 0.11 = 4.23345678 → 4.2335
    }
}
