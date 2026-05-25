# Zadanie 17 — filtrowanie i sortowanie zadań

## Pliki

| Plik | Opis |
|------|------|
| `task-filter.js` | Funkcja `getCompletedTaskTitles` |
| `zadanie-17.md` | Opis rozwiązania i przykład użycia |

---

## Wymagania

1. Wejście: tablica obiektów `{ id, title, status }`
2. Filtrowanie: tylko `status === "completed"`
3. Sortowanie: rosnąco po `id`
4. Wyjście: tablica **samych tytułów** (`string[]`)

---

## Rozwiązanie

Funkcja `getCompletedTaskTitles` łączy trzy operacje na tablicy w jednym łańcuchu:

| Krok | Metoda | Działanie |
|------|--------|-----------|
| 1 | `.filter()` | Zostawia tylko zadania ze statusem `"completed"` |
| 2 | `.sort()` | Sortuje po `id` rosnąco (`a.id - b.id`) |
| 3 | `.map()` | Zamienia obiekty na pole `title` |

Kolejność jest istotna: najpierw filtr, potem sort, na końcu mapowanie na tytuły.

---

## Przykład użycia

```javascript
const { getCompletedTaskTitles } = require('./task-filter');

const tasks = [
  { id: 3, title: 'Wdrożyć API', status: 'completed' },
  { id: 1, title: 'Napisać testy', status: 'pending' },
  { id: 2, title: 'Code review', status: 'completed' },
  { id: 4, title: 'Dokumentacja', status: 'completed' }
];

const titles = getCompletedTaskTitles(tasks);

console.log(titles);
// ['Code review', 'Wdrożyć API', 'Dokumentacja']
```

Wyjaśnienie wyniku:

- Zadanie `id: 1` odpada (status `pending`)
- Zostają id: 2, 3, 4 — sortowanie rosnąco → 2, 3, 4
- Tytuły w tej kolejności: `Code review`, `Wdrożyć API`, `Dokumentacja`

---

## Uruchomienie w Node.js

```bash
node -e "const { getCompletedTaskTitles } = require('./task-filter'); console.log(getCompletedTaskTitles([{id:3,title:'A',status:'completed'},{id:1,title:'B',status:'completed'}]));"
```

Oczekiwany wynik: `[ 'B', 'A' ]` (najpierw id 1, potem 3).
