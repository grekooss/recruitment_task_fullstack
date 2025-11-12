<conversation_summary>
<decisions>
1.  **Reguły marży:** Zostały precyzyjnie zdefiniowane. Dla EUR i USD: kurs kupna = kurs średni NBP - 0.15 PLN; kurs sprzedaży = kurs średni NBP + 0.11 PLN. Dla pozostałych walut: kantor nie prowadzi skupu, a kurs sprzedaży = kurs średni NBP + 0.20 PLN.
2.  **Obsługa błędów API NBP:** Aplikacja wyświetli ostatnie znane dane z pamięci podręcznej (cache) wraz z datą ostatniej aktualizacji i widocznym komunikatem o problemie z połączeniem.
3.  **Dni bez publikacji kursów (weekendy/święta):** Aplikacja wyświetli ostatnie dostępne dane (np. z piątku) wraz z prawidłową datą ich publikacji.
4.  **Zarządzanie konfiguracją:** Marże i lista walut będą przechowywane w zewnętrznym pliku konfiguracyjnym (np. `.json` lub `.env`) na serwerze, aby umożliwić zmiany bez ponownego wdrażania aplikacji.
5.  **Widok historyczny (MVP):** W pierwszej wersji (MVP) zaimplementowana zostanie wyłącznie tabela z danymi historycznymi. Wykres jest planowany jako rozszerzenie w przyszłości.
6.  **Pomiar użyteczności:** Sukces zostanie zmierzony poprzez krótkie sesje testowe (feedback jakościowy) z 1-3 docelowymi użytkownikami (pracownikami kantoru).
7.  **Cache (TTL):** Czas życia danych w pamięci podręcznej serwera (TTL) zostanie ustawiony na 4-6 godzin lub wdrożony zostanie mechanizm inteligentnego odświeżania raz dziennie po godz. 12:15.
8.  **Wskaźniki ładowania:** Aplikacja będzie wyświetlać wskaźniki ładowania (np. "spinner") podczas pobierania danych, aby poprawić doświadczenie użytkownika.
9.  **Brak danych historycznych:** W przypadku braku danych dla wybranego okresu, aplikacja wyświetli jasny komunikat, np. "Brak danych dla wybranego okresu".
10. **Środowisko docelowe:** Aplikacja będzie uruchomiona na jednym, dedykowanym komputerze w kantorze.
11. **Wyświetlanie braku kursu kupna:** W tabeli dla walut, których kantor nie skupuje, w kolumnie "Kurs kupna" zostanie użyty myślnik ("-").
12. **Instalacja i aktualizacje:** Proces zostanie uproszczony poprzez przygotowanie skryptu instalacyjnego (np. z Docker Compose) i szczegółowej instrukcji.
13. **Precyzja kursów:** Wszystkie kursy walut w aplikacji będą zaokrąglane i wyświetlane z dokładnością do 4 miejsc po przecinku.
14. **Kolumny w tabeli historycznej:** Tabela będzie zawierać kolumny: "Data", "Kurs średni NBP", "Kurs sprzedaży". Kolumna "Kurs kupna" będzie wyświetlana warunkowo, tylko dla EUR i USD.
15. **Wygląd komunikatów o błędach:** Komunikat o problemie z API NBP będzie wyświetlany jako widoczny, nieinwazyjny pasek informacyjny na górze ekranu.
16. **Responsywność (RWD):** Aplikacja zapewni podstawową czytelność na urządzeniach mobilnych, ale bez dedykowanego layoutu mobilnego w ramach MVP.
17. **Sortowanie tabeli:** Główna tabela z kursami będzie posiadała funkcję sortowania po kliknięciu w nagłówek kolumny.
18. **Domyślny widok historyczny:** Po przejściu do widoku szczegółowego domyślnie załadowane zostaną dane z ostatnich 14 dni.
19. **Nawigacja:** Powrót z widoku historycznego będzie możliwy za pomocą przycisku "Powrót" oraz poprzez kliknięcie w logo aplikacji.
20. **Odświeżanie danych:** W MVP dane będą odświeżane wyłącznie po ręcznym odświeżeniu strony przez użytkownika.
21. **Język interfejsu:** Aplikacja będzie w języku polskim. Teksty zostaną umieszczone w plikach językowych, aby ułatwić przyszłe tłumaczenia.
22. **Kopiowanie kursu:** Zostanie dodana ikona "kopiuj" obok kursów, umożliwiająca skopiowanie wartości do schowka jednym kliknięciem.
23. **Ograniczenia selektora daty:** Selektor dat w widoku historycznym zablokuje możliwość wyboru dat przyszłych oraz dat sprzed 2 stycznia 2002 roku.
24. **Definicja listy walut:** Aplikacja w wersji MVP będzie obsługiwać następujące waluty: euro (EUR), dolar amerykański (USD), korona czeska (CZK), rupia indonezyjska (IDR), real brazylijski (BRL).
</decisions>

