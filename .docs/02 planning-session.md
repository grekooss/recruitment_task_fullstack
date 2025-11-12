<pytania>
1.  Jak dokładnie zdefiniowane są "reguły marży" dla poszczególnych walut? Czy jest to stały procent, stała kwota (spread), czy może zależy od waluty lub wysokości kursu?

    Rekomendacja: Należy stworzyć precyzyjną specyfikację logiki biznesowej w formie tabeli (np. Waluta | Typ marży | Wartość), która stanie się jednoznacznym źródłem prawdy dla deweloperów. Przykładowo: EUR | Procentowa | 1.5%; USD | Kwotowa | +/- 0.05 PLN.

Kurs kupna i sprzedaży walut przyjmujemy, że są w stałęj różnicy od kursu NBP:
dla walut EUR i USD kurs:
kupna jest mniejszy o 0.15 PLN względem kursu średniego
sprzedaży jest większy o 0.11 PLN względem kursu średniego
Dla pozostałych walut kantor nie prowadzi kupowania danej waluty, a kurs sprzedaży jest większy o 0.2 PLN względem kursu średniego

2.  Co powinno się stać, gdy API NBP jest niedostępne, zwraca błąd lub przekracza czas odpowiedzi?

    Rekomendacja: Aplikacja nie powinna wyświetlać pustego ekranu. Należy zdefiniować zachowanie w przypadku błędu – np. wyświetlenie ostatniej znanej wartości z cache wraz z wyraźną informacją o dacie ostatniej aktualizacji oraz komunikatem o problemie z połączeniem (np. "Nie można pobrać najnowszych danych. Wyświetlane kursy pochodzą z [data i godzina]").

Wedlug rekomendacji

3.  Jak aplikacja ma się zachowywać w dni, kiedy NBP nie publikuje nowych kursów (weekendy, święta)?

    Rekomendacja: Aby uniknąć konfuzji użytkownika, interfejs powinien zawsze wyświetlać datę i godzinę tabeli kursowej, z której pochodzą dane. W dni bez publikacji aplikacja powinna pokazywać ostatnie dostępne dane (np. z piątku) z prawidłową datą ich publikacji.

Wedlug rekomendacji

4.  Jak w praktyce będzie wyglądać proces zmiany marży lub listy walut, skoro nie ma panelu administracyjnego?

    Rekomendacja: Zamiast sztywnego wpisywania wartości w kodzie, zalecam umieszczenie konfiguracji marż i listy walut w osobnym pliku konfiguracyjnym na serwerze (np. `.env` lub `config.json`). Umożliwi to szybką aktualizację bez konieczności ponownego wdrażania całej aplikacji.

Wedlug rekomendacji

5.  W widoku historycznym, czy dla MVP powinniśmy skupić się na wykresie, czy na tabeli? Czy obie formy są wymagane od początku?

    Rekomendacja: Dla uproszczenia i przyspieszenia prac nad MVP, sugeruję zaimplementowanie w pierwszej kolejności czytelnej tabeli z danymi historycznymi. Jest ona prostsza w realizacji i w pełni zaspokaja potrzebę sprawdzenia historycznych wartości. Wykres można dodać jako usprawnienie w kolejnej iteracji.

Wedlug rekomendacji

6.  W jaki sposób planujemy zmierzyć kryterium sukcesu użyteczności ("Interfejs jest czytelny i intuicyjny") po uruchomieniu aplikacji?

    Rekomendacja: Proponuję zaplanowanie krótkich (5-10 minut) sesji z 1-3 docelowymi użytkownikami (pracownikami kantoru), podczas których wykonają oni kluczowe zadania w aplikacji. Zebrany w ten sposób feedback jakościowy będzie najlepszym miernikiem realnej użyteczności.

Wedlug rekomendacji

7.  Jaki powinien być dokładny czas życia danych w serwerowym mechanizmie cache (TTL)?

    Rekomendacja: Ponieważ tabele NBP są publikowane raz dziennie roboczo (zwykle między 11:45 a 12:15), zalecam ustawienie TTL na kilka godzin (np. 4-6 godzin) lub zaimplementowanie mechanizmu, który inteligentnie odświeża cache raz dziennie po godzinie 12:15. Zapewni to aktualność danych przy jednoczesnej minimalizacji zapytań do API NBP.

Wedlug rekomendacji

