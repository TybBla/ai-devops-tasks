# Zadanie 23 — pary z zadaną sumą (`findPairs`)

## Pliki

| Plik | Opis |
|------|------|
| `find-pairs.js` | Wersja oryginalna (zagnieżdżone pętle) |
| `find-pairs-optimized.js` | Wersja z mapą hash |
| `zadanie-23.md` | Analiza złożoności i optymalizacja |

---

## Algorytm oryginalny

```javascript
// find-pairs.js — dwie pętle i + j
for (let i = 0; i < arr.length; i++) {
  for (let j = i + 1; j < arr.length; j++) {
    if (arr[i] + arr[j] === targetSum) {
      pairs.push([arr[i], arr[j]]);
    }
  }
}
```

Dla każdej **unikalnej pary indeksów** `(i, j)`, gdzie `i < j`, sprawdzana jest suma elementów.

---

## Złożoność czasowa (oryginał)

| Notacja | Wartość | Uzasadnienie |
|---------|---------|--------------|
| **Czas** | **O(n²)** | Zewnętrzna pętla `n` iteracji, wewnętrzna średnio ~`n/2` → rząd `n²` porównań |
| Najlepszy przypadek | O(n²) | Zawsze przechodzi wszystkie pary (brak wczesnego wyjścia) |
| Najgorszy przypadek | O(n²) | Jak wyżej |

`n` = `arr.length`.

---

## Złożoność pamięciowa (oryginał)

| Notacja | Wartość | Uzasadnienie |
|---------|---------|--------------|
| **Pamięć dodatkowa** | **O(k)** | `k` = liczba znalezionych par w tablicy `pairs` |
| Pomocnicza struktura | O(1) | Tylko indeksy `i`, `j` — stała pamięć poza wynikiem |

Wynik może w skrajnym przypadku mieć O(n²) par (np. same zera, `targetSum = 0`), więc **całkowita pamięć wyniku** też może być kwadratowa — to wymóg problemu, nie overhead algorytmu.

---

## Czy można zoptymalizować?

**Tak** — jedno przejście z **mapą** (słownikiem) zliczającą już widziane wartości.

### Idea

Dla elementu `num` szukamy **dopełnienia** `complement = targetSum - num`. Jeśli `complement` już wystąpił w tablicy, tworzymy parę `[complement, num]` tyle razy, ile `complement` już widzieliśmy (obsługa duplikatów).

### Złożoność (zoptymalizowana)

| Notacja | Wartość |
|---------|---------|
| **Czas** | **O(n)** — jedna pętla; operacje na `Map` O(1) średnio |
| **Pamięć dodatkowa** | **O(n)** — mapa do `n` unikalnych wartości (w pesymistycznym przypadku) |

Wewnętrzna pętla `for (k = 0; k < count; k++)` wykonuje się tylko tyle razy, ile **faktycznych par** trzeba dopisać — łącznie wszystkie iteracje `k` na całym algorytmie odpowiadają liczbie par w wyniku, nie `n²`.

---

## Porównanie wersji

| Aspekt | `find-pairs.js` | `find-pairs-optimized.js` |
|--------|-----------------|---------------------------|
| Czas | O(n²) | O(n) średnio |
| Pamięć pomocnicza | O(1) | O(n) |
| Czytelność | Prostsza | Wymaga znajomości mapy |
| Duplikaty w `arr` | Działa | Działa (zliczanie w `Map`) |

---

## Przykład

```javascript
const arr = [1, 5, 3, 7, 5];
const target = 10;
// Wynik: [[3, 7], [5, 5]]
```

- `3 + 7 = 10`
- `5 + 5 = 10` (dwa różne elementy o wartości 5)

Oba algorytmy zwracają te same pary (kolejność może się różnić: oryginał według indeksów `i < j`, wersja z mapą według kolejności skanowania).

---

## Uruchomienie testu w Node.js

```bash
node -e "
const a = require('./find-pairs').findPairs;
const b = require('./find-pairs-optimized').findPairs;
const arr = [1, 5, 3, 7, 5];
console.log('oryginał:', a(arr, 10));
console.log('optymalizacja:', b(arr, 10));
"
```

---

## Podsumowanie

- **Oryginał:** prosty, **O(n²)** czasu, mało pamięci pomocniczej.
- **Optymalizacja:** **O(n)** czasu kosztem **O(n)** pamięci na `Map` — standardowe podejście „two sum” / pary z sumą w jednym przejściu.
- Przy małych tablicach różnica jest nieistotna; przy dużych `n` (tysiące+ elementów) wersja z mapą jest wyraźnie szybsza.
