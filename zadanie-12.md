# Zadanie 12 — optymalizacja funkcji `find_duplicates`

## Czy kod można zoptymalizować?

**Tak.** Oryginalna wersja używa dwóch zagnieżdżonych pętli — dla każdej pary indeksów `(i, j)` sprawdza równość elementów. Złożoność czasowa to **O(n²)**, gdzie `n` to długość listy. Przy dużych listach rośnie to kwadratowo (np. 10 000 elementów → rząd 100 mln porównań).

Dodatkowo `list_of_items[i] not in duplicates` przy liście `duplicates` to **O(k)** na każde trafienie (`k` = liczba już znalezionych duplikatów), co w pesymistycznym przypadku jeszcze pogarsza wydajność.

---

## Wersja oryginalna

```python
def find_duplicates(list_of_items):
    duplicates = []
    for i in range(len(list_of_items)):
        for j in range(i + 1, len(list_of_items)):
            if list_of_items[i] == list_of_items[j] and list_of_items[i] not in duplicates:
                duplicates.append(list_of_items[i])
    return duplicates
```

**Działanie:** dla każdej pary różnych pozycji sprawdza, czy wartości są takie same; jeśli tak i wartość nie była jeszcze w `duplicates`, dopisuje ją do wyniku.

**Złożoność:** czas **O(n²)**, pamięć **O(d)** — `d` to liczba unikalnych duplikatów w wyniku.

---

## Wersja zoptymalizowana

```python
def find_duplicates(list_of_items):
    seen = set()
    duplicates = []
    dup_added = set()

    for item in list_of_items:
        if item in seen and item not in dup_added:
            duplicates.append(item)
            dup_added.add(item)
        seen.add(item)

    return duplicates
```

**Działanie:** jeden przejazd po liście. `seen` zapamiętuje elementy już napotkane; przy **drugim** (i każdym kolejnym) wystąpieniu traktujemy wartość jako duplikat. `dup_added` gwarantuje, że każda wartość trafi do wyniku **co najwyżej raz** (jak `not in duplicates` w oryginale). Kolejność w wyniku odpowiada **pierwszemu powtórzeniu** wartości na liście (zgodnie z logiką oryginału).

**Złożoność:** czas **O(n)** (średnio O(1) dla operacji na `set`), pamięć **O(n)** na zbiór `seen`.

### Przykład

```python
find_duplicates([1, 2, 2, 3, 2, 1])  # → [2, 1]
```

- `2` — duplikat przy drugim wystąpieniu  
- `1` — duplikat przy drugim wystąpieniu (na końcu listy)

---

## Porównanie usprawnień

| Aspekt | Oryginał | Zoptymalizowana |
|--------|----------|-----------------|
| Przejścia po danych | Wszystkie pary indeksów | Jedna pętla |
| Czas | O(n²) | O(n) |
| Struktury pomocnicze | Tylko lista wyniku | `set` na widziane i dodane duplikaty |
| Czytelność | Prosta logika, wolna | Krótsza pętla, szybsza |

---

## Alternatywa (Python) — `Counter`

Gdy liczy się tylko **które wartości się powtarzają**, bez zachowania kolejności pierwszego duplikatu:

```python
from collections import Counter

def find_duplicates_counter(list_of_items):
    return [item for item, count in Counter(list_of_items).items() if count > 1]
```

Kolejność wyniku zależy wtedy od wewnętrznej kolejności słownika/countera, nie od pierwszego powtórzenia na liście — do zadań z wymaganiem **tej samej kolejności co oryginał** lepsza jest wersja z `seen` + jedną pętlą powyżej.

---

## Podsumowanie

Kod oryginalny jest poprawny logicznie, ale nieefektywny przy większych listach. Zastąpienie par `(i, j)` jednym przejściem ze zbiorami `seen` i `dup_added` daje ten sam sens wyniku (unikalne duplikaty w kolejności pierwszego powtórzenia) przy znacznie lepszej skalowalności.
