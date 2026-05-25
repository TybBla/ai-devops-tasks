# Zadanie 13 — dokumentacja JSDoc dla `fetchUserData`

## Pliki w repozytorium

| Plik | Opis |
|------|------|
| `fetch-user.js` | Oryginalna funkcja bez komentarzy JSDoc |
| `fetch-user-documented.js` | Ta sama funkcja z pełnym blokiem JSDoc |
| `zadanie-13.md` | Ten plik — krótki opis JSDoc |

---

## Czym jest JSDoc?

**JSDoc** to konwencja komentarzy w JavaScript (bloki `/** ... */`), która opisuje funkcje, parametry, typy zwracane i przykłady użycia. Edytory (VS Code, Cursor) oraz narzędzia (`typedoc`, analizatory kodu) mogą na tej podstawie pokazywać podpowiedzi i generować dokumentację HTML.

Nie zmienia działania kodu w runtime — służy **ludziom i narzędziom**.

---

## Najczęstsze tagi (użyte w `fetch-user-documented.js`)

| Tag | Znaczenie |
|-----|-----------|
| `@param {typ} nazwa - opis` | Argument funkcji |
| `@returns {typ} opis` | Wartość zwracana |
| `@async` | Funkcja zwraca `Promise` |
| `@typedef` | Definicja typu obiektu (np. `UserData`) |
| `@property` | Pole w `@typedef` |
| `@example` | Przykład wywołania |
| `@throws` | Kiedy może wystąpić błąd (tu: wewnętrznie, obsłużony w `.catch`) |

---

## Struktura plików

```
ai-devops-tasks/
├── fetch-user.js
├── fetch-user-documented.js
└── zadanie-13.md
```

Oba pliki eksportują `fetchUserData` przez `module.exports` — można je importować w Node (od 18+) lub w bundlerze; w przeglądarce wymagany jest globalny `fetch` lub polyfill.
