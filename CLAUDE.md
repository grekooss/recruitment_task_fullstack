# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a recruitment task project for a fullstack developer position. It's a Symfony 4.4 + React 17 application designed to display currency exchange rates for a currency exchange office (kantor), fetching data from the NBP (National Bank of Poland) API.

**Tech Stack:**
- Backend: PHP 8.2 + Symfony 4.4 (MicroKernelTrait)
- Frontend: React 17 + React Router 5.3
- Build Tool: Webpack Encore
- Testing: PHPUnit 8.5

## Development Commands

### Environment Setup

**Using Docker (recommended):**
```bash
docker compose up -d
```
Access at: http://telemedi-zadanie.localhost

**Manual Setup:**
1. Install dependencies: `composer install && npm install`
2. Build frontend: `npm run watch --dev`
3. Configure Apache vHost pointing to `public/` directory

### Frontend Development

```bash
# Watch mode with polling (use for development)
npm run watch --dev

# Development build
npm run dev

# Production build
npm run build

# Dev server
npm run dev-server
```

**Note:** Frontend uses `WATCHPACK_POLLING=true` in watch mode for compatibility with Docker/Windows environments.

### Backend Development

```bash
# Clear cache
php bin/console cache:clear

# Run PHP tests
php vendor/bin/phpunit

# Run specific test
php vendor/bin/phpunit tests/Integration/SetupCheck/SetupCheckTest.php

# Run specific test method
php vendor/bin/phpunit --filter testMethodName
```

## Architecture

### Backend Architecture

**Symfony MicroKernel Setup:**
- `src/Kernel.php` - Custom Symfony kernel using MicroKernelTrait
- `src/App/Controller/` - Controllers with `App\Controller` namespace
- PSR-4 autoloading: `App\` namespace maps to `src/App/`

**Routing:**
- Main routes defined in `config/routes.yaml`
- Catch-all route `/{wildcard}` handles all paths → serves React SPA
- API routes prefixed with `/api/` (e.g., `/api/setup-check`)

**Key Patterns:**
- Single-entry API controller pattern (DefaultController)
- All frontend routes handled by React Router (SPA)
- Backend serves only API endpoints and initial HTML template

### Frontend Architecture

**React SPA Structure:**
- Entry point: `assets/js/app.js`
- Root component: `Home.js` (contains routing and navigation)
- React Router handles client-side routing
- Bootstrap CSS framework for styling

**Build Process:**
- Webpack Encore compiles to `public/build/`
- Single entry point: `app.js` → generates `app.js` + `app.css`
- React preset enabled with Babel
- Split chunks enabled for optimization

**Component Pattern:**
- Class components (React 17 style)
- React Router v5 (`<Switch>`, `<Route>`, `<Redirect>`)
- Components in `assets/js/components/`

### API Integration Pattern

Example from `SetupCheck.js`:
```javascript
// Base URL configuration
const baseUrl = 'http://telemedi-zadanie.localhost';

// Axios for HTTP requests
axios.get(`${baseUrl}/api/setup-check?testParam=1`)
    .then(response => response.data)
```

**Important:** If using different domain, update `getBaseUrl()` method in components.

## Project-Specific Context

### Recruitment Task Requirements

This codebase is for a currency exchange office (kantor) application that should:
1. Display current exchange rates for: EUR, USD, CZK, IDR, BRL
2. Show 14-day historical rates for selected date
3. Calculate buy/sell rates based on NBP average rates:
   - EUR/USD: buy rate = NBP - 0.15 PLN, sell rate = NBP + 0.11 PLN
   - Other currencies: no buy rate, sell rate = NBP + 0.20 PLN
4. Fetch data from NBP API (backend only, not browser)
5. Support multiple concurrent users (performance matters)

**NBP API Endpoints:**
- All rates: https://api.nbp.pl/api/exchangerates/tables/A/?format=json
- Single currency: https://api.nbp.pl/api/exchangerates/rates/A/USD?format=json
- Historical: Add date parameter (rates published at noon)

### Development Constraints

- **No new composer/npm packages allowed** - use existing dependencies
- Target PHP 8.2 compatibility
- **Tests are required** - evaluated as part of submission
- Entire approach is evaluated (architecture, patterns, decisions)

## Testing

**PHPUnit Configuration:**
- Bootstrap: `tests/bootstrap.php`
- Test environment: `APP_ENV=test` (configured in phpunit.xml.dist)
- Symfony test listeners enabled
- Tests located in `tests/` directory with namespacing

**Test Structure:**
- Integration tests: `tests/Integration/`
- Symfony test environment automatically configured
- Use `Symfony\Bridge\PhpUnit\SymfonyTestsListener` for test isolation

## Configuration Files

**Key Config Locations:**
- `config/packages/` - Symfony bundle configuration
- `config/routes.yaml` - Route definitions
- `config/services.yaml` - Service container configuration
- `webpack.config.js` - Frontend build configuration
- `.env` - Environment variables (Docker setup uses this)

**Webpack Encore Settings:**
- Output path: `public/build/`
- Public path: `/build`
- React preset enabled
- Single runtime chunk enabled
- Source maps enabled in dev mode
- Versioned files in production

## Common Patterns

### Adding New API Endpoint

1. Add method to `src/App/Controller/DefaultController.php`
2. Add route to `config/routes.yaml` with `/api/` prefix
3. Return JSON response using `Response` class
4. Use `Request` object for input parameters

### Adding New React Component

1. Create component in `assets/js/components/`
2. Import and add route in `Home.js`
3. Use axios for API calls with base URL
4. Follow class component pattern (React 17 style)

### Symfony 4.4 Specific Notes

- Uses older Symfony 4.4 (not 5.x or 6.x)
- `RouteCollectionBuilder` instead of newer routing attributes
- Twig bundle for templates
- MicroKernelTrait for lightweight setup
- PHP 8.2 configured but Symfony 4.4 compatibility layer

## Docker Environment

Container name: `recruitment-webserver`
- Exposes port 80
- Document root: `/var/www/html/public`
- Volume maps entire project to `/var/www/html/`
- Apache with PHP 8.2 (check Dockerfile for exact config)

## Important Notes

- Frontend runs entirely in browser after initial load (SPA pattern)
- Backend should only provide API endpoints, not render views
- Base URL for API calls may need adjustment per environment
- All frontend routes are client-side (React Router)
- Catch-all Symfony route ensures React router works on refresh