<matched_recommendations>
1.  **Zdefiniowanie jednoznacznej logiki biznesowej:** Precyzyjne określenie reguł marży oraz finalnej listy walut (EUR, USD, CZK, IDR, BRL) jest kluczowe i zostało zrealizowane. Stanowi to fundament działania aplikacji.
2.  **Odporność na błędy i niezawodność:** Przyjęcie strategii wykorzystania cache'u i wyświetlania jasnych komunikatów w przypadku niedostępności API NBP zapewnia ciągłość pracy i buduje zaufanie użytkownika.
3.  **Skupienie na MVP i iteracyjny rozwój:** Decyzja o wdrożeniu tabeli zamiast wykresu w widoku historycznym jest doskonałym przykładem priorytetyzacji, która przyspiesza dostarczenie wartościowej funkcji.
4.  **Użyteczność jako kluczowe kryterium sukcesu:** Plan przeprowadzenia testów z realnymi użytkownikami i dodanie drobnych usprawnień (sortowanie, kopiowanie do schowka) świadczy o skupieniu na faktycznych potrzebach pracownika kantoru.
5.  **Ułatwienie utrzymania i przyszłego rozwoju:** Wykorzystanie zewnętrznego pliku konfiguracyjnego dla marż oraz plików językowych dla tekstów to decyzje architektoniczne, które znacząco obniżą koszty przyszłych modyfikacji.
6.  **Poprawa doświadczenia użytkownika (UX):** Wdrożenie wskaźników ładowania, domyślne ładowanie danych historycznych i intuicyjna nawigacja to elementy, które sprawią, że aplikacja będzie postrzegana jako profesjonalna i "płynna" w działaniu.
</matched_recommendations>

<prd_planning_summary>
Poniższe podsumowanie stanowi podstawę do stworzenia szczegółowego dokumentu wymagań produktu (PRD) dla MVP aplikacji do śledzenia kursów walut dla kantoru.

**a. Główne wymagania funkcjonalne produktu:**

1.  **Dashboard z bieżącymi kursami:** Główny widok aplikacji prezentujący w formie tabeli zdefiniowaną listę walut: **euro (EUR), dolar amerykański (USD), korona czeska (CZK), rupia indonezyjska (IDR) oraz real brazylijski (BRL)**. Dla każdej waluty wyświetlane są: kod waluty, nazwa, kurs średni NBP oraz obliczony kurs sprzedaży. Kurs kupna jest obliczany i wyświetlany wyłącznie dla EUR i USD. Dla pozostałych walut (CZK, IDR, BRL) w kolumnie "Kurs kupna" widnieje myślnik.
2.  **Logika obliczania kursów:** Aplikacja automatycznie oblicza kursy kupna i sprzedaży na podstawie zdefiniowanych, stałych marż od kursu średniego NBP.
3.  **Widok danych historycznych:** Po kliknięciu na wybraną walutę na dashboardzie, użytkownik jest przenoszony do widoku szczegółowego, który domyślnie wyświetla w tabeli dane historyczne dla tej waluty z ostatnich 14 dni.
4.  **Interaktywność interfejsu:**
    *   Możliwość sortowania tabeli na dashboardzie po każdej kolumnie.
    *   Możliwość skopiowania dowolnego kursu do schowka jednym kliknięciem.
    *   Selektor dat w widoku historycznym z ograniczeniami uniemożliwiającymi wybór nieprawidłowych zakresów.
