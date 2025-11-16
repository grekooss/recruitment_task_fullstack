<?php

declare(strict_types=1);

namespace App\Controller;

use App\DTO\ErrorResponseDto;
use App\Exception\NBPApiException;
use App\Service\CurrencyService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Controller handling currency exchange rate API endpoints
 */
class CurrencyController extends AbstractController
{
    /**
     * GET /api/rates/current
     * Returns current exchange rates for all supported currencies
     */
    public function getCurrentRates(CurrencyService $service): Response
    {
        try {
            $responseDto = $service->getCurrentRates();

            return $this->json($responseDto->toArray(), Response::HTTP_OK);
        } catch (NBPApiException $e) {
            $errorDto = new ErrorResponseDto(
                'NBP_API_ERROR',
                'NBP API is temporarily unavailable. Showing cached data if available.'
            );

            return $this->json(
                $errorDto->toArray(),
                Response::HTTP_SERVICE_UNAVAILABLE
            );
        } catch (\Exception $e) {
            $errorDto = new ErrorResponseDto(
                'INTERNAL_ERROR',
                'An unexpected error occurred while fetching exchange rates.'
            );

            return $this->json(
                $errorDto->toArray(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * GET /api/rates/historical/{code}?date=YYYY-MM-DD
     * Returns historical exchange rates for specific currency (14 days)
     *
     * @param string $code Currency code (EUR, USD, CZK, IDR, BRL)
     */
    public function getHistoricalRates(string $code, Request $request, CurrencyService $service): Response
    {
        try {
            $date = $request->query->get('date');

            // Validate date format if provided
            if ($date !== null && !$this->isValidDate($date)) {
                $errorDto = new ErrorResponseDto(
                    'INVALID_DATE',
                    'Date parameter must be in YYYY-MM-DD format.'
                );

                return $this->json(
                    $errorDto->toArray(),
                    Response::HTTP_BAD_REQUEST
                );
            }

            $historicalRates = $service->getHistoricalRates($code, $date);

            return $this->json([
                'data' => array_map(
                    fn($rate) => $rate->toArray(),
                    $historicalRates
                )
            ], Response::HTTP_OK);
        } catch (\InvalidArgumentException $e) {
            $errorDto = new ErrorResponseDto(
                'INVALID_CURRENCY',
                sprintf('Currency "%s" is not supported.', $code)
            );

            return $this->json(
                $errorDto->toArray(),
                Response::HTTP_BAD_REQUEST
            );
        } catch (NBPApiException $e) {
            $errorDto = new ErrorResponseDto(
                'NBP_API_ERROR',
                sprintf('No data available for currency "%s" on the specified date.', $code)
            );

            return $this->json(
                $errorDto->toArray(),
                Response::HTTP_NOT_FOUND
            );
        } catch (\Exception $e) {
            $errorDto = new ErrorResponseDto(
                'INTERNAL_ERROR',
                'An unexpected error occurred while fetching historical rates.'
            );

            return $this->json(
                $errorDto->toArray(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Validate date format (YYYY-MM-DD)
     */
    private function isValidDate(string $date): bool
    {
        $d = \DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
}