8.  W jaki sposób użytkownik jest informowany o ładowaniu danych, np. po otwarciu widoku historycznego lub zmianie daty?

    Rekomendacja: W celu poprawy doświadczenia użytkownika (UX), należy zaimplementować proste wskaźniki ładowania (np. "spinner" lub szkielet interfejsu) w miejscach, gdzie aplikacja pobiera dane z backendu. Zapobiegnie to wrażeniu, że aplikacja "zawiesiła się".

Wedlug rekomendacji

9.  Czy aplikacja ma obsługiwać sytuację, w której dla danego 14-dniowego okresu w przeszłości nie ma żadnych danych (np. z powodu długiej przerwy w notowaniach)?

    Rekomendacja: Zdefiniujmy stan "braku danych". Zamiast pustego wykresu/tabeli, aplikacja powinna wyświetlić jasny komunikat, np. "Brak danych dla wybranego okresu", aby użytkownik wiedział, że to zamierzone zachowanie, a nie błąd.

Wedlug rekomendacji

10. Opis wymagań mówi o uruchomieniu w "środowisku lokalnym". Co to dokładnie oznacza w kontekście docelowego wdrożenia? Czy będzie to jeden komputer w kantorze, czy serwer w sieci wewnętrznej?

    Rekomendacja: Należy sprecyzować docelowe środowisko produkcyjne. Decyzja ta wpłynie na architekturę, sposób wdrożenia i ewentualne kwestie bezpieczeństwa. Nawet dla narzędzia wewnętrznego, rekomenduję rozważenie prostego wdrożenia chmurowego (np. na małej maszynie wirtualnej), co ułatwi dostępność i zarządzanie.

Będzie to jeden komputer w kantorze
</pytania>

<pytania>
1.  Co dokładnie powinno być wyświetlone w kolumnie "Kurs kupna" dla walut, których kantor nie skupuje (CZK, IDR, BRL)? Czy pole ma być puste, zawierać myślnik ("-"), czy tekst "nie dotyczy"?

    Rekomendacja: Zalecam użycie myślnika ("-") lub skrótu "N/A" (nie dotyczy). Jest to czytelny i standardowy sposób na pokazanie, że brak wartości jest celowy, a nie jest wynikiem błędu aplikacji.

Wedlug rekomendacji

2.  Skoro aplikacja będzie działać na jednym komputerze w kantorze, kto będzie odpowiedzialny za jej instalację i przyszłe aktualizacje? Jak bardzo zautomatyzowany lub uproszczony powinien być ten proces?

    Rekomendacja: Sugeruję przygotowanie prostej, skryptowanej procedury instalacyjnej (np. z użyciem Docker Compose) oraz szczegółowej instrukcji "krok po kroku". Pozwoli to osobie z podstawową wiedzą techniczną na samodzielne uruchomienie lub zaktualizowanie aplikacji.

Wedlug rekomendacji

3.  Do ilu miejsc po przecinku powinny być zaokrąglane i wyświetlane wszystkie kursy walut w aplikacji (średni NBP, kupna, sprzedaży)?

    Rekomendacja: Standardem rynkowym jest prezentowanie kursów z dokładnością do 4 miejsc po przecinku (np. 4.3210 PLN). Ustalenie i konsekwentne stosowanie jednej zasady w całej aplikacji zapewni spójność i wiarygodność prezentowanych danych.

Wedlug rekomendacji

4.  Jakie dokładnie kolumny powinna zawierać tabela w widoku historycznym? Czy ma to być "Data", "Kurs średni NBP", "Kurs kupna", "Kurs sprzedaży"?

    Rekomendacja: Proponuję, aby tabela historyczna zawierała kolumny: "Data", "Kurs średni NBP" oraz "Kurs sprzedaży". Kolumnę "Kurs kupna" należy wyświetlać warunkowo, tylko dla walut EUR i USD, aby zachować czytelność i nie wprowadzać pustych komórek dla pozostałych walut.

Wedlug rekomendacji

5.  Jak wizualnie ma być zaprezentowany komunikat o problemie z pobraniem danych z NBP? Czy ma to być subtelna notka pod tabelą, czy bardziej widoczny baner na górze strony?

    Rekomendacja: Rekomenduję użycie dobrze widocznego, ale nieinwazyjnego paska informacyjnego (np. w kolorze żółtym) na górze ekranu. Powinien on jasno komunikować problem ("Brak połączenia z serwerem NBP") i wskazywać datę ostatnio pobranych danych, nie blokując jednocześnie dostępu do nich.

