# API — Użytkownicy

## GET /api/users

Zwraca paginowaną listę użytkowników. Opcjonalnie można filtrować wyniki według roli.

### Opis

Endpoint służy do pobierania listy użytkowników z obsługą stronicowania. Domyślnie zwracana jest pierwsza strona z maksymalnie 10 rekordami. Odpowiedź zawiera metadane paginacji ułatwiające nawigację po kolejnych stronach.

---

### Parametry zapytania (query)

| Parametr | Typ | Wymagany | Domyślnie | Opis |
|----------|-----|----------|-----------|------|
| `page` | `integer` | Nie | `1` | Numer strony (od 1). |
| `limit` | `integer` | Nie | `10` | Liczba wyników na stronę. Maksymalnie **100**. |
| `role` | `string` | Nie | — | Filtr według roli użytkownika (np. `admin`, `user`, `moderator`). |

#### Walidacja

- `page` — liczba całkowita ≥ 1
- `limit` — liczba całkowita od 1 do 100 (wartości powyżej 100 są traktowane jako 100 lub zwracany błąd `400`, zależnie od implementacji serwera)
- `role` — jeśli podany, musi odpowiadać jednej z obsługiwanych ról

---

### Przykładowe żądanie

**Podstawowe (domyślne parametry):**

```http
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
```

**Z parametrami:**

```http
GET /api/users?page=2&limit=25&role=admin HTTP/1.1
Host: api.example.com
Accept: application/json
```

**cURL:**

```bash
curl -X GET "https://api.example.com/api/users?page=2&limit=25&role=admin" \
  -H "Accept: application/json"
```

---

### Odpowiedź sukcesu

**Status:** `200 OK`

**Content-Type:** `application/json`

```json
{
  "data": [
    {
      "id": 11,
      "email": "anna@example.com",
      "name": "Anna Kowalska",
      "role": "admin"
    },
    {
      "id": 12,
      "email": "jan@example.com",
      "name": "Jan Nowak",
      "role": "admin"
    }
  ],
  "pagination": {
    "page": 2,
    "limit": 25,
    "total": 48,
    "totalPages": 2
  }
}
```

#### Pola odpowiedzi

| Pole | Typ | Opis |
|------|-----|------|
| `data` | `array` | Tablica obiektów użytkownika na bieżącej stronie |
| `data[].id` | `integer` | Unikalny identyfikator użytkownika |
| `data[].email` | `string` | Adres e-mail |
| `data[].name` | `string` | Imię i nazwisko |
| `data[].role` | `string` | Rola użytkownika |
| `pagination.page` | `integer` | Aktualna strona |
| `pagination.limit` | `integer` | Limit na stronę |
| `pagination.total` | `integer` | Łączna liczba pasujących użytkowników |
| `pagination.totalPages` | `integer` | Liczba stron |

---

### Odpowiedzi błędów (przykładowe)

| Status | Opis |
|--------|------|
| `400 Bad Request` | Nieprawidłowe parametry (np. `page=0`, `limit=abc`) |
| `401 Unauthorized` | Brak lub nieprawidłowy token autoryzacji |
| `500 Internal Server Error` | Błąd serwera |

**Przykład `400`:**

```json
{
  "error": "Invalid query parameter",
  "message": "limit must be between 1 and 100"
}
```

---

### Uwagi

- Endpoint **tylko do odczytu** (GET) — nie modyfikuje danych.
- W produkcji zalecana autoryzacja (np. nagłówek `Authorization: Bearer <token>`).
- Pusta lista przy poprawnym zapytaniu zwraca `200` z `data: []`.
