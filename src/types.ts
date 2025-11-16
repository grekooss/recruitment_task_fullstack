/**
 * @fileoverview Ten plik zawiera definicje typów TypeScript dla obiektów DTO (Data Transfer Object)
 * używanych w API aplikacji kantoru. Typy te precyzyjnie opisują struktury danych
 * zwracane przez punkty końcowe API, zapewniając bezpieczeństwo typów w aplikacji klienckiej.
 */

// --- Modele Konceptualne ---

/**
 * Reprezentuje podstawowe, obliczone dane kursu waluty.
 * Ten typ służy jako wspólna podstawa dla różnych DTO związanych z kursami,
 * zapewniając spójność. Nie odpowiada bezpośrednio żadnej encji w bazie danych,
 * ponieważ kursy są obliczane w locie.
 */
export type BaseExchangeRate = {
  /** Oficjalny kurs średni opublikowany przez NBP. */
  nbpAverageRate: number;
  /** Obliczony kurs kupna waluty przez kantor. Może być `null`, jeśli kantor nie skupuje danej waluty. */
  buyRate: number | null;
  /** Obliczony kurs sprzedaży waluty przez kantor. */
  sellRate: number;
};

// --- DTOs dla punktu końcowego /api/rates/current ---

/**
 * DTO reprezentujący pojedynczy, aktualny kurs waluty z dołączonym kodem waluty.
 * Rozszerza `BaseExchangeRate` o unikalny identyfikator waluty.
 */
export type ExchangeRateDto = BaseExchangeRate & {
  /** 3-literowy kod waluty zgodny z ISO 4217 (np. "USD", "EUR"). */
  code: string;
};

/**
 * DTO dla obiektu `meta` w odpowiedzi z aktualnymi kursami.
 * Zawiera informacje o pochodzeniu i aktualności danych.
 */
export type CurrentRatesMetaDto = {
  /**
   * Data publikacji kursów przez NBP.
   * @format `RRRR-MM-DD`
   */
  publicationDate: string;
  /**
   * Flaga wskazująca, czy dane są nieaktualne (serwowane z pamięci podręcznej z powodu awarii API NBP).
   * `true` oznacza dane nieaktualne, `false` oznacza dane aktualne.
   */
  isStale: boolean;
  /**
   * Znacznik czasowy ostatniej udanej aktualizacji danych z API NBP.
   * @format ISO 8601 (np. `2023-10-27T12:15:00Z`)
   */
  lastSuccessfulUpdate: string;
};

/**
 * DTO dla pełnej, udanej odpowiedzi z punktu końcowego `GET /api/rates/current`.
 */
export type GetCurrentRatesResponseDto = {
  meta: CurrentRatesMetaDto;
  data: ExchangeRateDto[];
};

// --- DTOs dla punktu końcowego /api/rates/historical/{currencyCode} ---

/**
 * DTO reprezentujący pojedynczy, historyczny kurs waluty dla określonego dnia.
 * Rozszerza `BaseExchangeRate` o datę, dla której kurs został zarejestrowany.
 */
export type HistoricalRateDto = BaseExchangeRate & {
  /**
   * Data, dla której obowiązuje dany kurs.
   * @format `RRRR-MM-DD`
   */
  date: string;
};

/**
 * DTO dla pełnej, udanej odpowiedzi z punktu końcowego `GET /api/rates/historical/{currencyCode}`.
 */
export type GetHistoricalRatesResponseDto = {
  data: HistoricalRateDto[];
};

// --- Generyczne DTOs ---

/**
 * Standardowy DTO dla odpowiedzi błędu z API.
 * Używany dla kodów statusu HTTP 4xx i 5xx.
 */
export type ApiErrorDto = {
  /** Krótki, techniczny opis błędu (np. "Not Found", "Bad Request"). */
  error: string;
  /** Przyjazny dla użytkownika komunikat wyjaśniający przyczynę błędu. */
  message: string;
};