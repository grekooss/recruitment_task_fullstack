# Plan Wdrożenia Aplikacji Kantorowej

## 📋 Streszczenie Wymagań

**Aplikacja dla pracownika kantoru wyświetlająca:**
- Bieżące kursy walut: EUR, USD, CZK, IDR, BRL
- Historia kursów (14 dni wstecz od wybranej daty)
- Obliczenia kursów kupna/sprzedaży wg reguł:
  - **EUR/USD**: kupno = NBP - 0.15 PLN, sprzedaż = NBP + 0.11 PLN
  - **Inne (CZK/IDR/BRL)**: brak kupna, sprzedaż = NBP + 0.20 PLN

**Ograniczenia techniczne:**
- ✅ Użycie tylko istniejących pakietów (composer/npm)
- ✅ Dane NBP tylko z backendu (nie z przeglądarki)
- ✅ Wydajność dla wielu użytkowników (cache)
- ✅ Testy obowiązkowe (PHPUnit 8.5)
- ✅ **Symfony 4.4** (nie 6+!) + React 17 + PHP 8.2

**UWAGA:** Projekt używa Symfony 4.4 (sprawdzone w `composer.json`), mimo że dokument TECH-STACK.md wspomina o Symfony 6+. Plan implementacji uwzględnia ograniczenia Symfony 4.4.

---

## 🏗️ Architektura Rozwiązania

### Backend (Symfony 4.4 + PHP 8.2)

#### 1. Warstwa Serwisowa

```
src/App/Service/
├── NBPApiClient.php              # Klient API NBP z retry mechanism
├── ExchangeRateCalculator.php    # Logika obliczania kursów kupna/sprzedaży
└── CurrencyService.php           # Fasada łącząca NBP client + calculator
```

**NBPApiClient:**
- HTTP Client: **GuzzleHttp\Client** (już zainstalowany: `^7.9` - patrz composer.json)
- Metody: `fetchCurrentRates()`, `fetchHistoricalRates(code, date)`
- Cache Symfony Cache (FilesystemAdapter): 15 min dla current, 24h dla historical
- Retry mechanism: 3 próby z exponential backoff (Guzzle retry middleware)
- Exception handling: `NBPApiException` dla błędów 404, 503, timeout
- Fallback: w przypadku błędu zwraca dane z cache (stale cache strategy)

**WAŻNE:** Symfony 4.4 nie ma `symfony/http-client` - używamy **Guzzle 7.9** (już w projekcie)

**ExchangeRateCalculator:**
- `calculateBuyRate(float $nbpRate, string $code): ?float`
- `calculateSellRate(float $nbpRate, string $code): float`
- Walidacja walut obsługiwanych: EUR, USD, CZK, IDR, BRL
- Logika marż zgodnie z wymaganiami

**CurrencyService (Facade):**
- `getCurrentRates(): CurrentRatesResponseDto`
- `getHistoricalRates(string $code, ?string $date): array<HistoricalRateDto>`
- Koordynacja: NBP client → calculator → DTO mapping

#### 2. Data Transfer Objects (DTO)

```
src/App/DTO/
├── BaseExchangeRate.php           # Bazowy typ (nbpRate, buyRate, sellRate)
├── ExchangeRateDto.php            # Pojedynczy kurs (extends Base + code)
├── CurrentRatesMetaDto.php        # Metadane (publicationDate, isStale, lastUpdate)
├── CurrentRatesResponseDto.php    # Pełna odpowiedź (meta + data[])
├── HistoricalRateDto.php          # Kurs historyczny (extends Base + date)
└── ErrorResponseDto.php           # Standaryzowane błędy
```

**Struktura JSON dla `/api/rates/current`:**
```json
{
  "meta": {
    "publicationDate": "2024-01-15",
    "isStale": false,
    "lastSuccessfulUpdate": "2024-01-15T12:05:23+00:00"
  },
  "data": [
    {
      "code": "EUR",
      "nbpAverageRate": 4.3250,
      "buyRate": 4.1750,
      "sellRate": 4.4350
    }
  ]
}
```

