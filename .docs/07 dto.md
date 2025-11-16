### Analiza DTO i Command Modeli

Na podstawie dostarczonego planu API i informacji o modelu, oto moja analiza i plan tworzenia typów TypeScript.

**Uwaga wstępna dotycząca modeli bazy danych:** Plan API wyraźnie stwierdza, że zasób `ExchangeRate` jest "nieutrwalany" i "obliczany". Oznacza to, że nie ma bezpośredniej encji bazy danych `ExchangeRate`, z której można by dziedziczyć typy. Dane są generowane w locie. Aby jednak zachować spójność i reużywalność, zdefiniuję bazowy, "konceptualny" typ `BaseExchangeRate`, który będzie reprezentował wspólne pola dla różnych odpowiedzi API. Ten bazowy typ posłuży jako substytut modelu encji, zapewniając, że powiązane DTO (np. dla kursów bieżących i historycznych) mają spójną definicję podstawowych pól.

**Uwaga dotycząca Command Modeli:** Plan API definiuje wyłącznie punkty końcowe oparte na metodzie `GET`, które służą do odczytu danych. Nie ma żadnych operacji `POST`, `PUT` ani `PATCH`, które wymagałyby przesyłania danych w ciele żądania w celu tworzenia lub modyfikacji zasobów. W związku z tym w tej specyfikacji nie ma żadnych Command Modeli. Moja analiza skupi się wyłącznie na DTO dla odpowiedzi API.

---

#### 1. Konceptualny model `BaseExchangeRate`

*   **Cel:** Stworzenie wspólnego, podstawowego typu dla danych kursu waluty, aby uniknąć powtórzeń i zapewnić spójność między różnymi DTO. Chociaż nie pochodzi on z fizycznej tabeli w bazie danych, działa jak model domeny.
*   **Odpowiednie encje:** Brak (zasób nieutrwalany). Reprezentuje podstawowe pola obliczeniowe.
*   **Narzędzia TypeScript:** Zwykła definicja typu (`type` lub `interface`).
*   **Szkic struktury:**
    ```typescript
    {
      nbpAverageRate: number;
      buyRate: number | null; // Może być null dla niektórych walut
      sellRate: number;
    }
    ```

#### 2. DTO dla odpowiedzi `GET /api/rates/current`

Ta odpowiedź składa się z trzech odrębnych części, które zdefiniuję jako osobne typy w celu zachowania czytelności i możliwości ponownego użycia.

##### 2.1. `ExchangeRateDto` (pojedynczy obiekt w tablicy `data`)

*   **Cel:** Reprezentuje pojedynczy, aktualny kurs waluty.
*   **Źródło:** Rozszerzenie konceptualnego modelu `BaseExchangeRate`.
*   **Transformacje:** Dodaje pole `code` (kod waluty), które jest specyficzne dla tej listy.
*   **Narzędzia TypeScript:** Użyję typu intersection (`&`), aby połączyć `BaseExchangeRate` z dodatkowym polem. To elegancko pokazuje, że ten DTO jest "kursem bazowym" plus informacją o jego kodzie.
*   **Szkic struktury:**
    ```typescript
    type ExchangeRateDto = BaseExchangeRate & {
      code: string;
    };
    // Wynikowa struktura:
    // {
    //   code: string;
    //   nbpAverageRate: number;
    //   buyRate: number | null;
    //   sellRate: number;
    // }
    ```

##### 2.2. `CurrentRatesMetaDto` (obiekt `meta`)

*   **Cel:** Reprezentuje metadane dołączone do odpowiedzi o bieżących kursach.
*   **Źródło:** Struktura unikalna dla tego punktu końcowego, nie ma powiązania z modelem.
*   **Transformacje:** Brak, definicja bezpośrednia.
*   **Narzędzia TypeScript:** Prosta definicja typu (`type`). Dodam komentarze JSDoc, aby wyjaśnić formaty dat w polach typu `string`.
*   **Szkic struktury:**
    ```typescript
    {
      publicationDate: string; // Format RRRR-MM-DD
      isStale: boolean;
      lastSuccessfulUpdate: string; // Format ISO 8601
    }
    ```

