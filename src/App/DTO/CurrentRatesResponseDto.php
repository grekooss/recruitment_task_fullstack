<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Full response DTO for current rates endpoint
 */
class CurrentRatesResponseDto
{
    private CurrentRatesMetaDto $meta;
    /** @var ExchangeRateDto[] */
    private array $data;

    /**
     * @param CurrentRatesMetaDto $meta
     * @param ExchangeRateDto[] $data
     */
    public function __construct(CurrentRatesMetaDto $meta, array $data)
    {
        $this->meta = $meta;
        $this->data = $data;
    }

    public function toArray(): array
    {
        return [
            'meta' => $this->meta->toArray(),
            'data' => array_map(fn(ExchangeRateDto $rate) => $rate->toArray(), $this->data),
        ];
    }
}