**Struktura JSON dla `/api/rates/historical/EUR?date=2024-01-15`:**
```json
{
  "data": [
    {
      "date": "2024-01-15",
      "nbpAverageRate": 4.3250,
      "buyRate": 4.1750,
      "sellRate": 4.4350
    },
    {
      "date": "2024-01-14",
      "nbpAverageRate": 4.3180,
      "buyRate": 4.1680,
      "sellRate": 4.4280
    }
  ]
}
```

#### 3. Kontrolery i Routing

```php
// src/App/Controller/CurrencyController.php
class CurrencyController extends AbstractController
{
    public function getCurrentRates(CurrencyService $service): Response
    public function getHistoricalRates(string $code, Request $request, CurrencyService $service): Response
}
```

```yaml
# config/routes.yaml
# UWAGA: Symfony 4.4 używa tradycyjnego YAML routing (nie atrybutów PHP 8)
api_rates_current:
    path: /api/rates/current
    controller: App\Controller\CurrencyController::getCurrentRates
    methods: [GET]

api_rates_historical:
    path: /api/rates/historical/{code}
    controller: App\Controller\CurrencyController::getHistoricalRates
    methods: [GET]
    requirements:
        code: 'EUR|USD|CZK|IDR|BRL'
```

#### 4. Konfiguracja (services.yaml)

```yaml
parameters:
    app.supported_currencies:
        - EUR
        - USD
        - CZK
        - IDR
        - BRL

    app.currency_margins:
        EUR: { buy: -0.15, sell: 0.11 }
        USD: { buy: -0.15, sell: 0.11 }
        CZK: { buy: null, sell: 0.20 }
        IDR: { buy: null, sell: 0.20 }
        BRL: { buy: null, sell: 0.20 }

    app.nbp_api_base_url: 'https://api.nbp.pl/api'
    app.cache_ttl_current: 900      # 15 min
    app.cache_ttl_historical: 86400 # 24h

services:
    # UWAGA: Symfony 4.4 - używamy Guzzle zamiast symfony/http-client
    GuzzleHttp\Client:
        arguments:
            - timeout: 5
              connect_timeout: 3

    App\Service\NBPApiClient:
        arguments:
            $httpClient: '@GuzzleHttp\Client'
            $cache: '@cache.app'
            $baseUrl: '%app.nbp_api_base_url%'
            $currentTtl: '%app.cache_ttl_current%'
            $historicalTtl: '%app.cache_ttl_historical%'

    App\Service\ExchangeRateCalculator:
        arguments:
            $margins: '%app.currency_margins%'
            $supportedCurrencies: '%app.supported_currencies%'
```

---

### Frontend (React 17 + Bootstrap)

#### 1. Struktura Komponentów

```
assets/js/
├── app.js                         # Entry point
├── components/
│   ├── Home.js                    # Root component z routing
│   ├── Currency/
│   │   ├── CurrentRates.js        # Tabela bieżących kursów
│   │   ├── HistoricalRates.js     # Wykres/tabela historii
│   │   ├── CurrencySelector.js    # Wybór waluty + date picker
│   │   └── RateCard.js            # Card pojedynczego kursu
│   └── Common/
│       ├── ErrorBoundary.js       # React Error Boundary
│       ├── LoadingSpinner.js      # Wskaźnik ładowania
│       └── ErrorAlert.js          # Alert Bootstrap dla błędów API
└── services/
    └── api.js                     # Axios wrapper dla API calls
```

#### 2. Komponenty - Specyfikacja

**CurrentRates.js:**
- Wyświetla tabelę Bootstrap z 5 walutami
- Kolumny: Waluta (kod + nazwa) | Kurs NBP | Kupno | Sprzedaż
- Auto-refresh co 5 minut (opcjonalny)
- Status publikacji NBP: badge (success/warning) z datą
- Loading state podczas pobierania danych
- Error handling z możliwością retry

