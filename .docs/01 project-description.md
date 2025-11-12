# **Aplikacja - Kantor Kursy (MVP)**

## **Główny problem**
Pracownicy kantorów potrzebują szybkiego, scentralizowanego i niezawodnego narzędzia do sprawdzania bieżących oraz historycznych kursów walut, które są kluczowe dla ich codziennej pracy. Obecnie muszą manualnie śledzić kursy średnie NBP i samodzielnie przeliczać je na własne stawki kupna/sprzedaży, co jest czasochłonne, podatne na błędy i nieefektywne.

Aplikacja rozwiązuje ten problem, automatyzując proces pobierania i kalkulacji kursów, a następnie prezentując wszystkie niezbędne dane w jednym, czytelnym i wydajnym interfejsie.

## **Najmniejszy zestaw funkcjonalności (MVP)**

**Backend (API w Symfony)**

1.  **Endpoint do pobierania bieżących kursów:**
    *   Pobiera aktualne kursy średnie z tabeli A API NBP dla zdefiniowanej listy walut (EUR, USD, CZK, IDR, BRL).
    *   Oblicza kursy kupna i sprzedaży dla każdej waluty zgodnie z zadanymi regułami marży.
    *   Zwraca listę walut wraz z ich kursem średnim NBP oraz obliczonymi kursami kantoru (kupno/sprzedaż).
    *   Implementacja mechanizmu cache'owania po stronie serwera, aby unikać zbędnych zapytań do API NBP i zapewnić wysoką wydajność (dane NBP aktualizują się raz dziennie).

2.  **Endpoint do pobierania historycznych kursów:**
    *   Przyjmuje jako parametry kod waluty (np. `EUR`) oraz datę końcową.
    *   Pobiera z API NBP historyczne kursy średnie dla danej waluty z okresu 14 dni wstecz od podanej daty.
    *   Dla każdego historycznego kursu oblicza stawki kupna/sprzedaży kantoru.
    *   Zwraca serię danych historycznych gotowych do wyświetlenia na wykresie lub w tabeli.

**Frontend (React)**

1.  **Główny widok (Dashboard):**
    *   Wyświetla tabelę z bieżącymi kursami dla wszystkich obsługiwanych walut.
    *   Tabela zawiera kolumny: Kod waluty, Kurs średni NBP, Kurs kupna (kantor), Kurs sprzedaży (kantor).
    *   Dane są pobierane z backendowego API.

2.  **Widok szczegółowy / historyczny:**
    *   Dostępny po kliknięciu na wybraną walutę w głównym widoku.
    *   Zawiera selektor daty (ang. *Date Picker*), domyślnie ustawiony na dzień dzisiejszy.
    *   Wyświetla dane historyczne dla wybranej waluty w formie prostego wykresu liniowego lub czytelnej tabeli, pokazując kursy sprzedaży z ostatnich 14 dni (oraz kupna dla EUR i USD).
    *   Zmiana daty w selektorze powoduje ponowne pobranie i wyświetlenie danych historycznych dla nowego okresu.

3.  **Podstawowy interfejs użytkownika:**
    *   Interfejs jest czysty, czytelny i prosty w obsłudze.
    *   Aplikacja jest responsywna (RWD), aby zapewnić użyteczność na różnych urządzeniach (np. komputer, tablet).

## **Co NIE wchodzi w zakres MVP**

*   **System logowania i autoryzacji użytkowników:** Aplikacja jest narzędziem wewnętrznym i nie wymaga kont użytkowników.
*   **Panel administracyjny:** Zarządzanie listą walut i wysokością marży odbywa się bezpośrednio w kodzie/konfiguracji aplikacji, zgodnie z założeniem.
*   **Użycie bazy danych (np. Airtable):** Wersja MVP będzie opierać się wyłącznie na danych pobieranych na żywo z API NBP i mechanizmie cache'owania. Nie będziemy trwale przechowywać historii kursów po naszej stronie.
*   **Powiadomienia push/email:** Brak jakichkolwiek alertów o zmianach kursów.
*   **Zaawansowane funkcje:** Kalkulator walutowy, porównywanie kursów wielu walut na jednym wykresie, eksport danych do CSV/PDF.
*   **Obsługa innych tabel kursów NBP (B, C):** MVP skupia się wyłącznie na tabeli A (kursy średnie).
*   **Personalizacja widoków:** Brak możliwości zmiany motywu (np. dark mode) czy dostosowywania układu interfejsu przez użytkownika.

## **Kryteria sukcesu**

1.  **Funkcjonalne:**
    *   Aplikacja poprawnie wyświetla bieżące kursy kupna i sprzedaży dla walut EUR, USD, CZK, IDR, BRL, obliczone na podstawie aktualnych danych z NBP i zdefiniowanych marż.
    *   Użytkownik może bezbłędnie sprawdzić historię kursów dla każdej z obsługiwanych walut na 14 dni wstecz od wybranej daty.
    *   Aplikacja działa stabilnie i jest gotowa do uruchomienia w środowisku lokalnym.

2.  **Wydajnościowe:**
    *   Czas ładowania głównego widoku z bieżącymi kursami nie przekracza 2 sekund (dzięki cache'owaniu po stronie backendu).
    *   Odpowiedzi z API są szybkie, a interfejs użytkownika działa płynnie.

3.  **Użytecznościowe:**
    *   Interfejs jest czytelny i intuicyjny, a kluczowe informacje są łatwo dostępne dla pracownika kantoru.
    *   Prezentowane dane są dokładne i wiarygodne.

4.  **Projektowe (ocena zadania):**
    *   Kod źródłowy aplikacji (React + Symfony) jest czysty, dobrze zorganizowany i udostępniony w repozytorium.
    *   Nagrane wideo (3-5 minut) w klarowny sposób demonstruje działanie aplikacji oraz wyjaśnia podjęte decyzje architektoniczne i projektowe.