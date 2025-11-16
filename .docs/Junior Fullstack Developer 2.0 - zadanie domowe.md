# Zadanie rekrutacyjne

## Junior Fullstack Developer @ Telemedi

Zapraszamy Cię do wykonania zadania rekrutacyjnego 🙂 Napisany przez Ciebie kod będzie użyty wyłącznie w celach rekrutacyjnych i nie będzie wykorzystany nigdzie indziej.

Przygotowaliśmy dla Ciebie repozytorium kodu, w którym znajdziesz: bazę kodową, na której należy się oprzeć,  podstawowe wskazówki jak zacząć pracę, jak również wytyczne do implementacji i sposobu oddania zadania.

Repozytorium: [**https://github.com/telemedico/recruitment\_task\_fullstack**](https://github.com/telemedico/recruitment_task_fullstack)

## Zadanie

Celem zadania jest stworzenie mini-aplikacji, która będzie prezentować dane potrzebne pracownikowi kantoru do codziennej pracy. Ten pracownik potrzebuje móc zobaczyć bieżące kursy walut obsługiwanych przez kantor (tj. sprzedawanych przez kantor), oraz dla tych walut móc zobaczyć też historię kursów z ostatnich 14 dni przed wybraną datą (domyślnie dzisiejszą).

Waluty, których kursy obsługuje kantor, to: euro (EUR), dolar amerykański (USD), korona czeska (CZK), rupia indonezyjska (IDR), real brazylijski (BRL) \- ew. zmiana listy walut obsługiwanych może wiązać się z koniecznością wprowadzenia niedużej zmiany w kodzie.

Kurs kupna i sprzedaży walut przyjmujemy, że są w stałęj różnicy od kursu NBP:

1. dla walut EUR i USD kurs:  
   1. kupna jest mniejszy o 0.15 PLN względem kursu średniego  
   2. sprzedaży jest większy o 0.11 PLN względem kursu średniego  
2. Dla pozostałych walut kantor nie prowadzi kupowania danej waluty, a kurs sprzedaży jest większy o 0.2 PLN względem kursu średniego

Dla pracownika kantoru istotna jest czytelność i użyteczność aplikacji, oraz wydajność jej działania (tj. aplikacja powinna być gotowa na ruch wielu pracowników kantorów) \- resztę założeń i warstwę prezentacji zostawiamy Tobie.

Jeśli będziesz planował użycie bazy danych \- użyj np. Airtable (udostępniając ją tak żeby dało się odpalic aplikację lokalnie ze środowiska \- normalnie tego się nie robi, ale w tym wypadku możesz zacommitować token do Airtable w repo).

**Przygotuj:**

1. **działającą aplikację** (frontend (React) \+ backend PHP Symfony, w formie API), opierając się o fork z podanego repozytorium.  
2. **kilkuminutowe (3-5 min) wideo,** na którym pokażesz jak działa Twoja aplikacja i ew. pokażesz swój kod, i opowiesz o decyzjach projektowych, które przyjąłeś (tj. jakie i dlaczego takie).  
   1. to istotne \- zależy nam na poznaniu Twojego sposobu myślenia.

*Wskazówki:*

1. Kursy walut (kupno+sprzedaż) są ustalane względem średniego kursu waluty w NBP  
2. NBP udostępnia średnie kursy po API \- pełna dokumentacja API: [https://api.nbp.pl/](https://api.nbp.pl/) (kurs na dany dzień pojawia się w południe\!)  
3. Przydatne mogą być endpointy:  
   1. [https://api.nbp.pl/api/exchangerates/tables/A/?format=json](https://api.nbp.pl/api/exchangerates/tables/A/?format=json)  
   2. [https://api.nbp.pl/api/exchangerates/rates/A/USD?format=json](https://api.nbp.pl/api/exchangerates/rates/A/USD?format=json)  
4. Oczekujemy implementacji API backendowego, więc przyjmujemy, że API NBP jest dostępne wyłącznie z poziomu serwera PHP, a nie przeglądarki.

**Zakończenie pracy i wysłanie wyniku**

Zastosuj się proszę do wytycznych z README w repozytorium \- pamiętaj załączyć do maila link do video, oraz udostępnić kod.  