**HistoricalRates.js:**
- Dropdown wyboru waluty (EUR, USD, CZK, IDR, BRL)
- Date picker (default: dzisiejsza data)
- Przycisk "Pokaż historię" (trigger fetch)
- Tabela 14 wierszy (14 dni wstecz od wybranej daty)
- Sortowanie po dacie (desc domyślnie)
- Opcjonalnie: prosty wykres liniowy (chart.js/recharts - jeśli dostępny)

**CurrencySelector.js:**
- Reusable component dla wyboru waluty
- Props: `currencies`, `selectedCurrency`, `onChange`

**ErrorBoundary.js:**
- Catch React runtime errors
- Fallback UI: "Coś poszło nie tak, odśwież stronę"
- Console.error logging w dev mode

#### 3. Routing (React Router v5)

```jsx
// Home.js
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

<Router>
  <Switch>
    <Route exact path="/" component={CurrentRates} />
    <Route path="/history" component={HistoricalRates} />
    <Redirect to="/" />
  </Switch>
</Router>
```

#### 4. API Service (axios)

```javascript
// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://telemedi-zadanie.localhost/api';

export const fetchCurrentRates = async () => {
  const response = await axios.get(`${API_BASE_URL}/rates/current`);
  return response.data;
};

export const fetchHistoricalRates = async (currencyCode, date) => {
  const params = date ? { date } : {};
  const response = await axios.get(
    `${API_BASE_URL}/rates/historical/${currencyCode}`,
    { params }
  );
  return response.data;
};
```

#### 5. Error Handling Strategy

**Backend Errors:**
- 400 Bad Request → "Nieprawidłowe parametry żądania"
- 404 Not Found → "Brak danych dla wybranej daty/waluty"
- 503 Service Unavailable → "API NBP chwilowo niedostępne, wyświetlamy ostatnie dane"
- 500 Internal Server Error → "Błąd serwera, spróbuj ponownie"

**Frontend Handling:**
```jsx
try {
  const data = await fetchCurrentRates();
  setState({ data, loading: false, error: null });
} catch (error) {
  const message = error.response?.data?.message || 'Błąd połączenia';
  setState({ data: [], loading: false, error: message });
}
```

---

## 🧪 Strategia Testowania

### Backend Tests (PHPUnit 8.5)

#### 1. Unit Tests

```
tests/Unit/Service/
├── ExchangeRateCalculatorTest.php
│   ├── testCalculateBuyRateForEUR()        # NBP - 0.15
│   ├── testCalculateBuyRateForUSD()        # NBP - 0.15
│   ├── testCalculateBuyRateForCZK()        # null
│   ├── testCalculateSellRateForEUR()       # NBP + 0.11
│   ├── testCalculateSellRateForCZK()       # NBP + 0.20
│   └── testInvalidCurrencyThrowsException()
│
└── NBPApiClientTest.php
    ├── testFetchCurrentRatesSuccess()      # Mock HttpClient
    ├── testFetchCurrentRatesWithCache()    # Verify cache hit
    ├── testFetchCurrentRatesApiFailure()   # Fallback to stale cache
    └── testFetchHistoricalRatesSuccess()
```

#### 2. Integration Tests

```
tests/Integration/Controller/
└── CurrencyControllerTest.php
    ├── testGetCurrentRatesReturns200()
    ├── testGetCurrentRatesJsonStructure()  # Validate meta + data
    ├── testGetHistoricalRatesReturns200()
    ├── testGetHistoricalRatesInvalidCode() # 400 error
    └── testGetHistoricalRatesInvalidDate() # 400 error
```

**Test Coverage Target:** ≥80% dla service layer, ≥60% ogólnie

### Frontend Tests (opcjonalnie - jeśli czas pozwoli)

