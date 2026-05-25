# Zadanie 21 — konwersja JSON → CSV (użytkownicy)

## Pliki

| Plik | Opis |
|------|------|
| `users.json` | Oryginalne dane (tablica `users`) |
| `users.csv` | Wynik konwersji |
| `zadanie-21.md` | Proces i wyzwania |

---

## Proces konwersji

### 1. Odczyt struktury JSON

Dane są zagnieżdżone w obiekcie głównym pod kluczem `users`. Każdy element tablicy to jeden wiersz w CSV.

### 2. Nagłówek CSV

Pierwszy wiersz definiuje kolumny zgodnie z wymaganiami:

```text
id,name,email,roles
```

### 3. Mapowanie pól skalarnych

| JSON | CSV |
|------|-----|
| `id` | kolumna `id` (liczba) |
| `name` | kolumna `name` |
| `email` | kolumna `email` |

### 4. Transformacja tablicy `roles`

Tablica `["admin", "user"]` nie ma bezpośredniego odpowiednika w płaskim CSV. W `users.csv` zastosowano:

- **Połączenie ról separatorem `;`** w jednej kolumnie: `admin;user`
- Wartość w **cudzysłowie**, gdy zawiera separator lub wiele ról: `"admin;user"`

| Użytkownik | `roles` w JSON | `roles` w CSV |
|------------|----------------|---------------|
| Jan Kowalski | `["admin", "user"]` | `"admin;user"` |
| Anna Nowak | `["user"]` | `user` |

### 5. Escapowanie CSV

- Pola ze przecinkiem, cudzysłowem lub znakiem nowej linii otacza się `"..."`.
- Imię i nazwisko bez przecinka — zapis bez cudzysłowu (dopuszczalne w prostym CSV).

---

## Wynik (`users.csv`)

```csv
id,name,email,roles
1,Jan Kowalski,jan@example.com,"admin;user"
2,Anna Nowak,anna@example.com,user
```

---

## Potencjalne wyzwania przy JSON → CSV

### 1. Tablice i zagnieżdżenia (np. `roles`)

| Podejście | Zalety | Wady |
|-----------|--------|------|
| Separator w jednej kolumnie (`;`, `\|`) | Proste, jeden wiersz = jeden rekord | Trzeba ustalić konwencję; rola może zawierać `;` |
| JSON w komórce | Pełna struktura | Trudne w Excelu, podwójne cudzysłowy |
| Osobny plik / wiele wierszy | Normalizacja (1 rola = 1 wiersz) | Jeden user → wiele wierszy, duplikacja `id`, `name` |
| Wiele kolumn (`role1`, `role2`) | Płaskie | Zła skalowalność przy zmiennej liczbie ról |

W tym zadaniu wybrano **separator `;` w jednej kolumnie** — najczęstszy kompromis w eksporcie raportowym.

### 2. Zagnieżdżone obiekty

Gdyby user miał np. `address: { city, zip }`, trzeba by spłaszczyć (`address_city`) lub pominąć — CSV nie obsługuje drzewa naturalnie.

### 3. Typy danych

JSON rozróżnia liczby, stringi, boolean. CSV to tekst — `id` pozostaje liczbą w zapisie, ale po imporcie wszystko może stać się stringiem.

### 4. Kodowanie i znaki specjalne

Polskie znaki (ą, ę) wymagają UTF-8 przy zapisie pliku. Excel czasem błędnie otwiera CSV bez BOM.

### 5. Brak schematu w CSV

Odbiorca musi znać znaczenie kolumny `roles` (np. dokumentacja: „role oddzielone średnikiem”). JSON ma jawne typy i strukturę.

### 6. Pusta tablica / null

- `roles: []` → puste pole lub `""`
- `roles: null` → wymaga reguły w pipeline ETL

---

## Odwrotna konwersja (CSV → JSON)

Przy imporcie należy `split(';')` na kolumnie `roles` i zbudować tablicę — uwaga na trim spacji i na role zawierające `;` w nazwie (rzadkie, ale możliwe).

---

## Podsumowanie

Konwersja polega na **spłaszczeniu** każdego obiektu `users[]` do jednego wiersza. Największe wyzwanie to **tablica `roles`**, rozwiązana przez scalenie wartości w jednej kolumnie z separatorem. Dla produkcji warto udokumentować separator w README lub w nagłówku pliku (np. komentarz w pierwszym wierszu — nie standard CSV, ale spotykane).