##### 2.3. `GetCurrentRatesResponseDto` (cała odpowiedź)

*   **Cel:** Reprezentuje pełną strukturę odpowiedzi dla punktu końcowego z bieżącymi kursami.
*   **Źródło:** Składa się z wcześniej zdefiniowanych `CurrentRatesMetaDto` i `ExchangeRateDto`.
*   **Transformacje:** Agreguje inne DTO w odpowiednią strukturę zagnieżdżoną.
*   **Narzędzia TypeScript:** Prosta definicja typu (`type`) odwołująca się do innych typów.
*   **Szkic struktury:**
    ```typescript
    {
      meta: CurrentRatesMetaDto;
      data: ExchangeRateDto[];
    }
    ```

#### 3. DTO dla odpowiedzi `GET /api/rates/historical/{currencyCode}`

Podobnie jak w poprzednim przypadku, zdefiniuję typ dla pojedynczego elementu oraz dla całej odpowiedzi.

##### 3.1. `HistoricalRateDto` (pojedynczy obiekt w tablicy `data`)

*   **Cel:** Reprezentuje pojedynczy, historyczny kurs waluty dla konkretnego dnia.
*   **Źródło:** Rozszerzenie konceptualnego modelu `BaseExchangeRate`.
*   **Transformacje:** Dodaje pole `date`, które jest kluczowe dla danych historycznych.
*   **Narzędzia TypeScript:** Ponownie użyję typu intersection (`&`), aby połączyć `BaseExchangeRate` z polem `date`. To podkreśla spójność z `ExchangeRateDto` – oba dzielą te same pola kursu.
*   **Szkic struktury:**
    ```typescript
    type HistoricalRateDto = BaseExchangeRate & {
      date: string; // Format RRRR-MM-DD
    };
    // Wynikowa struktura:
    // {
    //   date: string;
    //   nbpAverageRate: number;
    //   buyRate: number | null;
    //   sellRate: number;
    // }
    ```

##### 3.2. `GetHistoricalRatesResponseDto` (cała odpowiedź)

*   **Cel:** Reprezentuje pełną strukturę odpowiedzi dla punktu końcowego z kursami historycznymi.
*   **Źródło:** Wykorzystuje `HistoricalRateDto`.
*   **Transformacje:** Umieszcza tablicę `HistoricalRateDto` wewnątrz obiektu z kluczem `data`.
*   **Narzędzia TypeScript:** Prosta definicja typu (`type`).
*   **Szkic struktury:**
    ```typescript
    {
      data: HistoricalRateDto[];
    }
    ```

#### 4. DTO dla odpowiedzi błędu

*   **Cel:** Stworzenie standardowego, generycznego typu dla wszystkich odpowiedzi błędów API (np. 400, 404, 503).
*   **Źródło:** Zdefiniowany w planie API jako wspólny format.
*   **Transformacje:** Brak.
*   **Narzędzia TypeScript:** Prosta definicja typu (`type`).
*   **Szkic struktury:**
    ```typescript
    {
      error: string;
      message: string;
    }
    ```

---

**Podsumowanie zapewnienia spójności:**
Poprzez stworzenie konceptualnego typu `BaseExchangeRate` i użycie typów intersection (`&`) do zbudowania na jego podstawie bardziej specyficznych DTO (`ExchangeRateDto` i `HistoricalRateDto`), zapewniam, że podstawowa logika i struktura danych kursu waluty są zdefiniowane w jednym miejscu. Każda zmiana w `BaseExchangeRate` (np. dodanie nowego pola) zostanie automatycznie odzwierciedlona we wszystkich powiązanych DTO, co jest głównym celem dziedziczenia typów z modeli encji. To podejście w pełni realizuje intencję zadania, nawet przy braku fizycznego modelu bazy danych.
