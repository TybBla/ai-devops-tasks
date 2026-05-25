Stwórz prosty diagram ASCII Art przedstawiający połączenie klienta, serwera aplikacji i bazy danych.

                    ┌─────────────┐
                    │   Klient    │
                    │ (przeglądarka│
                    │  / aplikacja)│
                    └──────┬──────┘
                           │
                      HTTP / HTTPS
                           │
                           ▼
                    ┌─────────────┐
                    │   Serwer    │
                    │ aplikacji   │
                    │  (API)      │
                    └──────┬──────┘
                           │
                    SQL / TCP (np. 5432)
                           │
                           ▼
                    ┌─────────────┐
                    │   Baza      │
                    │  danych     │
                    └─────────────┘
Klient wysyła żądania do serwera aplikacji; serwer odczytuje i zapisuje dane w bazie.

Dodaj do diagramu opisy elementów i kierunki przepływu danych.

┌──────────────────────────────────────────────────────────────────────────┐
│  KLIENT                                                                  │
│  (przeglądarka, aplikacja mobilna, inny system)                          │
│  • wysyła żądania użytkownika (GET, POST, …)                             │
│  • odbiera odpowiedzi (JSON, HTML, status HTTP)                          │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
                    żądanie  ───┼───►  (np. HTTP/HTTPS)
                    odpowiedź ◄─┼───   (dane + kod statusu)
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  SERWER APLIKACJI (backend / API)                                        │
│  • waliduje żądania, logika biznesowa, autoryzacja                       │
│  • wysyła zapytania do bazy (SELECT, INSERT, UPDATE, DELETE)             │
│  • zwraca wyniki klientowi po przetworzeniu                              │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │
              zapytanie SQL  ───┼───►  (np. TCP port 5432 / 3306)
              wynik / wiersze ◄─┼───   (rekordy, potwierdzenie zapisu)
                                │
                                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│  BAZA DANYCH                                                             │
│  • trwałe przechowywanie danych (tabele, indeksy)                        │
│  • wykonuje zapytania i zwraca wyniki serwerowi                          │
│  • nie komunikuje się bezpośrednio z klientem                            │
└──────────────────────────────────────────────────────────────────────────┘
Przepływ typowego odczytu danych:
  Klient ──(1) żądanie──► Serwer ──(2) SELECT──► Baza
  Klient ◄─(4) odpowiedź── Serwer ◄─(3) wyniki──── Baza
Elementy

Element	Rola
Klient
Interfejs użytkownika; inicjuje komunikację z serwerem
Serwer aplikacji
Pośrednik: logika, bezpieczeństwo, format odpowiedzi
Baza danych
Magazyn danych; dostęp tylko przez serwer
Kierunki przepływu

Klient → Serwer: żądania (wejście użytkownika).
Serwer → Klient: odpowiedzi (przetworzone dane).
Serwer → Baza: zapytania i zapisy.
Baza → Serwer: wyniki zapytań (nigdy bezpośrednio do klienta w klasycznym modelu trójwarstwowym).