```javascript
// CurrentRates.test.js
describe('CurrentRates', () => {
  test('renders loading spinner initially', () => {});
  test('renders table with 5 currencies', () => {});
  test('displays error message on API failure', () => {});
  test('shows stale badge when isStale=true', () => {});
});
```

---

## 📅 Plan Implementacji - Kolejność Kroków

### **FAZA 1: Backend Foundation (Dzień 1-2)**

#### Dzień 1: Core Services
- [x] **Krok 1.1:** Stworzenie `NBPApiClient` (4h)
  - Implementacja HTTP client (Symfony HttpClient)
  - Cache integration (FilesystemAdapter)
  - Retry mechanism (3 attempts)
  - Exception handling
  - Unit testy z mock HTTP responses

- [x] **Krok 1.2:** Stworzenie `ExchangeRateCalculator` (2h)
  - Logika marż dla EUR/USD
  - Logika marż dla CZK/IDR/BRL
  - Walidacja walut obsługiwanych
  - Unit testy dla wszystkich scenariuszy

#### Dzień 2: API Layer
- [x] **Krok 1.3:** Stworzenie `CurrencyService` (2h)
  - Fasada łącząca NBP client + calculator
  - DTO mapping
  - Integration tests

- [x] **Krok 1.4:** Implementacja DTO (1h)
  - Wszystkie klasy DTO z właściwymi typami
  - Serialization groups (jeśli używasz Serializer)

- [x] **Krok 1.5:** Controller + Routing (2h)
  - `CurrencyController` z dwoma metodami
  - Routing w `config/routes.yaml`
  - Request validation (date format, currency code)
  - Response formatting (JSON)

- [x] **Krok 1.6:** Konfiguracja (1h)
  - `services.yaml` z parametrami
  - `.env` dla konfigurowalnych wartości
  - Cache configuration

- [x] **Krok 1.7:** Integration Tests (2h)
  - Testy end-to-end dla obu endpointów
  - Scenariusze błędów (404, 400, 503)
  - Walidacja struktury JSON

**Checkpoint:** Backend API działa lokalnie, testy przechodzą (≥80% coverage)

---

### **FAZA 2: Frontend Implementation (Dzień 3-4)**

#### Dzień 3: Core Components
- [ ] **Krok 2.1:** API Service Layer (1h)
  - `services/api.js` z axios
  - Base URL configuration
  - Error interceptors

- [ ] **Krok 2.2:** CurrentRates Component (3h)
  - Fetch data on mount
  - Render Bootstrap table
  - Loading state
  - Error handling z retry button
  - Meta info display (publication date, stale badge)

- [ ] **Krok 2.3:** Common Components (2h)
  - `LoadingSpinner.js`
  - `ErrorAlert.js` (Bootstrap alert)
  - `ErrorBoundary.js`

#### Dzień 4: Historical View
- [ ] **Krok 2.4:** HistoricalRates Component (4h)
  - Currency selector dropdown
  - Date picker (HTML5 date input)
  - Fetch on button click
  - Render table z 14 wierszami
  - Loading/error states

- [ ] **Krok 2.5:** Routing Setup (1h)
  - Update `Home.js` z React Router
  - Navigation menu (Bootstrap navbar)
  - Active route highlighting

- [ ] **Krok 2.6:** UI Polish (2h)
  - Responsywność mobile (media queries)
  - Bootstrap theme customization
  - Icons (Bootstrap Icons/Font Awesome jeśli dostępne)
  - Empty states ("Wybierz walutę aby zobaczyć historię")

**Checkpoint:** Frontend działa lokalnie, wszystkie widoki renderują dane z API

---

### **FAZA 3: Optimization & Polish (Dzień 5)**

#### Performance
- [ ] **Krok 3.1:** Backend Optimization (2h)
  - Cache warming strategy
  - HTTP client timeout configuration (5s)
  - Response compression (gzip)
  - Opcjonalnie: parallel NBP requests