5.  **Obsługa błędów i stanów przejściowych:**
    *   Wyświetlanie wskaźników ładowania podczas pobierania danych.
    *   Czytelne komunikaty w przypadku niedostępności API NBP lub braku danych dla wybranego okresu.

**b. Kluczowe historie użytkownika i ścieżki korzystania:**

*   **Główna historia użytkownika:** "Jako pracownik kantoru, chcę mieć możliwość szybkiego sprawdzenia aktualnych i historycznych kursów kupna/sprzedaży w jednym miejscu, aby móc sprawnie i bezbłędnie obsługiwać klientów."
*   **Podstawowa ścieżka użytkownika (Sprawdzenie aktualnego kursu):**
    1.  Pracownik otwiera aplikację.
    2.  Na ekranie głównym natychmiast widzi tabelę z aktualnymi kursami sprzedaży dla wszystkich 5 walut i kursami kupna dla EUR/USD.
    3.  Znajduje interesującą go walutę i odczytuje kurs.
    4.  W razie potrzeby klika ikonę "kopiuj", aby użyć wartości w innym systemie.
*   **Ścieżka zaawansowana (Sprawdzenie trendu historycznego):**
    1.  Pracownik otwiera aplikację i widzi dashboard.
    2.  Klika na wiersz z walutą EUR.
    3.  Zostaje przeniesiony do widoku historycznego, gdzie widzi tabelę z kursami EUR z ostatnich 14 dni.
    4.  Używa selektora dat, aby sprawdzić kurs z konkretnego dnia w przeszłości.
    5.  Klika przycisk "Powrót", aby wrócić do głównego dashboardu.

**c. Ważne kryteria sukcesu i sposoby ich mierzenia:**

1.  **Użyteczność i intuicyjność (Kryterium główne):**
    *   **Metryka:** Pozytywny feedback jakościowy.
    *   **Sposób pomiaru:** Przeprowadzenie krótkich (5-10 minut) sesji testowych z 1-3 pracownikami kantoru, podczas których wykonają oni kluczowe zadania (np. "znajdź kurs sprzedaży korony czeskiej", "sprawdź, jaki był kurs dolara tydzień temu").
2.  **Niezawodność:**
    *   **Metryka:** Aplikacja działa nieprzerwanie i poprawnie wyświetla dane nawet w przypadku chwilowej niedostępności API NBP.
    *   **Sposób pomiaru:** Testy scenariuszy awaryjnych (np. symulacja błędu sieciowego) podczas fazy deweloperskiej.
3.  **Szybkość i wydajność:**
    *   **Metryka:** Czas ładowania danych na dashboardzie i w widoku historycznym jest akceptowalny dla użytkownika (subiektywnie "natychmiastowy").
    *   **Sposób pomiaru:** Obserwacja podczas testów użyteczności.

</prd_planning_summary>

<unresolved_issues>
1.  **Kierunek rozwoju po MVP:** Warto wstępnie zidentyfikować najbardziej prawdopodobną funkcjonalność do dodania po wdrożeniu MVP (np. kalkulator walutowy, panel zarządzania marżami), aby zapewnić odpowiednią elastyczność architektury. Obecna decyzja skupia się na przygotowaniu architektury na rozbudowę, ale nie precyzuje, jaka ona będzie.
</unresolved_issues>
</conversation_summary>