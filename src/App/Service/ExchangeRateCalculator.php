<?php

declare(strict_types=1);

namespace App\Service;

use InvalidArgumentException;

/**
 * Service responsible for calculating buy and sell rates based on NBP average rate
 */
class ExchangeRateCalculator
{
    private const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'CZK', 'IDR', 'BRL'];

    private array $margins;
    private array $supportedCurrencies;

    /**
     * @param array $margins Currency margins configuration from services.yaml
     * @param array $supportedCurrencies List of supported currency codes
     */
    public function __construct(array $margins, array $supportedCurrencies)
    {
        $this->margins = $margins;
        $this->supportedCurrencies = $supportedCurrencies;
    }

    /**
     * Calculate buy rate for given currency
     * Returns null for currencies that don't support buying (CZK, IDR, BRL)
     *
     * @param float $nbpRate NBP average rate
     * @param string $currencyCode Currency code (EUR, USD, etc.)
     * @return float|null Buy rate or null if buying not supported
     * @throws InvalidArgumentException If currency is not supported
     */
    public function calculateBuyRate(float $nbpRate, string $currencyCode): ?float
    {
        $this->validateCurrency($currencyCode);

        $margin = $this->margins[$currencyCode]['buy'] ?? null;

        if ($margin === null) {
            return null; // Buying not supported for this currency
        }

        return round($nbpRate + $margin, 4);
    }

    /**
     * Calculate sell rate for given currency
     *
     * @param float $nbpRate NBP average rate
     * @param string $currencyCode Currency code (EUR, USD, etc.)
     * @return float Sell rate
     * @throws InvalidArgumentException If currency is not supported
     */
    public function calculateSellRate(float $nbpRate, string $currencyCode): float
    {
        $this->validateCurrency($currencyCode);

        $margin = $this->margins[$currencyCode]['sell'];

        return round($nbpRate + $margin, 4);
    }

    /**
     * Check if currency is supported
     */
    public function isCurrencySupported(string $currencyCode): bool
    {
        return in_array($currencyCode, $this->supportedCurrencies, true);
    }

    /**
     * Get list of supported currencies
     *
     * @return string[]
     */
    public function getSupportedCurrencies(): array
    {
        return $this->supportedCurrencies;
    }

    /**
     * @throws InvalidArgumentException
     */
    private function validateCurrency(string $currencyCode): void
    {
        if (!$this->isCurrencySupported($currencyCode)) {
            throw new InvalidArgumentException(
                sprintf(
                    'Currency "%s" is not supported. Supported currencies: %s',
                    $currencyCode,
                    implode(', ', $this->supportedCurrencies)
                )
            );
        }
    }
}