- [ ] **Krok 3.2:** Frontend Optimization (2h)
  - React.memo dla komponentów
  - Debounce na date picker (300ms)
  - Lazy loading dla route'ów (React.lazy)
  - Webpack optimization (production build)

#### UX Improvements
- [ ] **Krok 3.3:** User Experience (2h)
  - Auto-refresh dla CurrentRates (optional)
  - Toast notifications (Bootstrap toasts)
  - Copy to clipboard dla kursów
  - Keyboard shortcuts (Enter w date picker)

- [ ] **Krok 3.4:** Error Scenarios Testing (1h)
  - Symulacja API NBP offline
  - Symulacja slow network (throttling)
  - Edge cases (weekend dates, holidays)

**Checkpoint:** Aplikacja zoptymalizowana, UX dopracowany

---

### **FAZA 4: Documentation & Delivery (Dzień 6)**

#### Documentation
- [ ] **Krok 4.1:** Code Documentation (1h)
  - PHPDoc dla wszystkich metod publicznych
  - JSDoc dla functions/components
  - Inline comments dla złożonej logiki

- [ ] **Krok 4.2:** README Update (1h)
  - Installation instructions
  - API endpoints documentation
  - Environment variables
  - Testing commands
  - Architecture decisions

#### Testing & Cleanup
- [ ] **Krok 4.3:** Manual E2E Testing (2h)
  - Pełny flow użytkownika
  - Wszystkie edge cases
  - Cross-browser testing (Chrome, Firefox)
  - Mobile testing (responsive)

- [ ] **Krok 4.4:** Code Cleanup (1h)
  - Remove console.logs
  - Format code (PSR-12, ESLint)
  - Remove unused imports
  - Git history cleanup

#### Video Preparation
- [ ] **Krok 4.5:** Demo Video (3-5 min) (2h)
  - **Intro (30s):** Cel aplikacji, tech stack
  - **Demo (2min):** Pokazanie działania:
    - Widok bieżących kursów
    - Wybór waluty w widoku historycznym
    - Wybór daty i wyświetlenie 14 dni
    - Pokazanie metadanych (stale badge)
    - Demonstracja error handling
  - **Code Walkthrough (1.5min):** Pokazanie kodu:
    - Backend: Service layer architecture
    - Cache strategy z fallbackiem
    - Frontend: Component structure
  - **Design Decisions (1min):** Wytłumaczenie:
    - Dlaczego cache 15 min? (NBP publikuje o 12:00)
    - Dlaczego Facade pattern? (Separation of concerns)
    - Dlaczego stale cache fallback? (Reliability)
    - Jak zapewniona wydajność? (Cache + retry)

**Checkpoint:** Aplikacja gotowa do oddania, video nagrane

---

## ⏱️ Estymacja Czasu

| Faza | Zadania | Czas |
|------|---------|------|
| **FAZA 1: Backend** | NBP Client, Calculator, Service, Controller, Tests | 14h |
| **FAZA 2: Frontend** | Components, Routing, API Integration | 13h |
| **FAZA 3: Optimization** | Performance, UX, Error Handling | 7h |
| **FAZA 4: Delivery** | Documentation, Testing, Video | 5h |
| **TOTAL** | | **39h** (~5 dni roboczych) |

**Bufor:** 20% = +8h (dla nieprzewidzianych problemów)
**Całkowity czas:** ~47h (6 dni roboczych)

---

## 🚀 Quick Start Guide

### Uruchomienie Środowiska

```bash
# 1. Pobranie zależności
composer install
npm install

# 2. Uruchomienie Docker
docker compose up -d

# 3. Build frontend
npm run watch --dev

# 4. Dostęp do aplikacji
open http://telemedi-zadanie.localhost
```

### Testowanie

```bash
# Backend tests
php vendor/bin/phpunit

# Specific test class
php vendor/bin/phpunit tests/Unit/Service/ExchangeRateCalculatorTest.php

# With coverage (wymaga xdebug)
php vendor/bin/phpunit --coverage-html coverage/

# Frontend build (production)
npm run build
```

