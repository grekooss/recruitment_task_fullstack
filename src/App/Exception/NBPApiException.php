<?php

declare(strict_types=1);

namespace App\Exception;

use RuntimeException;

/**
 * Exception thrown when NBP API communication fails
 */
class NBPApiException extends RuntimeException
{
    public static function fromHttpError(int $statusCode, string $message = ''): self
    {
        return new self(
            sprintf('NBP API returned HTTP %d: %s', $statusCode, $message),
            $statusCode
        );
    }

    public static function fromTimeout(): self
    {
        return new self('NBP API request timeout', 503);
    }

    public static function fromConnectionError(string $message): self
    {
        return new self(sprintf('NBP API connection error: %s', $message), 503);
    }
}
