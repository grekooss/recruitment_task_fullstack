# Dokument wymagań produktu (PRD) - Kantor Kursy (MVP)
## 1. Przegląd produktu
Kantor Kursy to wewnętrzna aplikacja internetowa (MVP - Minimum Viable Product) zaprojektowana w celu optymalizacji codziennej pracy pracowników kantorów wymiany walut. Aplikacja automatyzuje proces pobierania i przeliczania kursów walut z Narodowego Banku Polskiego (NBP), prezentując je w scentralizowanym, czytelnym i szybkim interfejsie. Główne funkcje obejmują wyświetlanie bieżących kursów kupna/sprzedaży dla zdefiniowanego zestawu walut oraz przeglądanie ich danych historycznych z ostatnich 14 dni. Celem produktu jest wyeliminowanie ręcznych obliczeń, zminimalizowanie ryzyka błędów ludzkich oraz zapewnienie pracownikom natychmiastowego dostępu do wiarygodnych danych, co przekłada się na szybszą i bardziej precyzyjną obsługę klienta.

## 2. Problem użytkownika
Pracownicy kantorów stoją przed codziennym wyzwaniem polegającym na manualnym śledzeniu średnich kursów walut publikowanych przez NBP. Muszą oni regularnie odwiedzać stronę NBP, odnajdywać odpowiednie wartości, a następnie ręcznie przeliczać je na wewnętrzne kursy kupna i sprzedaży, stosując z góry ustalone marże.

Proces ten jest:
*   Czasochłonny: Wymaga ręcznego wyszukiwania i obliczeń dla wielu walut każdego dnia.
*   Podatny na błędy: Ręczne przepisywanie i obliczenia stwarzają ryzyko pomyłek, które mogą prowadzić do strat finansowych.
*   Nieefektywny: Brak centralnego narzędzia zmusza pracowników do korzystania z wielu źródeł (strona NBP, kalkulator, arkusz kalkulacyjny), co rozprasza uwagę i spowalnia pracę.
*   Ograniczony: Szybkie sprawdzenie trendu lub historycznego kursu waluty (np. sprzed tygodnia) jest kłopotliwe i wymaga dodatkowego wyszukiwania w archiwach NBP.

Aplikacja Kantor Kursy ma na celu rozwiązanie tych problemów poprzez dostarczenie jednego, niezawodnego źródła prawdy, które automatyzuje cały proces i prezentuje finalne dane w przystępnej formie.

## 3. Wymagania funkcjonalne
### 3.1. Wyświetlanie bieżących kursów walut (Dashboard)
Główny ekran aplikacji musi prezentować tabelę z bieżącymi kursami dla predefiniowanej listy walut.
*   Obsługiwane waluty: euro (EUR), dolar amerykański (USD), korona czeska (CZK), rupia indonezyjska (IDR), real brazylijski (BRL).
*   Kolumny tabeli: Kod waluty, Kurs średni NBP, Kurs kupna (kantor), Kurs sprzedaży (kantor).
*   Tabela musi być sortowalna rosnąco/malejąco po kliknięciu na nagłówek każdej z kolumn.
*   Dane są pobierane z wewnętrznego API, które wykorzystuje mechanizm cache'owania, aby zapewnić wysoką wydajność i zminimalizować liczbę zapytań do API NBP.

### 3.2. Obliczanie kursów kupna/sprzedaży (Logika biznesowa)
Aplikacja musi automatycznie obliczać kursy kantoru na podstawie kursu średniego NBP (Tabela A) i zdefiniowanych reguł marży.
*   Reguły marży dla EUR i USD:
    *   Kurs kupna = Kurs średni NBP - 0.15 PLN
    *   Kurs sprzedaży = Kurs średni NBP + 0.11 PLN
*   Reguły marży dla CZK, IDR, BRL:
    *   Kurs kupna: nie jest prowadzony (w tabeli wyświetlany jest znak "-").
    *   Kurs sprzedaży = Kurs średni NBP + 0.20 PLN
*   Wszystkie wyświetlane kursy muszą być zaokrąglone i prezentowane z dokładnością do 4 miejsc po przecinku.
*   Konfiguracja listy walut i wartości marż musi być przechowywana w zewnętrznym pliku konfiguracyjnym na serwerze (np. `.env`, `.json`), aby umożliwić łatwe modyfikacje bez konieczności wdrażania nowej wersji aplikacji.

