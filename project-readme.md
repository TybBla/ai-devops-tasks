# Simple Task API

REST API do zarządzania zadaniami, zbudowane w **Node.js**, **Express** i **MongoDB**.

## Opis

Simple Task API umożliwia tworzenie i zarządzanie zadaniami w aplikacjach webowych i mobilnych. Każde zadanie może mieć status, priorytet i metadane przypisane do zalogowanego użytkownika.

**Główne funkcje:**

- CRUD zadań (tworzenie, odczyt, aktualizacja, usuwanie)
- Filtrowanie listy zadań według **statusu** i **priorytetu**
- Prosta **autoryzacja** użytkowników (logowanie, token)

---

## Instalacja

### Wymagania

- Node.js 18+
- MongoDB 6+ (lokalnie lub Docker)
- npm lub yarn

### Kroki

```bash
git clone https://github.com/example/simple-task-api.git
cd simple-task-api
npm install
```

Skopiuj plik środowiskowy i uzupełnij zmienne:

```bash
cp .env.example .env
```

Przykładowa zawartość `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/simple-task-api
JWT_SECRET=your-secret-key
```

Uruchom MongoDB (np. Docker):

```bash
docker run -d -p 27017:27017 --name mongo mongo:7
```

Uruchom serwer:

```bash
npm start
# tryb deweloperski:
npm run dev
```

API domyślnie nasłuchuje na `http://localhost:3000`.

---

## Użycie

### Rejestracja i logowanie

```bash
# Rejestracja
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'

# Logowanie (zwraca token JWT)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"secret123"}'
```

Kolejne żądania wymagają nagłówka:

```http
Authorization: Bearer <token>
```

### Przykład: utworzenie zadania

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Wdrożyć endpointy",
    "description": "CRUD + filtry",
    "status": "pending",
    "priority": "high"
  }'
```

### Filtrowanie zadań

```bash
curl "http://localhost:3000/api/tasks?status=completed&priority=high" \
  -H "Authorization: Bearer <token>"
```

---

## Endpointy API

### Autoryzacja

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/auth/register` | Rejestracja użytkownika |
| `POST` | `/api/auth/login` | Logowanie, zwrot tokenu JWT |

### Zadania (wymagany token)

| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/tasks` | Lista zadań (filtry: `status`, `priority`) |
| `GET` | `/api/tasks/:id` | Pojedyncze zadanie |
| `POST` | `/api/tasks` | Utworzenie zadania |
| `PUT` | `/api/tasks/:id` | Aktualizacja zadania |
| `DELETE` | `/api/tasks/:id` | Usunięcie zadania |

### Parametry zapytania — `GET /api/tasks`

| Parametr | Typ | Opis |
|----------|-----|------|
| `status` | `string` | Opcjonalnie: `pending`, `in_progress`, `completed` |
| `priority` | `string` | Opcjonalnie: `low`, `medium`, `high` |

### Przykładowy model zadania (odpowiedź)

```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Wdrożyć endpointy",
  "description": "CRUD + filtry",
  "status": "pending",
  "priority": "high",
  "createdAt": "2025-05-19T10:00:00.000Z",
  "updatedAt": "2025-05-19T10:00:00.000Z"
}
```

### Kody odpowiedzi

| Kod | Znaczenie |
|-----|-----------|
| `200` | Sukces (odczyt, aktualizacja) |
| `201` | Utworzono |
| `204` | Usunięto (brak treści) |
| `400` | Błędne dane wejściowe |
| `401` | Brak lub nieprawidłowy token |
| `404` | Nie znaleziono zasobu |

---

## Licencja

MIT (przykład — dostosuj do projektu).
