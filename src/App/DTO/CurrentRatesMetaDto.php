<?php

declare(strict_types=1);

namespace App\DTO;

use DateTimeInterface;

/**
 * Metadata for current rates response
 */
class CurrentRatesMetaDto
{
    private string $publicationDate;
    private bool $isStale;
    private string $lastSuccessfulUpdate;

    /**
     * @param string $publicationDate Date in YYYY-MM-DD format
     * @param bool $isStale Whether data is from stale cache
     * @param DateTimeInterface $lastSuccessfulUpdate ISO 8601 timestamp
     */
    public function __construct(string $publicationDate, bool $isStale, DateTimeInterface $lastSuccessfulUpdate)
    {
        $this->publicationDate = $publicationDate;
        $this->isStale = $isStale;
        $this->lastSuccessfulUpdate = $lastSuccessfulUpdate->format(DateTimeInterface::ATOM);
    }

    public function toArray(): array
    {
        return [
            'publicationDate' => $this->publicationDate,
            'isStale' => $this->isStale,
            'lastSuccessfulUpdate' => $this->lastSuccessfulUpdate,
        ];
    }
}
