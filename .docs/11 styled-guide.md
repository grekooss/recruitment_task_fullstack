# Project Style Guide

Ten dokument stanowi przewodnik po systemie stylów dla projektu Currency Exchange App (Kantor). Służy jako źródło prawdy dla deweloperów i projektantów, zapewniając spójność wizualną i techniczną zgodną z tech-stackiem projektu (Symfony 4.4 + React 17 + Bootstrap 5).

## Table of Contents
1. [Overview](#overview)
2. [Design Philosophy](#design-philosophy)
3. [Color Palette](#color-palette)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Component Styles](#component-styles)
7. [Shadows & Elevation](#shadows--elevation)
8. [Animations & Transitions](#animations--transitions)
9. [Border Styles](#border-styles)
10. [Border Radius](#border-radius)
11. [Opacity & Transparency](#opacity--transparency)
12. [Z-Index Layers](#z-index-layers)
13. [Responsive Breakpoints](#responsive-breakpoints)
14. [CSS Variables](#css-variables)
15. [Layout Patterns](#layout-patterns)
16. [Example Component Reference](#example-component-reference)

---

## 1. Overview
System stylów jest oparty na **Bootstrap 5** z dodatkowymi custom CSS. Projekt wykorzystuje React 17 do renderowania komponentów UI i komunikacji z API Symfony. Centralnym punktem jest responsywność (RWD), czytelna typografia oraz gotowe komponenty Bootstrap (table, alert, spinner, button, form-control).

## 2. Design Philosophy
*   **Bootstrap-First:** Wykorzystanie gotowych komponentów Bootstrap 5 (grid, utilities, components) jako foundation.
*   **Minimalistyczny Design:** Czysty, funkcjonalny interfejs skupiony na czytelności danych walutowych.
*   **Mobile-First (Bootstrap RWD):** Bootstrap stosuje mobile-first breakpoints, ale style custom mogą nadpisywać dla większych ekranów.
*   **Czytelność:** Wysokie kontrasty, wyraźna typografia dla tabel kursów walut, przestronne layouty.
*   **Funkcjonalność:** Priorytet dla użyteczności - tabele responsywne, wyraźne przyciski akcji, loading states.

## 3. Color Palette

### Bootstrap 5 Theme Colors
Projekt wykorzystuje domyślną paletę Bootstrap 5 z możliwością customizacji przez zmienne Sass.

| Bootstrap Class | Hex (domyślny) | Przeznaczenie |
| :--- | :--- | :--- |
| **Primary** | `#0d6efd` | Przyciski, linki, aktywne elementy (`.btn-primary`, `.text-primary`). |
| **Success** | `#198754` | Wskaźniki wzrostu kursów, komunikaty sukcesu (`.alert-success`, `.text-success`). |
| **Danger** | `#dc3545` | Wskaźniki spadku kursów, błędy walidacji (`.alert-danger`, `.text-danger`). |
| **Warning** | `#ffc107` | Ostrzeżenia, stale dane cache (`.alert-warning`). |
| **Info** | `#0dcaf0` | Informacje o danych historycznych (`.alert-info`). |
| **Light** | `#f8f9fa` | Tła sekcji, secondary backgrounds. |
| **Dark** | `#212529` | Tekst nagłówków, footer. |
| **White** | `#ffffff` | Tła kart, główny background. |

### Custom Colors (jeśli potrzebne)
Dodatkowe kolory zgodne z brandingiem NBP lub kantoru można zdefiniować w `app.scss`:

```scss
$brand-blue: #0d6efd;      // Kolor główny
$rate-up: #198754;         // Wzrost kursu (zielony)
$rate-down: #dc3545;       // Spadek kursu (czerwony)
$neutral-gray: #6c757d;    // Tekst pomocniczy
```

## 4. Typography

### Font Family
Projekt wykorzystuje **domyślny font-stack Bootstrap 5**:
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Sans Emoji";
```

**Opcjonalnie:** Możesz dodać Google Fonts (np. `Roboto`, `Open Sans`) w `templates/base.html.twig`:
```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
```

### Base Size
Bootstrap 5 używa `font-size: 16px` na `html` (1rem = 16px).

### Scale (Bootstrap 5 Headings)
| Element | Rozmiar | Font-weight | Bootstrap Class |
| :--- | :--- | :--- | :--- |
| **H1** | `2.5rem` (40px) | 500 | `.h1` lub `<h1>` |
| **H2** | `2rem` (32px) | 500 | `.h2` lub `<h2>` |
| **H3** | `1.75rem` (28px) | 500 | `.h3` lub `<h3>` |
| **H4** | `1.5rem` (24px) | 500 | `.h4` lub `<h4>` |
| **H5** | `1.25rem` (20px) | 500 | `.h5` lub `<h5>` |
| **H6** | `1rem` (16px) | 500 | `.h6` lub `<h6>` |
| **Body** | `1rem` (16px) | 400 | domyślny tekst |
| **Small** | `0.875rem` (14px) | 400 | `.small` lub `<small>` |

**Display Headings:** Bootstrap oferuje klasy `.display-1` do `.display-6` dla większych nagłówków (np. hero sections).

## 5. Spacing System

Bootstrap 5 używa **spacer scale** opartego na `$spacer: 1rem` (16px):

| Klasa | Wartość | Pixels (16px base) | Przeznaczenie |
| :--- | :--- | :--- | :--- |
| `.m-0`, `.p-0` | `0` | 0px | Usunięcie marginesów/paddingów |
| `.m-1`, `.p-1` | `0.25rem` | 4px | Minimalny spacing |
| `.m-2`, `.p-2` | `0.5rem` | 8px | Mały spacing |
| `.m-3`, `.p-3` | `1rem` | 16px | **Domyślny** spacing |
| `.m-4`, `.p-4` | `1.5rem` | 24px | Średni spacing |
| `.m-5`, `.p-5` | `3rem` | 48px | Duży spacing (sekcje) |

**Kierunki:** `t` (top), `b` (bottom), `s` (start/left), `e` (end/right), `x` (horizontal), `y` (vertical).

**Przykłady:**
- `.mt-3` - margin-top: 1rem
- `.py-5` - padding top & bottom: 3rem
- `.mx-auto` - margin left & right: auto (center)

## 6. Component Styles

### Buttons (Bootstrap 5)

Bootstrap oferuje szereg gotowych wariantów przycisków:

| Klasa | Wygląd | Przeznaczenie |
| :--- | :--- | :--- |
| `.btn-primary` | Niebieski, biały tekst | Główne akcje (np. "Sprawdź kurs") |
| `.btn-secondary` | Szary | Akcje drugorzędne |
| `.btn-success` | Zielony | Potwierdzenia, pozytywne akcje |
| `.btn-danger` | Czerwony | Usuwanie, akcje destrukcyjne |
| `.btn-outline-primary` | Przezroczysty z niebieskim bordem | Alternatywny styl |
| `.btn-sm` | Mały rozmiar | Kompaktowe przyciski |
| `.btn-lg` | Duży rozmiar | Wyróżnione akcje |

**Przykład:**
```html
<button class="btn btn-primary">Sprawdź kurs</button>
<button class="btn btn-outline-secondary btn-sm">Anuluj</button>
```

### Forms (Bootstrap 5)

**Input/Select/Textarea:**
```html
<input type="text" class="form-control" placeholder="Wybierz walutę">
<select class="form-select">
  <option>EUR</option>
</select>
```

- **Klasa:** `.form-control` (input/textarea), `.form-select` (select)
- **Rozmiary:** `.form-control-sm`, `.form-control-lg`
- **Validation:** `.is-valid`, `.is-invalid` (z `.valid-feedback`, `.invalid-feedback`)

### Cards (Bootstrap 5)

```html
<div class="card">
  <div class="card-header">Kursy walut</div>
  <div class="card-body">
    <p class="card-text">Treść...</p>
  </div>
</div>
```

- **Klasy:** `.card`, `.card-header`, `.card-body`, `.card-footer`
- **Shadow:** `.shadow-sm`, `.shadow`, `.shadow-lg`

### Tables (Bootstrap 5)

```html
<table class="table table-striped table-hover table-responsive">
  <thead>
    <tr><th>Waluta</th><th>Kurs</th></tr>
  </thead>
  <tbody>
    <tr><td>EUR</td><td>4.35</td></tr>
  </tbody>
</table>
```

- **Klasy:** `.table`, `.table-striped` (zebrowane wiersze), `.table-hover` (hover effect), `.table-bordered`, `.table-sm`
- **Responsive:** `.table-responsive` (scroll na małych ekranach)

## 7. Shadows & Elevation

Bootstrap 5 oferuje gotowe klasy cieni:

| Klasa | Box-shadow | Przeznaczenie |
| :--- | :--- | :--- |
| `.shadow-none` | Brak cienia | Usunięcie cienia |
| `.shadow-sm` | `0 .125rem .25rem rgba(0,0,0,.075)` | Subtelny cień (karty) |
| `.shadow` | `0 .5rem 1rem rgba(0,0,0,.15)` | Standardowy cień |
| `.shadow-lg` | `0 1rem 3rem rgba(0,0,0,.175)` | Duży cień (modalne, overlay) |

**Custom shadows** można dodać w `app.scss`:
```scss
.currency-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  }
}
```

## 8. Animations & Transitions

### Bootstrap 5 Transitions
Bootstrap ma wbudowane transitions dla komponentów (collapse, modals, alerts).

### Custom CSS Transitions
Projekt może używać prostych transitions dla interakcji:

```scss
.btn, .card, .table-hover tbody tr {
  transition: all 0.3s ease;
}

.rate-change {
  transition: color 0.5s ease, transform 0.3s ease;

  &.rate-up {
    color: $success;
    transform: translateY(-2px);
  }

  &.rate-down {
    color: $danger;
    transform: translateY(2px);
  }
}
```

**Zalecenie:** Unikaj nadmiernych animacji - priorytet dla wydajności i prostoty.

## 9. Border Styles

Bootstrap 5 oferuje utility classes dla borderów:

| Klasa | Efekt | Przeznaczenie |
| :--- | :--- | :--- |
| `.border` | Dodaje border dookoła | Obramowanie elementu |
| `.border-top`, `.border-end`, etc. | Border tylko z jednej strony | Separatory |
| `.border-0` | Usuwa border | Usunięcie ramki |
| `.border-primary` | Kolor primary | Wyróżnienie aktywnych elementów |
| `.border-success`, `.border-danger` | Kolory semantyczne | Status indicators |

**Przykład:**
```html
<div class="card border-primary">...</div>
<hr class="border border-secondary">
```

## 10. Border Radius

Bootstrap 5 posiada gotowe klasy zaokrągleń:

| Klasa | Border-radius | Przeznaczenie |
| :--- | :--- | :--- |
| `.rounded` | `0.25rem` (4px) | Delikatne zaokrąglenia |
| `.rounded-0` | `0` | Brak zaokrągleń (ostre krawędzie) |
| `.rounded-1` | `0.2rem` | Małe zaokrąglenia |
| `.rounded-2` | `0.25rem` | Średnie zaokrąglenia |
| `.rounded-3` | `0.3rem` | Duże zaokrąglenia |
| `.rounded-pill` | `50rem` | Kształt "pigułki" (przyciski) |
| `.rounded-circle` | `50%` | Okrągłe elementy (avatary) |

**Custom radius** w `app.scss`:
```scss
.currency-table {
  border-radius: 0.5rem; // 8px
}
```

## 11. Opacity & Transparency

Bootstrap 5 oferuje utility classes dla opacity:

| Klasa | Opacity | Przeznaczenie |
| :--- | :--- | :--- |
| `.opacity-0` | `0` | Ukryty element (ale zajmuje miejsce) |
| `.opacity-25` | `0.25` | 25% przezroczystości |
| `.opacity-50` | `0.5` | 50% przezroczystości (overlay) |
| `.opacity-75` | `0.75` | 75% przezroczystości |
| `.opacity-100` | `1` | Pełna nieprzezroczystość |

**Przykład:**
```html
<div class="bg-dark opacity-50">Semi-transparent overlay</div>
```

## 12. Z-Index Layers

Bootstrap 5 ma wbudowane z-index dla komponentów:

| Komponent | Z-Index | Bootstrap Class |
| :--- | :--- | :--- |
| Dropdowns | `1000` | `.dropdown-menu` |
| Sticky elements | `1020` | `.sticky-top` |
| Fixed elements | `1030` | `.fixed-top` |
| Modals backdrop | `1040` | `.modal-backdrop` |
| Modals | `1050` | `.modal` |
| Popovers | `1060` | `.popover` |
| Tooltips | `1070` | `.tooltip` |

**Custom z-index** dla własnych komponentów:
```scss
.currency-calculator {
  z-index: 10; // Ponad normalnym flow
}
```

## 13. Responsive Breakpoints

Bootstrap 5 stosuje **Mobile-First** approach z breakpointami:

| Breakpoint | Prefix | Viewport | Opis |
| :--- | :--- | :--- | :--- |
| **X-Small** | (default) | `< 576px` | Telefony portrait |
| **Small** | `sm` | `≥ 576px` | Telefony landscape |
| **Medium** | `md` | `≥ 768px` | Tablety |
| **Large** | `lg` | `≥ 992px` | Laptopy |
| **X-Large** | `xl` | `≥ 1200px` | Desktopy |
| **XX-Large** | `xxl` | `≥ 1400px` | Duże desktopy |

**Przykłady responsive classes:**
```html
<!-- Kolumny responsive -->
<div class="row">
  <div class="col-12 col-md-6 col-lg-4">...</div>
</div>

<!-- Ukrywanie na małych ekranach -->
<div class="d-none d-md-block">Widoczne od tabletu</div>

<!-- Text alignment responsive -->
<p class="text-center text-md-start">Wyśrodkowany na mobile, left na desktop</p>
```

## 14. CSS Variables

Bootstrap 5 używa **CSS Custom Properties (zmiennych CSS)** dla łatwej customizacji:

**Przykładowe zmienne Bootstrap:**
```css
:root {
  --bs-blue: #0d6efd;
  --bs-primary: #0d6efd;
  --bs-success: #198754;
  --bs-danger: #dc3545;
  --bs-font-sans-serif: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --bs-body-font-size: 1rem;
  --bs-border-radius: 0.25rem;
}
```

**Customizacja w `app.scss`:**
```scss
// Override Bootstrap variables przed @import
$primary: #0066cc;       // Custom primary color
$border-radius: 0.5rem;  // Większe zaokrąglenia

@import "~bootstrap/scss/bootstrap";

// Lub nadpisz CSS variables
:root {
  --bs-primary: #0066cc;
  --bs-success: #28a745;
}
```

**Użycie w custom CSS:**
```scss
.currency-badge {
  background-color: var(--bs-primary);
  border-radius: var(--bs-border-radius);
}
```

## 15. Layout Patterns

### Bootstrap Grid System
Bootstrap 5 używa **12-kolumnowego systemu grid** opartego na Flexbox:

```html
<div class="container">
  <!-- Równe kolumny -->
  <div class="row">
    <div class="col">Kolumna 1</div>
    <div class="col">Kolumna 2</div>
    <div class="col">Kolumna 3</div>
  </div>

  <!-- Konkretne szerokości -->
  <div class="row">
    <div class="col-md-8">Główna treść</div>
    <div class="col-md-4">Sidebar</div>
  </div>

  <!-- Responsive layout -->
  <div class="row">
    <div class="col-12 col-sm-6 col-lg-3">
      Karta waluty
    </div>
  </div>
</div>
```

### Layout Components
- **Container:** `.container` (fixed width) lub `.container-fluid` (full width)
- **Row:** `.row` - kontener dla kolumn (usuwa negatywne marginesy)
- **Columns:** `.col-{breakpoint}-{size}` (np. `.col-md-6`)
- **Gutters:** Spacing między kolumnami (`.g-0`, `.g-3`, `.gx-*`, `.gy-*`)

### Flexbox Utilities
```html
<div class="d-flex justify-content-between align-items-center">
  <div>Element 1</div>
  <div>Element 2</div>
</div>
```

**Klasy:**
- **Display:** `.d-flex`, `.d-inline-flex`
- **Direction:** `.flex-row`, `.flex-column`
- **Justify:** `.justify-content-start|center|end|between|around`
- **Align:** `.align-items-start|center|end|stretch`

## 16. Example Component Reference

### Currency Rate Card (React Component)

```jsx
// assets/js/components/Currency/RateCard.js
import React from 'react';

const RateCard = ({ currency, buyRate, sellRate, change }) => {
  const changeClass = change >= 0 ? 'text-success' : 'text-danger';
  const changeIcon = change >= 0 ? '↑' : '↓';

  return (
    <div className="col-12 col-sm-6 col-lg-4 mb-3">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{currency}</h5>
        </div>
        <div className="card-body">
          {buyRate && (
            <p className="mb-2">
              <strong>Kupno:</strong> {buyRate.toFixed(4)} PLN
            </p>
          )}
          <p className="mb-2">
            <strong>Sprzedaż:</strong> {sellRate.toFixed(4)} PLN
          </p>
          <p className={`mb-0 ${changeClass}`}>
            <small>
              {changeIcon} {Math.abs(change).toFixed(4)} PLN
            </small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RateCard;
```

### Currency Rates Table

```jsx
// assets/js/components/Currency/RatesTable.js
import React from 'react';

const RatesTable = ({ rates }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Waluta</th>
            <th>Kod</th>
            <th>Kurs NBP</th>
            <th>Kupno</th>
            <th>Sprzedaż</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.code}>
              <td>{rate.currency}</td>
              <td><strong>{rate.code}</strong></td>
              <td>{rate.mid.toFixed(4)} PLN</td>
              <td>
                {rate.buyRate ? (
                  <span className="text-success">{rate.buyRate.toFixed(4)} PLN</span>
                ) : (
                  <span className="text-muted">-</span>
                )}
              </td>
              <td>
                <span className="text-danger">{rate.sellRate.toFixed(4)} PLN</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RatesTable;
```

### Loading Spinner

```jsx
// assets/js/components/Common/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ message = 'Ładowanie danych...' }) => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
```

### Error Alert

```jsx
// assets/js/components/Common/ErrorAlert.js
import React from 'react';

const ErrorAlert = ({ message, onRetry }) => {
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      <h5 className="alert-heading">Błąd</h5>
      <p className="mb-0">{message}</p>
      {onRetry && (
        <hr />
        <button className="btn btn-sm btn-outline-danger" onClick={onRetry}>
          Spróbuj ponownie
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;
```

---

## Podsumowanie

Ten style guide został zaktualizowany zgodnie z tech-stackiem projektu:

### Kluczowe technologie:
- **Bootstrap 5** - podstawowy framework CSS z gotowymi komponentami
- **React 17** - biblioteka UI z JavaScript (ES6+, bez TypeScript)
- **Webpack Encore** - bundler z Babel dla JSX
- **Symfony 4.4** - backend API (RESTful)

### Główne zasady projektowe:
1. **Bootstrap-First:** Wykorzystuj gotowe komponenty Bootstrap przed pisaniem custom CSS
2. **Mobile-First RWD:** Responsywny design z breakpointami Bootstrap
3. **Funkcjonalność nad estetyką:** Priorytet dla czytelności danych walutowych
4. **Minimalizm:** Czysty, funkcjonalny interfejs bez zbędnych ozdobników
5. **Utility Classes:** Używaj utility classes Bootstrap (spacing, colors, flex) zamiast custom CSS

### Komponenty do implementacji:
- ✅ `RateCard` - karta pojedynczej waluty (Bootstrap card)
- ✅ `RatesTable` - tabela kursów (Bootstrap table)
- ✅ `LoadingSpinner` - wskaźnik ładowania (Bootstrap spinner)
- ✅ `ErrorAlert` - komunikaty błędów (Bootstrap alert)
- 📋 `CurrencySelector` - dropdown wyboru waluty (Bootstrap form-select)
- 📋 `HistoricalChart` - wykres historyczny (opcjonalnie)

### Dalsza rozbudowa:
- Custom Sass variables w `app.scss` dla brandingu
- Dark mode przez CSS variables
- Accessibility improvements (WCAG 2.1 AA)
- Performance optimization (lazy loading, code splitting)