# Zadanie 11 — test jednostkowy funkcji `sum` (Jest)

## Struktura plików

```
ai-devops-tasks/
├── package.json       # konfiguracja npm i skrypt test
├── package-lock.json  # po npm install (generowany automatycznie)
├── sum.js             # funkcja do testowania
├── sum.test.js        # test jednostkowy Jest
├── zadanie-11.md      # ten plik
└── node_modules/      # po npm install (w .gitignore)
```

## Pliki źródłowe

### `sum.js`

Funkcja dodaje dwa argumenty i eksportuje się przez `module.exports`, żeby test mógł ją zaimportować.

### `sum.test.js`

Test importuje `sum` z `./sum`, grupuje przypadki w `describe('sum')` i sprawdza wynik przez `expect(...).toBe(...)`.

---

## Czym jest Jest?

**Jest** to framework do testów jednostkowych w JavaScript/Node.js. Uruchamia pliki `*.test.js`, wykonuje funkcje testowe i raportuje, czy wyniki zgadzają się z oczekiwaniami. W pipeline CI/CD krok `npm test` często wykonuje się po buildzie, przed deployem.

---

## Instalacja

W katalogu `ai-devops-tasks` (tam, gdzie leżą `sum.js` i `package.json`):

```bash
cd ai-devops-tasks
npm install
```

Pierwszy raz w projekcie (gdy nie ma jeszcze `package.json`):

```bash
npm init -y
npm install --save-dev jest
```

W `package.json` musi być skrypt:

```json
"scripts": {
  "test": "jest"
}
```

---

## Uruchomienie testów

```bash
npm test
```

Oczekiwany wynik: status `PASS`, 2 testy w grupie `sum`.

Tryb podglądu (opcjonalnie):

```bash
npx jest --watch
```

---

## Wyjaśnienie testu

| Element | Znaczenie |
|---------|-----------|
| `require('./sum')` | Import testowanej funkcji z tego samego folderu |
| `describe('sum', ...)` | Grupa testów dla jednej funkcji |
| `test('...', ...)` | Pojedynczy przypadek testowy |
| `expect(sum(2, 3)).toBe(5)` | Asercja: wynik musi równać się 5 |

Test jednostkowy sprawdza **samą funkcję**, bez serwera HTTP, bazy ani Dockera — szybka weryfikacja logiki przed wdrożeniem.

---

## Dlaczego `node_modules` nie trafia do Gita?

Zależności instaluje się lokalnie przez `npm install` na podstawie `package.json` / `package-lock.json`. Katalog `node_modules/` jest w `.gitignore`.
