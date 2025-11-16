<?php

declare(strict_types=1);

namespace App\DTO;

/**
 * Standardized error response DTO
 */
class ErrorResponseDto
{
    private string $error;
    private string $message;

    public function __construct(string $error, string $message)
    {
        $this->error = $error;
        $this->message = $message;
    }

    public function toArray(): array
    {
        return [
            'error' => $this->error,
            'message' => $this->message,
        ];
    }
}