Wedlug rekomendacji

6.  W opisie wspomniano o responsywności (RWD) na komputerach i tabletach. Czy aplikacja ma być również w pełni funkcjonalna i czytelna na ekranach smartfonów?

    Rekomendacja: Nawet jeśli głównym urządzeniem będzie komputer, warto zapewnić podstawową czytelność na urządzeniach mobilnych (np. prywatny telefon pracownika). Dla MVP może to oznaczać poprawne skalowanie się tabeli i elementów, bez tworzenia dedykowanego layoutu mobilnego, co jest kompromisem między użytecznością a zakresem prac.

Wedlug rekomendacji

7.  Czy użytkownik powinien mieć możliwość sortowania tabeli z bieżącymi kursami według którejkolwiek z kolumn (np. alfabetycznie po kodzie waluty lub rosnąco/malejąco po kursie sprzedaży)?

    Rekomendacja: Dodanie prostej funkcji sortowania po kliknięciu w nagłówek kolumny jest niewielkim nakładem pracy, a znacząco podnosi użyteczność, zwłaszcza jeśli w przyszłości lista walut się powiększy. Sugeruję włączenie tej funkcji do zakresu MVP.

Wedlug rekomendacji

8.  Kto będzie miał uprawnienia i wiedzę techniczną, aby edytować plik konfiguracyjny z marżami na komputerze lokalnym? Czy pracownicy kantoru powinni być w stanie to robić samodzielnie?

    Rekomendacja: Na etapie MVP kluczowe jest stworzenie bardzo prostej dokumentacji wyjaśniającej, gdzie znajduje się plik konfiguracyjny i jaki ma format. Jeśli modyfikacje mają być częste, w przyszłości (poza MVP) warto rozważyć stworzenie prostego interfejsu do zarządzania marżami.

Wedlug rekomendacji

9.  Co użytkownik zobaczy po pierwszym uruchomieniu widoku szczegółowego/historycznego dla danej waluty, zanim wybierze jakąkolwiek datę w selektorze?

    Rekomendacja: Domyślnie, po kliknięciu w walutę, widok historyczny powinien automatycznie załadować i wyświetlić dane dla okresu 14 dni wstecz od dnia dzisiejszego. Zapewni to płynne przejście i natychmiastową prezentację wartościowych danych bez dodatkowej akcji ze strony użytkownika.

Wedlug rekomendacji

10. Czy możemy już teraz zidentyfikować 1-2 pracowników kantoru, którzy wezmą udział w testach użyteczności po zakończeniu prac deweloperskich?

    Rekomendacja: Wczesne zaplanowanie logistyki testów (kto i kiedy) pozwoli na płynne włączenie ich w harmonogram projektu i zapewni, że kluczowy feedback zostanie zebrany w odpowiednim momencie, tuż przed finalnym wdrożeniem.

Tak
</pytania>

<pytania>
1.  Czy możemy zdefiniować główną historię użytkownika (user story), aby precyzyjnie ująć cel i motywację pracownika?

    Rekomendacja: Proponuję sformułowanie w formacie: "Jako pracownik kantoru, chcę mieć możliwość szybkiego sprawdzenia aktualnych i historycznych kursów kupna/sprzedaży w jednym miejscu, aby móc sprawnie i bezbłędnie obsługiwać klientów." To pomoże zespołowi deweloperskiemu lepiej zrozumieć kontekst pracy użytkownika.

Wedlug rekomendacji

2.  Jaka jest jedna, najbardziej prawdopodobna funkcjonalność, która mogłaby zostać dodana do aplikacji zaraz po wdrożeniu MVP?

    Rekomendacja: Zastanówmy się, czy będzie to np. prosty kalkulator walutowy, dodanie kolejnych walut, czy może możliwość ręcznej, tymczasowej korekty marży. Wiedza ta pozwoli na stworzenie bardziej elastycznej architektury backendu, która ułatwi przyszły rozwój.

Wedlug rekomendacji

