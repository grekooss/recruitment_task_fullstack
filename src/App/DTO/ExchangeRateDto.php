<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Exchange rate DTO for current rates response
 * Extends BaseExchangeRate with currency code
 */
class ExchangeRateDto extends BaseExchangeRate
{
    private string $code;

    public function __construct(string $code, float $nbpAverageRate, ?float $buyRate, float $sellRate)
    {
        parent::__construct($nbpAverageRate, $buyRate, $sellRate);
        $this->code = $code;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function toArray(): array
    {
        return array_merge(
            ['code' => $this->code],
            parent::toArray()
        );
    }
}
