### Tech Stack i Architektura

### 1. Backend (PHP Symfony)

Backend zostanie zaimplementowany jako API RESTful, którego zadaniem jest dostarczanie danych dla aplikacji front-endowej. Będzie on odpowiadał za komunikację z zewnętrznym API, implementację logiki biznesowej oraz zapewnienie wydajności przez mechanizmy cache.

*   **Framework:** **Symfony 6+** (dla PHP 8.2)
    *   **Cel / Uzasadnienie:** Dojrzały i stabilny framework zapewniający solidne fundamenty dla API, w tym routing, kontener wstrzykiwania zależności (DI), obsługę błędów oraz komponenty do budowy wydajnych aplikacji.

*   **Komunikacja z API NBP:** **Komponent Symfony HttpClient**
    *   **Cel / Uzasadnienie:** Oficjalne narzędzie Symfony do wykonywania zapytań HTTP. Gwarantuje łatwą obsługę odpowiedzi, zarządzanie timeoutami i niezawodną obsługę błędów połączenia, co jest kluczowe dla zapewnienia stabilności aplikacji.

*   **Architektura API:** **RESTful**
    *   **Endpointy:** Dwa główne endpointy dostarczające dane w formacie JSON:
        1.  `GET /api/rates/current`: Zwraca listę aktualnych kursów walut z tabeli A NBP.
        2.  `GET /api/rates/historical/{currencyCode}?date=YYYY-MM-DD`: Zwraca historyczne dane kursów dla podanej waluty z 14 dni wstecz od wskazanej daty.
    *   **Serializacja:** **Komponent Symfony Serializer** do transformacji obiektów PHP na format JSON. Użycie grup serializacji pozwoli na precyzyjne dostosowanie pól w odpowiedziach dla każdego endpointu.

*   **Logika Biznesowa:** **Dedykowany Serwis (`ExchangeRateService`)**
    *   **Cel / Uzasadnienie:** Zastosowanie zasady "Skinny Controllers, Fat Services". Cała logika biznesowa (pobieranie danych, aplikowanie marż, zaokrąglanie) zostanie odizolowana w serwisie, co ułatwi zarządzanie kodem i testowanie jednostkowe.

*   **Konfiguracja:** **Pliki konfiguracyjne Symfony (`services.yaml`, `.env`)**
    *   **Cel / Uzasadnienie:** Lista walut oraz wartości marż zostaną zdefiniowane jako parametry w pliku konfiguracyjnym. Pozwoli to na ich modyfikację bez ingerencji w kod źródłowy, zgodnie z dobrymi praktykami (oddzielenie konfiguracji od kodu).

*   **Cache'owanie:** **Komponent Symfony Cache (Adapter `FilesystemAdapter`)**
    *   **Cel / Uzasadnienie:** Kluczowy element zapewniający wydajność i odporność na błędy API NBP. Odpowiedzi z NBP będą cache'owane z kluczem opartym o typ tabeli i datę (np. `nbp.table.a.2023-10-27`). W przypadku niedostępności API NBP, aplikacja serwuje przeterminowane dane z cache, gwarantując ciągłość działania.

*   **Testy:** **PHPUnit**
    *   **Cel / Uzasadnienie:** Standardowy framework do testowania w ekosystemie PHP. Zostaną przygotowane:
        *   **Testy jednostkowe:** dla `ExchangeRateService` w celu weryfikacji logiki biznesowej (marże, zaokrąglenia).
        *   **Testy funkcjonalne:** dla kontrolerów API przy użyciu `WebTestCase` do walidacji poprawności odpowiedzi HTTP i formatu JSON.

---

### 2. Frontend (React + TypeScript)

Aplikacja kliencka będzie zbudowana w oparciu o React i TypeScript, aby zapewnić interaktywny, wydajny i bezpieczny typologicznie interfejs użytkownika.

*   **Biblioteka i Język:** **React z TypeScript**
    *   **Cel / Uzasadnienie:** Połączenie deklaratywnego UI Reacta ze statycznym typowaniem TypeScript. Zapewnia to bezpieczeństwo danych (eliminacja błędów związanych z API), poprawia jakość kodu i ułatwia jego utrzymanie dzięki autouzupełnianiu i wczesnemu wykrywaniu błędów.