### 3.3. Wyświetlanie historycznych kursów walut (Widok szczegółowy)
Aplikacja musi umożliwiać przeglądanie danych historycznych dla każdej z obsługiwanych walut.
*   Dostęp do widoku szczegółowego następuje po kliknięciu na wybrany wiersz waluty na głównym dashboardzie.
*   Widok zawiera selektor daty (Date Picker), domyślnie ustawiony na dzień bieżący.
*   Dane historyczne prezentowane są w formie tabeli dla okresu 14 dni wstecz od daty wybranej w selektorze.
*   Kolumny tabeli historycznej: Data, Kurs średni NBP, Kurs sprzedaży. Kolumna "Kurs kupna" jest wyświetlana warunkowo, wyłącznie dla walut EUR i USD.
*   Zmiana daty w selektorze powoduje automatyczne odświeżenie danych dla nowego 14-dniowego okresu.

### 3.4. Interfejs i doświadczenie użytkownika (UX/UI)
*   Interfejs musi być czysty, czytelny i intuicyjny.
*   Aplikacja musi być responsywna (RWD), aby zapewnić czytelność i użyteczność na urządzeniach stacjonarnych i tabletach.
*   Podczas ładowania danych (zarówno na dashboardzie, jak i w widoku historycznym) musi być wyświetlany wskaźnik ładowania (np. spinner).
*   Aplikacja musi posiadać prostą nawigację (np. przycisk "Powrót" lub klikalne logo) pozwalającą na powrót z widoku historycznego do dashboardu.
*   Obok każdego kursu w tabelach powinna znajdować się ikona umożliwiająca skopiowanie wartości do schowka jednym kliknięciem.
*   Cały interfejs aplikacji jest w języku polskim.

### 3.5. Obsługa błędów i przypadków brzegowych
*   W przypadku niedostępności API NBP, aplikacja musi wyświetlić ostatnie znane dane z pamięci podręcznej (cache) wraz z datą ich ostatniej aktualizacji oraz widocznym, nieinwazyjnym komunikatem o błędzie (np. jako pasek na górze ekranu).
*   W dni, w które NBP не publikuje kursów (weekendy, święta), aplikacja wyświetla ostatnie dostępne dane (np. z piątku) wraz z ich prawidłową datą publikacji.
*   W przypadku braku danych historycznych dla wybranego okresu, aplikacja musi wyświetlić czytelny komunikat (np. "Brak danych dla wybranego okresu").

## 4. Granice produktu
Poniższe funkcjonalności celowo NIE wchodzą w zakres wersji MVP, aby zapewnić szybkie dostarczenie kluczowej wartości i skupić się na rozwiązaniu podstawowego problemu.

*   System logowania, autoryzacji i zarządzania użytkownikami.
*   Panel administracyjny do zarządzania marżami i listą walut z poziomu interfejsu.
*   Wykorzystanie bazy danych do trwałego przechowywania historii kursów po stronie aplikacji.
*   Powiadomienia (push, email) o zmianach kursów.
*   Zaawansowane funkcje analityczne (kalkulator walutowy, porównywanie walut na jednym wykresie, eksport danych do CSV/PDF).
*   Obsługa innych tabel kursów NBP (np. Tabela B, Tabela C).
*   Wykresy w widoku historycznym (w MVP dane historyczne prezentowane są wyłącznie w formie tabeli).
*   Personalizacja interfejsu przez użytkownika (np. tryb ciemny, zmiana układu).
*   Automatyczne odświeżanie danych w czasie rzeczywistym (w MVP dane odświeżają się po przeładowaniu strony).

## 5. Historyjki użytkowników

### ID: US-001
*   Tytuł: Wyświetlanie bieżących kursów walut
*   Opis: Jako pracownik kantoru, chcę po otwarciu aplikacji od razu widzieć tabelę z aktualnymi, obliczonymi kursami kupna i sprzedaży dla kluczowych walut, aby móc szybko podać klientowi obowiązującą stawkę.
*   Kryteria akceptacji:
    1.  Po wejściu na główny adres aplikacji wyświetla się tabela z danymi.
    2.  Tabela zawiera wiersze dla walut: EUR, USD, CZK, IDR, BRL.
    3.  Tabela zawiera kolumny: "Kod waluty", "Kurs średni NBP", "Kurs kupna", "Kurs sprzedaży".
    4.  Wartości w kolumnach "Kurs kupna" i "Kurs sprzedaży" są poprawnie obliczone zgodnie ze zdefiniowanymi regułami marży.
    5.  Dla walut CZK, IDR, BRL w kolumnie "Kurs kupna" widnieje znak myślnika "-".
    6.  Wszystkie kursy są wyświetlane z dokładnością do 4 miejsc po przecinku.