---

## 📝 Checklist Przed Oddaniem

### Backend ✅
- [ ] API `/api/rates/current` zwraca 200 + poprawny JSON
- [ ] API `/api/rates/historical/{code}` zwraca 200 + poprawny JSON
- [ ] Parametr `?date=YYYY-MM-DD` działa prawidłowo
- [ ] Walidacja: nieprawidłowy kod waluty → 400
- [ ] Walidacja: nieprawidłowy format daty → 400
- [ ] Cache działa (verify logs/debug)
- [ ] Fallback do stale cache przy błędzie NBP API
- [ ] Testy PHPUnit przechodzą (green)
- [ ] Coverage ≥80% dla service layer
- [ ] PHPDoc dla wszystkich public methods

### Frontend ✅
- [ ] Widok bieżących kursów wyświetla 5 walut
- [ ] Kursy kupna/sprzedaży obliczone prawidłowo
- [ ] Widok historyczny działa dla wszystkich walut
- [ ] Date picker wyświetla 14 dni wstecz
- [ ] Loading spinners podczas fetch
- [ ] Error handling z user-friendly messages
- [ ] Responsywność mobile (test na <768px)
- [ ] Base URL konfigurowalny (nie hardcoded)
- [ ] Brak console.errors w production build
- [ ] Kod sformatowany (ESLint, Prettier)

### Infrastructure ✅
- [ ] Docker compose up działa bez błędów
- [ ] Aplikacja dostępna pod http://telemedi-zadanie.localhost
- [ ] .env.example z komentarzami
- [ ] README zaktualizowany z instrukcjami
- [ ] Git history clean (sensowne commit messages)
- [ ] Brak wrażliwych danych w repo (API keys, etc.)

### Video ✅
- [ ] Długość 3-5 minut
- [ ] Demo pełnego flow aplikacji
- [ ] Pokazanie kodu (backend + frontend)
- [ ] Wytłumaczenie design decisions:
  - Architektura (service layer, facade)
  - Cache strategy (TTL, fallback)
  - Error handling (retry, stale data)
  - Performance (concurrent users)
- [ ] Audio quality OK (bez szumów)
- [ ] Screen recording w HD (readable text)
- [ ] Upload na YouTube/Vimeo/Google Drive
- [ ] Link dodany do maila

---

## 🎯 Decyzje Projektowe - Uzasadnienia

### 1. Cache Strategy (15 min dla current, 24h dla historical)

**Decyzja:** Cache z TTL 15 min dla bieżących kursów, 24h dla historycznych

**Uzasadnienie:**
- NBP publikuje kursy codziennie o godzinie 12:00
- 15 min TTL zapewnia świeże dane bez overload API NBP
- Historyczne dane są immutable → długi cache (24h)
- Stale cache fallback zapewnia 100% uptime aplikacji

### 2. Service Layer Architecture (Facade Pattern)

**Decyzja:** Oddzielne serwisy (NBPApiClient, Calculator, CurrencyService)

**Uzasadnienie:**
- **Single Responsibility:** Każdy serwis ma jeden cel
- **Testability:** Łatwe unit testy z mockami
- **Maintainability:** Zmiana logiki kalkulacji nie wpływa na HTTP client
- **Facade pattern:** CurrencyService jako prosty interfejs dla kontrolera

### 3. DTO zamiast Entity

**Decyzja:** Użycie DTO bez ORM/bazy danych

**Uzasadnienie:**
- Dane są obliczane dynamicznie (nie przechowywane)
- DTO jasno definiuje kontrakt API
- Brak potrzeby persistence layer → prostsze rozwiązanie
- Type safety w PHP 8.2 (strict types)

### 4. React Class Components (nie Hooks)

**Decyzja:** Class components zgodnie z React 17 w projekcie

