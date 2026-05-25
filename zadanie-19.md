# Zadanie 19 — refleksje: dokumentacja `GET /api/users`

Dokumentacja zapisana w pliku **`api-docs.md`**.

---

## Mocne strony wygenerowanej dokumentacji

1. **Struktura czytelna dla developera** — osobne sekcje: opis, parametry, żądanie, odpowiedź, błędy. Łatwo skanować wzrokiem.
2. **Tabela parametrów** — typ, wymagalność, wartości domyślne i ograniczenie `max 100` dla `limit` są jasno opisane.
3. **Przykłady praktyczne** — surowe HTTP, wariant z query string oraz `curl` — ułatwia szybkie testowanie bez czytania całej specyfikacji.
4. **Przykładowa odpowiedź JSON** z metadanymi paginacji — pokazuje kształt kontraktu API, nie tylko listę pól.
5. **Sekcja błędów** — choć endpoint był opisany minimalnie, dodanie `400`/`401`/`500` przybliża realne użycie w produkcji.

---

## Ograniczenia i luki (co można ulepszyć)

| Obszar | Brak / niepewność |
|--------|-------------------|
| **Autoryzacja** | Wspomniana ogólnie, bez wymaganego nagłówka, scope ani ról dostępu do endpointu |
| **Lista ról** | `role` jako filtr bez enumeracji dozwolonych wartości (`admin`, `user`, …) |
| **Zachowanie przy `limit > 100`** | Opis „max 100” bez jednoznacznej reguły (obcięcie vs błąd 400) |
| **Sortowanie** | Brak informacji, czy wyniki są sortowane (np. po `id`, `name`) |
| **Nagłówki odpowiedzi** | Brak `ETag`, `Cache-Control`, rate limiting |
| **OpenAPI** | Markdown jest czytelny dla ludzi; brak pliku `openapi.yaml` do codegen i Swagger UI |
| **Przykład pustej strony** | Brak scenariusza `page` poza zakresem (np. `page=999`) |

---

## Jakość w kontekście zadania DevOps / API

Dokumentacja **spełnia wymagania zadania**: opis endpointu, parametry, przykładowe żądanie i odpowiedź w Markdown. Jest gotowa jako **punkt wyjścia** dla zespołu frontend/backend i do umieszczenia w repozytorium (`api-docs.md`).

Do poziomu **produkcyjnego** warto dodać:

- link do pełnej specyfikacji OpenAPI 3.x,
- wersjonowanie API (`/api/v1/users`),
- changelog przy zmianach kontraktu,
- przykłady odpowiedzi dla każdego kodu błędu z sekcji tabeli.

---

## Wnioski

Wygenerowana dokumentacja jest **zwięzła, poprawna logicznie i użyteczna** dla typowego CRUD/list endpointu. Największą wartość dodają tabele i konkretne przykłady JSON/HTTP. Słabszym punktem jest **niedoprecyzowanie reguł walidacji i kontraktu błędów** — w realnym projekcie trzeba by je zsynchronizować 1:1 z implementacją serwera lub wygenerować docs automatycznie z kodu (np. Swagger z adnotacji).

**Ocena:** dobra jakość na potrzeby szkolenia i wewnętrznego README API; do publicznego API developer portal wymagałby uzupełnienia o OpenAPI i testy kontraktu (contract tests).