### ID: US-002
*   Tytuł: Przeglądanie danych historycznych dla waluty
*   Opis: Jako pracownik kantoru, chcę mieć możliwość kliknięcia na dowolną walutę w głównej tabeli, aby zobaczyć jej kursy z ostatnich dwóch tygodni i móc przeanalizować jej trend.
*   Kryteria akceptacji:
    1.  Kliknięcie na dowolny wiersz w tabeli na dashboardzie przenosi użytkownika do widoku szczegółowego tej waluty.
    2.  W widoku szczegółowym domyślnie wyświetlana jest tabela z danymi historycznymi dla wybranej waluty z 14 dni wstecz od dnia dzisiejszego.
    3.  Tabela historyczna zawiera kolumny: "Data", "Kurs średni NBP", "Kurs sprzedaży".
    4.  Jeśli wybrana waluta to EUR lub USD, tabela historyczna zawiera dodatkowo kolumnę "Kurs kupna".
    5.  W widoku szczegółowym znajduje się przycisk lub link (np. w logo) umożliwiający powrót do głównego dashboardu.

### ID: US-003
*   Tytuł: Zmiana okresu w widoku historycznym
*   Opis: Jako pracownik kantoru, chcę w widoku historycznym móc wybrać inną datę końcową, aby sprawdzić kursy waluty z okresu 14 dni wstecz od wybranego dnia w przeszłości.
*   Kryteria akceptacji:
    1.  W widoku historycznym znajduje się komponent selektora dat (Date Picker).
    2.  Domyślnie w selektorze zaznaczona jest bieżąca data.
    3.  Zmiana daty w selektorze powoduje ponowne załadowanie danych i wyświetlenie w tabeli kursów z 14 dni wstecz od nowo wybranej daty.
    4.  Selektor dat nie pozwala na wybór dat przyszłych.
    5.  Selektor dat blokuje możliwość wyboru dat sprzed 2 stycznia 2002 roku (początek danych w API NBP).

### ID: US-004
*   Tytuł: Sortowanie tabeli z bieżącymi kursami
*   Opis: Jako pracownik kantoru, chcę mieć możliwość sortowania tabeli z bieżącymi kursami po każdej kolumnie, aby szybko znaleźć walutę o najwyższym lub najniższym kursie.
*   Kryteria akceptacji:
    1.  Kliknięcie w nagłówek dowolnej kolumny na dashboardzie sortuje dane w tabeli według tej kolumny.
    2.  Pierwsze kliknięcie sortuje dane rosnąco.
    3.  Drugie kliknięcie w ten sam nagłówek sortuje dane malejąco.
    4.  Aktywna kolumna sortowania jest wizualnie oznaczona (np. strzałką).

### ID: US-005
*   Tytuł: Kopiowanie wartości kursu
*   Opis: Jako pracownik kantoru, chcę mieć możliwość szybkiego skopiowania wartości kursu do schowka, aby móc ją wkleić w innym programie bez ryzyka pomyłki przy przepisywaniu.
*   Kryteria akceptacji:
    1.  Obok każdej wartości kursu (kupna i sprzedaży) w obu tabelach (bieżącej i historycznej) znajduje się ikona kopiowania.
    2.  Kliknięcie ikony kopiuje wartość liczbową kursu z tej komórki do schowka systemowego.
    3.  Po pomyślnym skopiowaniu pojawia się krótkie wizualne potwierdzenie (np. zmiana ikony, tooltip "Skopiowano!").

### ID: US-006
*   Tytuł: Wyświetlanie stanu ładowania danych
*   Opis: Jako pracownik kantoru, chcę widzieć informację, że aplikacja ładuje dane, abym wiedział, że system działa i mam poczekać na wynik.
*   Kryteria akceptacji:
    1.  Podczas początkowego ładowania danych na dashboardzie, w miejscu tabeli wyświetlany jest wskaźnik ładowania (spinner).
    2.  Podczas ładowania danych historycznych po zmianie daty, w miejscu tabeli historycznej wyświetlany jest wskaźnik ładowania.

### ID: US-007
*   Tytuł: Obsługa niedostępności API NBP
*   Opis: Jako pracownik kantoru, chcę, aby aplikacja nadal była użyteczna, nawet jeśli wystąpią chwilowe problemy z połączeniem z serwerami NBP, abym mógł kontynuować pracę w oparciu o ostatnie znane dane.
*   Kryteria akceptacji:
    1.  Gdy backend nie może połączyć się z API NBP, na górze strony wyświetlany jest widoczny pasek informacyjny z komunikatem, np. "Nie można pobrać aktualnych danych. Wyświetlane kursy pochodzą z [data i godzina ostatniej aktualizacji]".
    2.  W takim scenariuszu aplikacja wyświetla w tabeli dane z ostatniego pomyślnego pobrania, które są przechowywane w pamięci podręcznej (cache) serwera.

