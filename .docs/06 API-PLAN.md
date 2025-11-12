# Plan REST API

## 1. Zasoby

API operuje na pojedynczym, nieutrwalanym, obliczanym zasobie: `ExchangeRate` (Kurs Waluty). Zasób ten reprezentuje informacje o kursie dla danej waluty, przetworzone zgodnie z logiką biznesową kantoru.

-   **Zasób:** `ExchangeRate`
-   **Opis:** Obiekt zawierający kod waluty, oficjalny kurs średni NBP oraz obliczone kursy kupna i sprzedaży w oparciu o skonfigurowane marże. Jest generowany w locie na podstawie danych pobranych z API NBP i buforowany (cache'owany) w celu zapewnienia wydajności.

## 2. Punkty końcowe (Endpoints)

### 2.1. Aktualne kursy

Dostarcza listę najnowszych dostępnych kursów walut dla wszystkich skonfigurowanych walut.

-   **Metoda:** `GET`
-   **Ścieżka URL:** `/api/rates/current`
-   **Opis:** Pobiera najnowsze kursy walut opublikowane przez NBP, stosuje marże specyficzne dla kantoru, zaokrągla wartości i zwraca kompletną listę. Ten punkt końcowy jest przeznaczony do zasilania głównego pulpitu aplikacji (dashboardu).
-   **Parametry zapytania (query):** Brak
-   **Ciało żądania (body):** Brak

-   **Odpowiedź sukcesu (200 OK):**
    Obiekt JSON zawierający metadane oraz tablicę obiektów z kursami. Obiekt `meta` wskazuje datę publikacji kursów oraz informuje, czy dane są nieaktualne (serwowane z pamięci podręcznej z powodu awarii API NBP).

    ```json
    {
      "meta": {
        "publicationDate": "2023-10-27",
        "isStale": false,
        "lastSuccessfulUpdate": "2023-10-27T12:15:00Z"
      },
      "data": [
        {
          "code": "USD",
          "nbpAverageRate": 4.1855,
          "buyRate": 4.0355,
          "sellRate": 4.2955
        },
        {
          "code": "EUR",
          "nbpAverageRate": 4.4521,
          "buyRate": 4.3021,
          "sellRate": 4.5621
        },
        {
          "code": "CZK",
          "nbpAverageRate": 0.1810,
          "buyRate": null,
          "sellRate": 0.3810
        },
        {
          "code": "IDR",
          "nbpAverageRate": 0.0002,
          "buyRate": null,
          "sellRate": 0.2002
        },
        {
            "code": "BRL",
            "nbpAverageRate": 0.8400,
            "buyRate": null,
            "sellRate": 1.0400
        }
      ]
    }
    ```

-   **Odpowiedzi błędu:**
    -   **Kod:** `503 Service Unavailable`
    -   **Opis:** Zwracany, jeśli API NBP jest niedostępne ORAZ lokalna pamięć podręczna (cache) jest pusta (np. przy pierwszym uruchomieniu).
    -   **Ciało odpowiedzi:**
        ```json
        {
          "error": "Service Unavailable",
          "message": "Źródłowy dostawca kursów (NBP) jest obecnie niedostępny, a w pamięci podręcznej nie ma żadnych danych."
        }
        ```

### 2.2. Kursy historyczne

Dostarcza listę historycznych kursów dla jednej, określonej waluty z okresu 14 dni.

-   **Metoda:** `GET`
-   **Ścieżka URL:** `/api/rates/historical/{currencyCode}`
-   **Opis:** Pobiera historię kursów walut dzień po dniu dla podanego `{currencyCode}` z okresu 14 dni, kończącego się w dniu podanym jako `endDate`. Jeśli `endDate` nie zostanie podany, domyślnie przyjmowana jest bieżąca data.
-   **Parametry ścieżki (path):**
    -   `currencyCode` (string, wymagany): 3-literowy kod waluty wg ISO (np. `USD`).
-   **Parametry zapytania (query):**
    -   `endDate` (string, opcjonalny): Data końcowa dla 14-dniowego okresu historycznego, w formacie `RRRR-MM-DD`. Domyślnie dzisiejsza data.
-   **Ciało żądania (body):** Brak

-   **Odpowiedź sukcesu (200 OK):**
    Obiekt JSON zawierający tablicę obiektów z dziennymi kursami dla żądanego okresu. Tablica będzie pusta, jeśli NBP nie opublikowało żadnych danych w wybranym przedziale czasowym.

    ```json
    {
      "data": [
        {
          "date": "2023-10-27",
          "nbpAverageRate": 4.1855,
          "buyRate": 4.0355,
          "sellRate": 4.2955
        },
        {
          "date": "2023-10-26",
          "nbpAverageRate": 4.1730,
          "buyRate": 4.0230,
          "sellRate": 4.2830
        }
      ]
    }
    ```

-   **Odpowiedzi błędu:**
    -   **Kod:** `400 Bad Request`
    -   **Opis:** Zwracany, jeśli parametr `endDate` jest w nieprawidłowym formacie lub reprezentuje nieprawidłowy zakres (np. data z przyszłości).
    -   **Ciało odpowiedzi:**
        ```json
        {
          "error": "Bad Request",
          "message": "Nieprawidłowy format daty 'endDate'. Proszę użyć formatu RRRR-MM-DD. Data nie może być z przyszłości."
        }
        ```
    -   **Kod:** `404 Not Found`
    -   **Opis:** Zwracany, jeśli `{currencyCode}` nie jest obsługiwany lub jest nieprawidłowy.
    -   **Ciało odpowiedzi:**
        ```json
        {
          "error": "Not Found",
          "message": "Kod waluty 'XYZ' nie jest obsługiwany."
        }
        ```

## 3. Uwierzytelnianie i autoryzacja

-   **Mechanizm:** Brak uwierzytelniania i autoryzacji w wersji MVP. API jest przeznaczone do użytku wewnętrznego i będzie publicznie dostępne wewnątrz sieci firmowej. Jest to zgodne z sekcją 4 dokumentu PRD, która jawnie wyklucza zarządzanie użytkownikami z zakresu MVP.

## 4. Walidacja i logika biznesowa

### 4.1. Walidacja

-   **`GET /api/rates/historical/{currencyCode}`:**
    -   Parametr ścieżki `{currencyCode}` będzie walidowany, aby upewnić się, że jest to 3-znakowy ciąg wielkich liter i że istnieje na liście skonfigurowanych walut.
    -   Parametr zapytania `endDate` będzie walidowany, aby upewnić się, że jest w formacie `RRRR-MM-DD`, nie jest datą z przyszłości ani datą wcześniejszą niż `2002-01-02`.

### 4.2. Implementacja logiki biznesowej

Główna logika biznesowa jest zaimplementowana w dedykowanej warstwie serwisowej w backendzie, wywoływanej przez kontrolery API.

-   **Obliczanie marży:** Serwis stosuje marże w zależności od kodu waluty. Dla `EUR` i `USD` oblicza zarówno `buyRate`, jak i `sellRate`. Dla `CZK`, `IDR` i `BRL` oblicza tylko `sellRate` i ustawia `buyRate` na `null`. Wartości marż są odczytywane z pliku konfiguracyjnego po stronie serwera (`.env` lub `.yaml`), zgodnie z wymaganiem 3.2 z PRD.
-   **Zaokrąglanie danych:** Wszystkie obliczone wartości `buyRate` i `sellRate` są zaokrąglane do 4 miejsc po przecinku przed umieszczeniem ich w odpowiedzi API.
-   **Strategia cache'owania:**
    -   Serwis backendowy odpowiedzialny za pobieranie danych z API NBP implementuje wzorzec *cache-aside*.
    -   Przed wywołaniem API NBP dla konkretnej daty, sprawdza obecność ważnego wpisu w pamięci podręcznej (np. używając klucza `nbp_rates_2023-10-27`).
    -   Jeśli świeży wpis istnieje, jest on zwracany natychmiast.
    -   W przeciwnym wypadku, API NBP jest wywoływane, a jego odpowiedź jest przechowywana w pamięci podręcznej z czasem życia (TTL) wynoszącym kilka godzin (np. 4 godziny), a następnie zwracana.
-   **Obsługa błędów (niedostępność NBP):**
    -   Zgodnie z wymaganiem 3.5 z PRD, jeśli wywołanie API NBP zakończy się niepowodzeniem (np. timeout, błąd 5xx), serwis podejmie próbę pobrania ostatnich dostępnych danych z pamięci podręcznej, nawet jeśli wygasły (są nieaktualne).
    -   W takim scenariuszu API wciąż odpowie statusem `200 OK`, ale flaga `meta.isStale` w ciele odpowiedzi dla `/api/rates/current` zostanie ustawiona na `true`, a `meta.lastSuccessfulUpdate` wskaże, jak stare są dane. Pozwala to frontendowi na dalsze działanie i wyświetlenie wymaganego ostrzeżenia użytkownikowi.