### Tech Stack i Architektura

### 1. Backend (PHP Symfony)

Backend zostanie zaimplementowany jako API RESTful, którego zadaniem jest dostarczanie danych dla aplikacji front-endowej. Będzie on odpowiadał za komunikację z zewnętrznym API, implementację logiki biznesowej oraz zapewnienie wydajności przez mechanizmy cache.

*   **Framework:** **Symfony 4.4** (dla PHP 8.2)
    *   **Cel / Uzasadnienie:** Dojrzały i stabilny framework zapewniający solidne fundamenty dla API, w tym routing, kontener wstrzykiwania zależności (DI), obsługę błędów oraz komponenty do budowy wydajnych aplikacji. Projekt używa Symfony 4.4 zgodnie z istniejącą konfiguracją (`composer.json`).
    *   **UWAGA:** Symfony 4.4 jest starszą wersją - brak niektórych feature'ów z 5.x/6.x (np. atrybuty PHP 8, symfony/http-client).

*   **Komunikacja z API NBP:** **GuzzleHttp\Client 7.9**
    *   **Cel / Uzasadnienie:** Najpopularniejsza biblioteka HTTP dla PHP, już zainstalowana w projekcie (`guzzlehttp/guzzle: ^7.9`). Gwarantuje łatwą obsługę odpowiedzi, zarządzanie timeoutami, retry mechanism oraz niezawodną obsługę błędów połączenia, co jest kluczowe dla zapewnienia stabilności aplikacji.
    *   **Middleware:** Wykorzystanie Guzzle middleware do retry logic (3 próby z exponential backoff) i logowania requestów.

*   **Architektura API:** **RESTful**
    *   **Endpointy:** Dwa główne endpointy dostarczające dane w formacie JSON:
        1.  `GET /api/rates/current`: Zwraca listę aktualnych kursów walut z tabeli A NBP.
        2.  `GET /api/rates/historical/{currencyCode}?date=YYYY-MM-DD`: Zwraca historyczne dane kursów dla podanej waluty z 14 dni wstecz od wskazanej daty.
    *   **Serializacja:** **Manualne DTO + json_encode** lub **Symfony Serializer** (jeśli dostępny w projekcie) do transformacji obiektów PHP na format JSON. Ze względu na prostotę struktury odpowiedzi, preferowane jest użycie DTO z metodami `toArray()` i natywnego `json_encode()`.

*   **Logika Biznesowa:** **Dedykowany Serwis (`ExchangeRateService`)**
    *   **Cel / Uzasadnienie:** Zastosowanie zasady "Skinny Controllers, Fat Services". Cała logika biznesowa (pobieranie danych, aplikowanie marż, zaokrąglanie) zostanie odizolowana w serwisie, co ułatwi zarządzanie kodem i testowanie jednostkowe.

*   **Konfiguracja:** **Pliki konfiguracyjne Symfony (`services.yaml`, `.env`)**
    *   **Cel / Uzasadnienie:** Lista walut oraz wartości marż zostaną zdefiniowane jako parametry w pliku konfiguracyjnym. Pozwoli to na ich modyfikację bez ingerencji w kod źródłowy, zgodnie z dobrymi praktykami (oddzielenie konfiguracji od kodu).

*   **Cache'owanie:** **Symfony Cache Component 4.4 (Adapter `FilesystemAdapter`)**
    *   **Cel / Uzasadnienie:** Kluczowy element zapewniający wydajność i odporność na błędy API NBP. Odpowiedzi z NBP będą cache'owane z kluczem opartym o typ tabeli i datę (np. `nbp.table.a.2024-01-15`).
    *   **TTL:** 15 minut dla bieżących kursów, 24 godziny dla danych historycznych.
    *   **Stale Cache Strategy:** W przypadku niedostępności API NBP, aplikacja serwuje przeterminowane dane z cache, gwarantując ciągłość działania (dostępne w Symfony Cache 4.4).

*   **Testy:** **PHPUnit 8.5**
    *   **Cel / Uzasadnienie:** Standardowy framework do testowania w ekosystemie PHP, wersja 8.5 zgodna z Symfony 4.4 (zainstalowana w `composer.json`). Zostaną przygotowane:
        *   **Testy jednostkowe:** dla `ExchangeRateCalculator` w celu weryfikacji logiki biznesowej (marże, walidacja walut).
        *   **Testy jednostkowe z mockami:** dla `NBPApiClient` z mockowanym Guzzle HTTP client.
        *   **Testy integracyjne:** dla kontrolerów API przy użyciu `WebTestCase` do walidacji poprawności odpowiedzi HTTP i formatu JSON.
    *   **Test Coverage:** Cel ≥80% dla warstwy serwisowej (service layer).

---

### 2. Frontend (React)

Aplikacja kliencka będzie zbudowana w oparciu o React 17, aby zapewnić interaktywny i wydajny interfejs użytkownika.