### ID: US-008
*   Tytuł: Obsługa dni bez publikacji kursów
*   Opis: Jako pracownik kantoru, chcę w weekend lub święto widzieć w aplikacji ostatnie aktualne kursy (np. z piątku), abym wiedział, jakie stawki obowiązywały na koniec ostatniego dnia roboczego.
*   Kryteria akceptacji:
    1.  Gdy użytkownik otwiera aplikację w dzień wolny od publikacji kursów, aplikacja wyświetla dane z ostatniego dnia roboczego.
    2.  Data publikacji tych kursów jest wyraźnie widoczna, aby użytkownik był świadomy, z którego dnia pochodzą dane.

### ID: US-009
*   Tytuł: Wyświetlanie na urządzeniach o różnej rozdzielczości
*   Opis: Jako pracownik kantoru, chcę mieć możliwość otworzenia aplikacji na tablecie, aby móc sprawdzić kursy nie tylko na głównym komputerze w biurze.
*   Kryteria akceptacji:
    1.  Aplikacja jest czytelna i w pełni funkcjonalna na ekranach o szerokości typowej dla tabletów (np. 768px).
    2.  Tabela z danymi nie "rozjeżdża się" i pozostaje czytelna (np. przez zastosowanie poziomego paska przewijania w razie potrzeby).
    3.  Elementy interaktywne (przyciski, linki) są łatwe do kliknięcia na ekranie dotykowym.

### ID: US-010
*   Tytuł: Wyświetlanie komunikatu o braku danych historycznych
*   Opis: Jako pracownik kantoru, chcę otrzymać jasny komunikat, gdy dla wybranego przeze mnie okresu historycznego nie ma żadnych danych, abym nie myślał, że aplikacja uległa awarii.
*   Kryteria akceptacji:
    1.  Jeśli zapytanie o dane historyczne nie zwróci żadnych wyników dla danego 14-dniowego okresu, w miejscu tabeli wyświetlany jest komunikat "Brak danych dla wybranego okresu".

### ID: US-011
*   Tytuł: Dostęp do aplikacji bez uwierzytelniania
*   Opis: Jako pracownik kantoru, chcę mieć natychmiastowy dostęp do aplikacji po wpisaniu jej adresu, bez potrzeby logowania się, aby maksymalnie przyspieszyć moją pracę.
*   Kryteria akceptacji:
    1.  Aplikacja jest dostępna pod określonym adresem URL w sieci wewnętrznej.
    2.  Otwarcie adresu URL bezpośrednio wyświetla główny dashboard z kursami.
    3.  Aplikacja nie posiada ekranu logowania ani żadnej formy uwierzytelniania użytkownika.

## 6. Metryki sukcesu
### 6.1. Funkcjonalne
*   Metryka: 100% poprawność obliczeń i wyświetlanych danych.
*   Sposób pomiaru: Aplikacja poprawnie wyświetla bieżące kursy kupna i sprzedaży dla wszystkich 5 walut (EUR, USD, CZK, IDR, BRL), obliczone zgodnie z zadanymi regułami marży w oparciu o aktualne dane z API NBP. Użytkownik może bezbłędnie sprawdzić historię kursów dla każdej z walut na 14 dni wstecz od dowolnie wybranej daty.

### 6.2. Wydajnościowe
*   Metryka: Czas ładowania aplikacji.
*   Sposób pomiaru: Czas od otwarcia aplikacji do pełnego załadowania i wyświetlenia tabeli z bieżącymi kursami nie przekracza 2 sekund przy standardowym połączeniu internetowym. Odpowiedzi z API na żądania danych historycznych są realizowane w czasie poniżej 1 sekundy.

### 6.3. Użytecznościowe
*   Metryka: Jakościowa ocena satysfakcji i łatwości obsługi.
*   Sposób pomiaru: Przeprowadzenie krótkich (5-10 minut) sesji testowych z 1-3 docelowymi użytkownikami (pracownikami kantoru). Sukcesem jest, gdy użytkownicy są w stanie samodzielnie, bez dodatkowych instrukcji, wykonać kluczowe zadania (np. "znajdź aktualny kurs sprzedaży korony czeskiej", "sprawdź jaki był kurs kupna dolara tydzień temu") i wyrażą pozytywną opinię na temat szybkości i czytelności narzędzia.

### 6.4. Projektowe (dostarczenie produktu)
*   Metryka: Kompletność dostarczonych materiałów.
*   Sposób pomiaru: Czysty, dobrze zorganizowany kod źródłowy aplikacji (frontend i backend) zostaje udostępniony w repozytorium. Nagrane wideo (3-5 minut) w klarowny sposób demonstruje działanie wszystkich zaimplementowanych funkcji oraz wyjaśnia kluczowe decyzje architektoniczne i projektowe.