**Uzasadnienie:**
- Istniejąca baza kodu używa class components
- Spójność z `SetupCheck.js` i innymi komponentami
- Brak potrzeby migracji na Hooks dla tego scope'u
- Hooks możliwe w przyszłości (backward compatible)

### 5. No TypeScript Frontend

**Decyzja:** JavaScript zamiast TypeScript (pomimo `src/types.ts`)

**Uzasadnienie:**
- Istniejący projekt to JavaScript + React
- Dodanie TypeScript wymaga znacznej konfiguracji Webpack
- Czas implementacji vs. benefit (małe scope)
- Type safety zapewnione przez PropTypes (jeśli dodane)
- Note: Plik `src/types.ts` może być użyty jako dokumentacja struktur

### 6. Bootstrap (nie Custom CSS Framework)

**Decyzja:** Użycie Bootstrap z istniejącego projektu

**Uzasadnienie:**
- Już zainstalowany i skonfigurowany
- Szybkie prototypowanie tabel, alertów, formularzy
- Responsywność out-of-the-box
- Pracownik kantoru potrzebuje czytelności > custom design

### 7. No Database (Airtable opcjonalnie)

**Decyzja:** Brak bazy danych w MVP, opcjonalnie Airtable dla logów

**Uzasadnienie:**
- Wymagania nie zakładają persistence (tylko display)
- Cache działa w filesystemie (wystarczające)
- Airtable możliwe dla: audit logs, user preferences (future)
- Prostsze deployment bez DB setup

---

## 🔍 Potencjalne Rozszerzenia (Out of Scope)

**Jeśli zostanie czas lub dla impressu:**

1. **Export do CSV/PDF**
   - Przycisk "Eksportuj" dla historical view
   - Użycie `<a download>` dla CSV (frontend)
   - PhpSpreadsheet dla XLSX (backend)

2. **Notifications**
   - Email/SMS gdy kurs przekroczy threshold
   - Wymaga: queue (Symfony Messenger), cron

3. **Admin Panel**
   - CRUD dla marż walut (bez zmiany kodu)
   - Cache invalidation button
   - Wymaga: autentykacja, formularz

4. **Chart Visualization**
   - Wykres liniowy dla historical rates
   - Chart.js lub Recharts (jeśli w `package.json`)

5. **Multi-language**
   - i18n dla interfejsu (PL/EN)
   - Symfony Translation component

6. **Dark Mode**
   - Toggle przełącznik
   - CSS variables + localStorage

**Priorytet:** Tylko jeśli MVP (Current + Historical) działa perfekcyjnie

---

## 📚 Źródła i Referencje

### API NBP
- Dokumentacja: https://api.nbp.pl/
- Endpoint tabela A: https://api.nbp.pl/api/exchangerates/tables/A/?format=json
- Endpoint single currency: https://api.nbp.pl/api/exchangerates/rates/A/USD?format=json
- Endpoint historical: `?date=YYYY-MM-DD` parameter

### Symfony 4.4
- Docs: https://symfony.com/doc/4.4/index.html
- Cache: https://symfony.com/doc/4.4/components/cache.html
- **Guzzle 7** (HTTP Client): https://docs.guzzlephp.org/en/stable/

**UWAGA:** Symfony 4.4 nie ma natywnego `symfony/http-client` - używamy Guzzle 7.9

### React 17
- Docs: https://17.reactjs.org/
- React Router v5: https://v5.reactrouter.com/

### PHPUnit 8.5
- Docs: https://phpunit.readthedocs.io/en/8.5/

---

## 📞 Support & Questions

**Podczas implementacji zadawaj sobie pytania:**
- Czy ten kod jest testowalny?
- Czy spełnia Single Responsibility?
- Czy będzie działać dla 100 użytkowników jednocześnie?
- Czy komunikaty błędów są zrozumiałe dla użytkownika?
- Czy mogę to wytłumaczyć w video w 30 sekund?

**Keep it simple, stupid (KISS)** ✨
