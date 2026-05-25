Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Jak ograniczyć zużycie pamięci przez kontener Docker
1. Znajdź źródło problemu
Sprawdź, który kontener zużywa RAM:

docker stats
docker top <nazwa-kontenera>
W aplikacji (np. Node/Java) użyj profilera lub metryk heap/GC — często winna jest sama aplikacja, a nie Docker.

2. Ustaw limit pamięci
W docker run:

docker run -m 512m --memory-swap 512m ...
W Compose:

services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
Kontener nie „zjedze” całej pamięci hosta; przy przekroczeniu limitu może zostać zatrzymany (OOM).

3. Zoptymalizuj obraz i proces

Mniejszy obraz bazowy (alpine, slim) — mniej warstw i narzędzi w kontenerze.
Multi-stage build — do runtime nie trafiają dev-dependencies ani build tools.
NODE_OPTIONS=--max-old-space-size=256 (Node) lub odpowiednie limity JVM — limit heap w aplikacji.
Wyłącz nieużywane usługi w jednym kontenerze (antywzorzec: jeden proces = jedna rola).
4. Popraw konfigurację aplikacji

Wycieki pamięci (cache bez limitu, niezamykane połączenia).
Zbyt duży pool połączeń do bazy, duże bufory, ładowanie całych plików do RAM.
Dla Node: mniej workerów; dla Java: -Xmx zgodne z limitem kontenera.
5. Docker i host

Usuń nieużywane obrazy/kontenery: docker system prune (ostrożnie w produkcji).
Sprawdź, czy nie masz setek zatrzymanych kontenerów zajmujących metadane.
Na Windows/Mac upewnij się, że Docker Desktop ma sensowny limit RAM w ustawieniach.
6. Rozdziel obciążenie
Ciężkie usługi (baza, Redis, worker kolejki) w osobnych kontenerach z własnymi limitami — łatwiej diagnozować i skalować niż jeden „wszystko w jednym” kontener.

Krótko: najpierw zmierz (docker stats + metryki aplikacji), potem ustaw limity (-m / deploy.resources.limits), zmniejsz obraz i heap aplikacji, napraw wycieki i rozdziel usługi. Sam Docker rzadko „pożera” RAM — zwykle robi to proces wewnątrz kontenera bez limitów.


Jesteś doświadczonym DevOps Engineerem z 10-letnim doświadczeniem. Jak rozwiązać problem z dużym zużyciem pamięci przez kontener Docker?

Podejście DevOps: wysokie zużycie RAM przez kontener
Najpierw rozróżnij symptom (wysoki MEM USAGE w docker stats) od przyczyny (aplikacja, runtime, kernel, konfiguracja limitów). Docker tylko izoluje proces — pamięć zużywa głównie proces wewnątrz kontenera.

1. Diagnoza (zawsze od tego zaczynaj)
docker stats --no-stream
docker inspect <container> --format '{{.HostConfig.Memory}} {{.HostConfig.MemorySwap}}'
docker top <container> -eo pid,comm,%mem,rss,vsz
W kontenerze / na hoście:

Node: heap (NODE_OPTIONS=--max-old-space-size), event loop lag, liczba workerów
Java: -Xmx vs limit kontenera (klasyczny błąd: JVM zakłada cały host)
Go: zwykle stabilne RSS, szukaj goroutines / cache
Bazy / Redis: maxmemory, connection pool, buffer pool
Jeśli RSS rośnie w czasie → wyciek lub nieograniczony cache. Jeśli od razu wysoki → zły limit heap / za duży pool / zły obraz.

2. Ogranicz kontener (cgroups) — nie tylko „optymalizuj kod”
Docker run / Compose:

deploy:
  resources:
    limits:
      memory: 768M
    reservations:
      memory: 256M
docker run -m 768m --memory-swap 768m ...
--memory-swap równe --memory → brak swapu w kontenerze (często lepsze dla przewidywalności).
Bez limitu jeden kontener może wywołać OOM na hoście i ubić inne usługi.
W Kubernetes: resources.limits.memory + sensowne requests — scheduler i HPA mają na czym pracować.

Efekt: kontener dostaje twardy sufit; przy przekroczeniu — OOM kill kontenera (lepiej niż pad całego node’a).

3. Dopasuj aplikację do limitu kontenera
Reguła: limit heap / runtime ≈ 70–80% limitu pamięci kontenera (reszta na libc, wątki, bufory sieciowe).

Stack	Typowa poprawka
Node
--max-old-space-size, mniej instancji PM2/cluster
JVM
-XX:MaxRAMPercentage=75.0 lub -Xmx pod limit cgroup
Python
workers gunicorn, limity cache
Redis
maxmemory + maxmemory-policy
Kontener ma np. 512 MiB → nie ustawiaj -Xmx2g.

4. Obraz i architektura
Multi-stage, npm ci --omit=dev, brak debuggerów w produkcji.
Jeden główny proces na kontener (PID 1 = aplikacja, nie bash).
Rozdziel app / DB / worker / cache — osobne limity, łatwiejszy docker stats.
Unikaj „fat image” z Javą + Node + cron w jednym — trudne do tuningu.
5. Produkcja: monitoring i alerty
Metryki: container_memory_working_set_bytes, RSS, OOM events, restart count.
Alert przy >85% limitu przez N minut.
Po OOM: dmesg / journalctl + docker inspect → OOMKilled: true.
Bez metryk będziesz tylko podnosić limit — to nie jest rozwiązanie, tylko ukrywanie problemu.

6. Typowe pułapki (10 lat = to samo w kółko)
Brak limitów — „działa na laptopie 32 GB”.
JVM/Node domyślne ustawienia poza cgroup.
Sidecar + app w jednym limicie — niedoszacowanie.
Logi na stdout bez rotacji — dysk, czasem też bufory.
Zbyt wiele replik na małym hoście bez requests/limits.
Prune na produkcji w panice zamiast naprawy leaku.
7. Kolejność działań (checklist)
docker stats + który kontener / proces
Metryki aplikacji (heap, GC, connections)
Ustaw limit pamięci + dopasuj runtime
Zmniejsz obraz / rozdziel usługi
Profiluj wyciek lub cache
Monitoruj OOM i restarty po wdrożeniu
W jednym zdaniu: zmierz RSS i limit cgroup, ustaw twardy limit pamięci kontenera, dopasuj heap/runtime do tego limitu, a jeśli pamięć dalej rośnie — szukaj wycieku lub złej architektury, nie kolejnych GB RAM na hoście.

wnioski:
Przy zwykłym pytaniu o pamięć w Dockerze odpowiedź była praktyczna i przejrzysta (statystyki, limity -m/Compose, lżejszy obraz, ustawienia aplikacji, prune), ale bez głębszego kontekstu produkcyjnego. Po doprecyzowaniu roli „DevOps z 10 latami” ta sama treść poszła w stronę diagnozy krok po kroku, cgroupów i OOM, dopasowania JVM/Node do limitu kontenera, Kubernetesa, monitoringu oraz typowych pułapek z produkcji. Pierwsza wersja jest bardziej „poradnikowa dla zespołu dev”, druga — bardziej operacyjna i pod wdrożenia. Szczegółowość w obu jest podobna co do liczby punktów, ale druga odpowiedź jest wyraźnie bardziej specjalistyczna językiem i perspektywą (limity, metryki, checklist), bo prompt wymusił ton inżyniera infra, a nie ogólnego wprowadzenia.