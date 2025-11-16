<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Base exchange rate DTO containing common fields for all rate responses
 */
class BaseExchangeRate
{
    private float $nbpAverageRate;
    private ?float $buyRate;
    private float $sellRate;

    public function __construct(float $nbpAverageRate, ?float $buyRate, float $sellRate)
    {
        $this->nbpAverageRate = $nbpAverageRate;
        $this->buyRate = $buyRate;
        $this->sellRate = $sellRate;
    }

    public function getNbpAverageRate(): float
    {
        return $this->nbpAverageRate;
    }

    public function getBuyRate(): ?float
    {
        return $this->buyRate;
    }

    public function getSellRate(): float
    {
        return $this->sellRate;
    }

    /**
     * Convert to array for JSON serialization
     */
    public function toArray(): array
    {
        return [
            'nbpAverageRate' => $this->nbpAverageRate,
            'buyRate' => $this->buyRate,
            'sellRate' => $this->sellRate,
        ];
    }
}