*   **Biblioteka i Język:** **React 17 + JavaScript (ES6+)**
    *   **Cel / Uzasadnienie:** Projekt używa React 17 z JavaScript (nie TypeScript), zgodnie z istniejącą konfiguracją. React 17 jest stabilną wersją z pełnym wsparciem dla class components i React Router v5. JavaScript ES6+ z Babel zapewnia nowoczesną składnię (arrow functions, async/await, destructuring).
    *   **UWAGA:** Brak TypeScript oznacza brak type safety - zalecane użycie PropTypes lub JSDoc dla dokumentacji typów.

*   **Zarządzanie Stanem:** **Class Components z `this.state`** lub **React Hooks (`useState`, `useEffect`)**
    *   **Cel / Uzasadnienie:** Istniejący projekt używa class components (patrz `SetupCheck.js`). Dla spójności z kodem bazowym, nowe komponenty mogą używać class components. Alternatywnie, możliwe użycie functional components z hookami (React 17 wspiera oba podejścia).
    *   **Stan:** Dane, loading state, error state zarządzane lokalnie w komponentach.

*   **Struktura Komponentów:** Modułowa architektura z plikami `.js`
    *   `app.js`: Entry point Webpack (już istnieje).
    *   `Home.js`: Root component z React Router (już istnieje).
    *   `/components/Currency/CurrentRates.js`: Widok z tabelą bieżących kursów walut.
    *   `/components/Currency/HistoricalRates.js`: Widok z tabelą historycznych kursów (14 dni).
    *   `/components/Currency/CurrencySelector.js`: Dropdown wyboru waluty.
    *   `/components/Common/LoadingSpinner.js`: Wskaźnik ładowania danych (Bootstrap spinner).
    *   `/components/Common/ErrorAlert.js`: Komponent do wyświetlania komunikatów o błędach (Bootstrap alert).

*   **Dokumentacja Typów:** **JSDoc comments** lub plik `src/types.ts` jako dokumentacja
    *   **Cel / Uzasadnienie:** Brak TypeScript nie oznacza braku dokumentacji. Użycie JSDoc comments (`@typedef`, `@param`, `@returns`) lub TypeScript DefinitelyTyped dla IDE autocomplete. Plik `src/types.ts` może służyć jako dokumentacja struktur API.

*   **Komunikacja z API:** **Axios (już zainstalowany) w dedykowanym serwisie (`assets/js/services/api.js`)**
    *   **Cel / Uzasadnienie:** Axios jest już używany w projekcie (patrz `SetupCheck.js`). Izolacja logiki zapytań do backendu w module `api.js`. Funkcje asynchroniczne zwracające `Promise` z danymi API, obsługa błędów przez interceptory.

*   **Routing:** **React Router v5.3**
    *   **Cel / Uzasadnienie:** Standardowe rozwiązanie do nawigacji po stronie klienta w aplikacjach React, już używane w projekcie. React Router v5 (nie v6!) używa komponentów `<Switch>`, `<Route>`, `<Redirect>`. Umożliwi zdefiniowanie ścieżek: `/` (widok główny) oraz `/history` (widok historyczny).

*   **Styling:** **Bootstrap 5 + Custom CSS**
    *   **Cel / Uzasadnienie:** Bootstrap jest już zainstalowany i używany w projekcie (patrz `app.scss`). Wykorzystanie gotowych komponentów Bootstrap (table, alert, spinner, button, form-control) przyspieszy development. Custom CSS dla specyficznych stylizacji. Priorytetem będzie responsywność (RWD) z użyciem Bootstrap grid i media queries.

*   **Testy:** **Jest** (opcjonalnie - jeśli czas pozwoli)
    *   **Cel / Uzasadnienie:** Framework do testowania JavaScript, potencjalnie dostępny przez Webpack/Babel setup. Ze względu na priorytet backend testów (PHPUnit) i ograniczony czas, testy frontend są opcjonalne. Priorytet: manualne testy E2E w przeglądarce.

---

### 3. Narzędzia i Środowisko

*   **Środowisko deweloperskie:** **Docker i Docker Compose**
    *   **Cel / Uzasadnienie:** Zapewnienie spójnego, odizolowanego i łatwego do uruchomienia środowiska deweloperskiego dla wszystkich członków zespołu za pomocą jednej komendy.

*   **Kontrola wersji:** **Git**
    *   **Cel / Uzasadnienie:** Standard branżowy do zarządzania kodem źródłowym. Praca będzie prowadzona zgodnie z modelem: fork repozytorium, praca na dedykowanym branchu, a na koniec Pull Request.

*   **Bundler i Transpilator:** **Webpack Encore z Babel (`@babel/preset-react`)**
    *   **Cel / Uzasadnienie:** Webpack Encore (Symfony wrapper dla Webpack) jest już skonfigurowany w projekcie (`webpack.config.js`). Babel z `@babel/preset-react` transpiluje JSX i ES6+ do JavaScript kompatybilnego z przeglądarkami. Webpack buduje i optymalizuje wszystkie zasoby frontend (skrypty, style, obrazy) w paczki gotowe do wdrożenia (`public/build/`).
    *   **Watch Mode:** `npm run watch --dev` z pollingiem dla Docker/Windows compatibility.