3.  Czy istnieją jakiekolwiek wytyczne dotyczące wyglądu interfejsu, np. preferowana kolorystyka, logo firmy do umieszczenia, czy konkretny font?

    Rekomendacja: Jeśli nie ma ścisłych wytycznych, sugeruję zastosowanie sprawdzonego, minimalistycznego frameworka UI (np. Material-UI lub Bootstrap) z domyślną, neutralną paletą barw (np. odcienie niebieskiego i szarości), co zapewni profesjonalny wygląd i czytelność przy minimalnym nakładzie pracy projektowej.

Wedlug rekomendacji

4.  Na jakich przeglądarkach internetowych i w jakich wersjach aplikacja musi działać poprawnie na docelowym komputerze?

    Rekomendacja: Proponuję zdefiniować wsparcie dla dwóch ostatnich stabilnych wersji popularnych przeglądarek, takich jak Google Chrome i Mozilla Firefox. Jest to standardowa praktyka, która zapewnia szeroką kompatybilność bez nadmiernego obciążania fazy testów.

Wedlug rekomendacji

5.  Jak użytkownik ma wracać z widoku historycznego do głównego dashboardu? Czy ma to być przycisk "Wróć", link w menu nawigacyjnym, czy kliknięcie w logo?

    Rekomendacja: Najbardziej intuicyjnym rozwiązaniem będzie umieszczenie wyraźnego przycisku "« Powrót do listy walut" w widocznym miejscu na ekranie historycznym oraz zapewnienie, że kliknięcie w logo aplikacji (jeśli istnieje) zawsze przenosi do widoku głównego.

Wedlug rekomendacji

6.  Czy dane na głównym dashboardzie powinny odświeżać się automatycznie w tle (np. co godzinę), czy tylko po ręcznym odświeżeniu strony przez użytkownika?

    Rekomendacja: Dla MVP wystarczające i bezpieczne będzie odświeżanie danych wyłącznie przy każdym załadowaniu/odświeżeniu strony. Automatyczne odświeżanie w tle (live update) można dodać później, jeśli okaże się, że użytkownicy trzymają aplikację otwartą w jednej karcie przez cały dzień.

Wedlug rekomendacji

7.  Czy interfejs aplikacji (nagłówki, przyciski, komunikaty) ma być wyłącznie w języku polskim, czy należy przewidzieć możliwość dodania innych języków w przyszłości?

    Rekomendacja: W ramach MVP skupmy się wyłącznie na języku polskim. Warto jednak od początku umieszczać wszystkie teksty interfejsu w dedykowanych plikach językowych, a nie bezpośrednio w kodzie. Ułatwi to ewentualne tłumaczenia w przyszłości bez konieczności modyfikacji logiki aplikacji.

Wedlug rekomendacji

8.  Jakie kluczowe elementy powinno zawierać końcowe wideo demonstracyjne (3-5 min)? Czy ma być to czysta prezentacja funkcji, czy również omówienie kodu i architektury?

    Rekomendacja: Proponuję następującą strukturę wideo: 1) Krótkie wprowadzenie do rozwiązywanego problemu (ok. 30s). 2) Prezentacja działania kluczowych funkcji z perspektywy użytkownika (ok. 2 min). 3) Zwięzłe omówienie najważniejszych decyzji technicznych i architektonicznych, np. schemat przepływu danych i cache'owania (ok. 1.5 min).

Wedlug rekomendacji

9.  Czy użytkownik powinien mieć możliwość łatwego skopiowania pojedynczego kursu (np. kursu sprzedaży EUR) do schowka za pomocą jednego kliknięcia?

    Rekomendacja: Dodanie małej ikonki "kopiuj" obok każdego kursu jest drobną funkcjonalnością, która może znacząco usprawnić pracę pracownika, eliminując ryzyko pomyłki przy ręcznym przepisywaniu wartości. Warto rozważyć jej dodanie do zakresu MVP.

Wedlug rekomendacji

10. Czy selektor daty w widoku historycznym powinien mieć jakieś ograniczenia, np. uniemożliwiać wybranie daty z przyszłości?

    Rekomendacja: Zdecydowanie tak. Należy zablokować możliwość wyboru przyszłych dat. Dodatkowo warto ograniczyć wybór dat do okresu, dla którego NBP udostępnia dane w swoim API (obecnie od 2 stycznia 2002), aby uniknąć zapytań, które z góry zwrócą błąd "404 Not Found".

Wedlug rekomendacji
</pytania>