# Zadanie 15 — refaktoryzacja `getEnvironmentConfig`

## Pliki

| Plik | Opis |
|------|------|
| `config.js` | Oryginalna funkcja z łańcuchem `if / else if` |
| `config-refactored.js` | Wersja oparta na mapie konfiguracji |
| `zadanie-15.md` | Opis zmian i korzyści |

---

## Co zostało zmienione

### 1. Mapa zamiast wielu `if / else if`

Konfiguracje wszystkich środowisk zebrane są w jednym obiekcie `ENVIRONMENT_CONFIG`. Funkcja tylko **wybiera wpis** po kluczu `env`.

### 2. Domyślne środowisko jako stała

`DEFAULT_ENV = 'development'` — zamiast duplikować ten sam obiekt w ostatnim `else`, używane jest:

```javascript
ENVIRONMENT_CONFIG[env] ?? ENVIRONMENT_CONFIG[DEFAULT_ENV]
```

Operator `??` zwraca konfigurację development dla `undefined`, `null` lub nieznanego klucza (jak oryginalny `else`).

### 3. Eksport mapy (opcjonalnie)

`ENVIRONMENT_CONFIG` jest eksportowany — można np. wyświetlić listę środowisk w CLI lub testach bez duplikacji danych.

---

## Korzyści z refaktoryzacji

| Korzyść | Wyjaśnienie |
|---------|-------------|
| **Czytelność** | Widać od razu wszystkie środowiska i ich parametry w jednym miejscu |
| **Łatwiejsze utrzymanie** | Nowe środowisko = jeden wpis w obiekcie, bez kolejnego `else if` |
| **Mniej duplikacji** | Domyślna konfiguracja zdefiniowana raz (`DEFAULT_ENV`) |
| **Łatwiejsze testy** | Można testować `ENVIRONMENT_CONFIG` i funkcję osobno |
| **Rozszerzalność** | Można dodać walidację kluczy, merge z bazą wspólną pól itd. bez rozrostu funkcji |

Zachowanie funkcji pozostaje **zgodne z oryginałem** — te same URL-e, `debug` i `timeout` dla każdego `env`.

---

## Struktura w repozytorium

```
ai-devops-tasks/
├── config.js
├── config-refactored.js
└── zadanie-15.md
```

---

## Dalsze usprawnienia (opcjonalne)

- Wspólne pola (`timeout`, `debug`) w obiekcie `base` + nadpisania per środowisko (`Object.assign` / spread).
- Walidacja `env` przez listę dozwolonych kluczy `Object.keys(ENVIRONMENT_CONFIG)`.
- Ładowanie wartości z zmiennych środowiskowych (`process.env`) zamiast hardcodów w pliku.
