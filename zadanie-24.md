# Zadanie 24 — interpretacja metryk serwera API (24 h)

## Dane wydajnościowe (ostatnie 24 h)

| Metryka | Wartość |
|---------|---------|
| Średni czas odpowiedzi | 230 ms |
| 95. percentyl czasu odpowiedzi | 450 ms |
| 99. percentyl czasu odpowiedzi | 1200 ms |
| Liczba zapytań | 15 000 |
| Liczba błędów 5xx | 120 |
| Użycie CPU | średnio 45%, max 80% |
| Użycie pamięci | średnio 2,1 GB, max 3,5 GB (z 4 GB dostępnych) |

**Obliczenia pomocnicze:**

- Średni ruch: 15 000 / 86 400 s ≈ **0,17 req/s** (niska średnia; możliwe szczyty godzinowe)
- Współczynnik błędów 5xx: 120 / 15 000 = **0,8%**
- Szczyt pamięci: 3,5 / 4 GB = **87,5%** dostępnej RAM

---

## Interpretacja

### Czas odpowiedzi

| Metryka | Wartość | Ocena |
|---------|---------|--------|
| Średnia | 230 ms | Umiarkowanie — dla wielu API akceptowalne, dla interaktywnego UI czasem za wolno |
| p95 | 450 ms | Około 2× średnia — ogon latency zaczyna rosnąć |
| p99 | 1200 ms | Około 5× średnia — wyraźne problemy u części żądań |

Duży rozstrzał **średnia → p99** (230 ms vs 1200 ms) sugeruje, że większość requestów jest szybka, ale **ok. 1% jest bardzo wolnych** (wolne zapytania do bazy, locki, GC, brak cache, timeouty usług zewnętrznych).

### Ruch i błędy

- **15 000 zapytań** w 24 h to niskie średnie obciążenie, o ile nie występują krótkie szczyty (metryki nie pokazują RPS w peak).
- **120 błędów 5xx (0,8%)** — dla produkcji często celem jest **&lt; 0,1–0,5%**. Wartość **0,8% jest podwyższona**; 5xx często korelują z wysokim p99 (przeciążenie, błędy DB, brak pamięci).

### Zasoby serwera

| Zasób | Średnio | Max | Ocena |
|-------|---------|-----|--------|
| CPU | 45% | 80% | Zapas istnieje; szczyty 80% mogą pokrywać się z wolnymi requestami |
| RAM | 2,1 GB | 3,5 GB / 4 GB | **Max 87,5%** — blisko limitu; ryzyko OOM, presji na GC (Node.js), restartów kontenera |

---

## Potencjalne problemy

1. **Długi ogon latency (p99 = 1,2 s)** — najpoważniejszy sygnał dla UX i SLA.
2. **Error rate 5xx ~0,8%** — niestabilność (baza, pamięć, nieobsłużone wyjątki, wyczerpanie poolu połączeń).
3. **Pamięć blisko sufitu (3,5 / 4 GB)** — możliwy wyciek, zbyt duży cache, brak limitu heap, zbyt duży connection pool.
4. **CPU max 80%** przy niskim średnim RPS — możliwe **kosztowne pojedyncze operacje** (N+1 w DB, brak indeksów), niekoniecznie „za mało serwerów”.
5. **Brak podziału metryk** — bez danych per endpoint, 4xx, szczytów RPS trudniej wskazać jedną przyczynę.

---

## Rekomendacje — poprawa wydajności

### Priorytet 1: Diagnoza p99 i 5xx

- Metryki **per endpoint** (które ścieżki generują 1200 ms i 5xx).
- **Slow query log** bazy danych + korelacja z trace (OpenTelemetry, APM).
- Wykresy: histogram latency, error rate w czasie (wykrycie szczytów).

### Priorytet 2: Baza i logika aplikacji

- Indeksy pod filtry i sortowania używane w API.
- Eliminacja zapytań **N+1** (join, batch load).
- Sensowny **connection pool** (nie za duży przy 4 GB RAM).
- **Cache** (np. Redis) dla częstych, ciężkich odczytów.

### Priorytet 3: Pamięć

- Monitoring trendu RAM w 24 h (wyciek vs stabilny poziom).
- Limity pamięci kontenera / `--max-old-space-size` (Node).
- Alerty przy użyciu **&gt; 85%** RAM.

### Priorytet 4: API i infrastruktura

- Timeouty i controlled retry do zależności zewnętrznych.
- Paginacja i mniejsze payloady odpowiedzi.
- Skalowanie poziome dopiero po optymalizacji — przy ~0,17 req/s średnio problem wygląda na **jakość pojedynczego requestu**, nie na brak replik.

### Priorytet 5: SLA i alerty

- Alerty: **p99 &gt; 800 ms**, **5xx &gt; 0,5%**, **RAM &gt; 85%**.
- Cele po poprawkach: np. p95 &lt; 300 ms, 5xx &lt; 0,1% — porównanie w kolejnym oknie 24 h.

---

## Podsumowanie

Średni czas **230 ms** jest relatywnie dobry, ale **p99 1200 ms**, **0,8% błędów 5xx** i **RAM do 87,5% limitu** wskazują na problemy w **ogonie rozkładu czasu odpowiedzi i stabilności**, a nie na ogólne przeciążenie ruchem. Kolejność działań: zidentyfikować wolne endpointy i przyczyny 5xx → zoptymalizować DB i cache → ustabilizować zużycie pamięci → ustawić alerty i cele SLA.
