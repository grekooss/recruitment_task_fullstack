<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Historical exchange rate DTO
 * Extends BaseExchangeRate with date
 */
class HistoricalRateDto extends BaseExchangeRate
{
    private string $date;

    public function __construct(string $date, float $nbpAverageRate, ?float $buyRate, float $sellRate)
    {
        parent::__construct($nbpAverageRate, $buyRate, $sellRate);
        $this->date = $date;
    }

    public function getDate(): string
    {
        return $this->date;
    }

    public function toArray(): array
    {
        return array_merge(
            ['date' => $this->date],
            parent::toArray()
        );
    }
}