*   **Zarządzanie Stanem:** **Wbudowane Hooki Reacta (`useState`, `useEffect`)**
    *   **Cel / Uzasadnienie:** Dla prostoty i wydajności, stan aplikacji (dane, stan ładowania, błędy) będzie zarządzany lokalnie w komponentach za pomocą hooków. Wykorzystanie generyków w hookach zapewni pełne bezpieczeństwo typów, np. `useState<Rate[]>([])`.

*   **Struktura Komponentów:** Modułowa architektura z plikami `.tsx`
    *   `App.tsx`: Główny kontener aplikacji z konfiguracją routingu.
    *   `/views/DashboardView.tsx`: Widok z tabelą bieżących kursów walut.
    *   `/views/HistoricalView.tsx`: Widok z wykresem i tabelą historycznych kursów.
    *   `/components/RatesTable.tsx`: Komponent reużywalny do wyświetlania danych tabelarycznych z wbudowaną logiką sortowania i kopiowania. Będzie przyjmował silnie typowane propsy.
    *   `/components/LoadingSpinner.tsx`: Wskaźnik ładowania danych.
    *   `/components/ErrorNotification.tsx`: Komponent do wyświetlania komunikatów o błędach.

*   **Definicje Typów:** Centralny plik z interfejsami (np. `src/types/index.ts`)
    *   **Cel / Uzasadnienie:** Zdefiniowanie interfejsów (`interface Rate`, `interface HistoricalRate`) dla obiektów danych z API w jednym miejscu zapewni spójność i reużywalność typów w całej aplikacji.

*   **Komunikacja z API:** **Fetch API opakowane w dedykowany serwis (`src/services/api.ts`)**
    *   **Cel / Uzasadnienie:** Izolacja logiki zapytań do backendu w jednym module. Funkcje w tym serwisie będą asynchroniczne i zwracały silnie typowane dane (np. `Promise<Rate[]>`), co uprości ich użycie w komponentach.

*   **Routing:** **Biblioteka React Router**
    *   **Cel / Uzasadnienie:** Standardowe rozwiązanie do nawigacji po stronie klienta w aplikacjach React. Umożliwi zdefiniowanie ścieżek: `/` (widok główny) oraz `/history/:currencyCode` (widok historyczny).

*   **Styling:** **SCSS z metodologią BEM lub CSS Modules**
    *   **Cel / Uzasadnienie:** Zapewnienie hermetyzacji stylów i uniknięcie konfliktów w globalnej przestrzeni nazw. Priorytetem będzie responsywność (RWD) z użyciem media queries, aby zapewnić poprawne wyświetlanie na tabletach.

*   **Testy:** **Jest oraz React Testing Library**
    *   **Cel / Uzasadnienie:** Nowoczesny zestaw do testowania komponentów React z perspektywy użytkownika. Testy będą pisane w plikach `.test.tsx` i będą weryfikować m.in. renderowanie danych, interakcje (sortowanie, kopiowanie) oraz obsługę stanów ładowania i błędów.

---

### 3. Narzędzia i Środowisko

*   **Środowisko deweloperskie:** **Docker i Docker Compose**
    *   **Cel / Uzasadnienie:** Zapewnienie spójnego, odizolowanego i łatwego do uruchomienia środowiska deweloperskiego dla wszystkich członków zespołu za pomocą jednej komendy.

*   **Kontrola wersji:** **Git**
    *   **Cel / Uzasadnienie:** Standard branżowy do zarządzania kodem źródłowym. Praca będzie prowadzona zgodnie z modelem: fork repozytorium, praca na dedykowanym branchu, a na koniec Pull Request.

*   **Bundler i Transpilator:** **Webpack z Babel (`@babel/preset-typescript`)**
    *   **Cel / Uzasadnienie:** Babel będzie odpowiedzialny za transpilację kodu TypeScript (TS/TSX) do standardowego JavaScriptu, a Webpack za budowanie i optymalizację wszystkich zasobów front-endowych (skrypty, style) w paczki gotowe do wdrożenia.