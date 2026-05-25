# Zadanie 14 — analiza logów Docker (`dockerd`)

## Logi

```
May 19 10:15:32 server dockerd[1234]: time="2025-05-19T10:15:32.123456789Z" level=info msg="Container 78a2b3c4 health status changed from starting to healthy"
May 19 10:16:45 server dockerd[1234]: time="2025-05-19T10:16:45.987654321Z" level=info msg="Container 78a2b3c4 failed to connect to 172.17.0.3:5432: connection refused"
May 19 10:16:47 server dockerd[1234]: time="2025-05-19T10:16:47.246813579Z" level=warning msg="Container 78a2b3c4 health status changed from healthy to unhealthy"
```

---

## Co się dzieje — chronologia

| Czas | Zdarzenie |
|------|-----------|
| **10:15:32** | Kontener `78a2b3c4` przechodzi health check ze stanu `starting` → `healthy`. Daemon Docker uznaje kontener za sprawny. |
| **10:16:45** | Ten sam kontener **nie może połączyć się** z adresem `172.17.0.3:5432` — odmowa połączenia (`connection refused`). Port **5432** to typowo **PostgreSQL**. |
| **10:16:47** | Po ~2 s status zdrowia spada z `healthy` → `unhealthy` (poziom `warning`). |

**W skrócie:** aplikacja w kontenerze `78a2b3c4` przez chwilę wyglądała na zdrową, potem health check (lub zależność) wykryła brak dostępu do bazy na `172.17.0.3:5432` i oznaczyła kontener jako niesprawny.

---

## Zidentyfikowane problemy

### 1. Brak połączenia z bazą danych (główny problem)

- `connection refused` na `172.17.0.3:5432` oznacza, że pod tym adresem **nic nie nasłuchuje** albo usługa Postgresa **nie działa / nie wystartowała**.
- Możliwe przyczyny:
  - kontener z PostgreSQL jest zatrzymany lub się wyłączył,
  - baza startuje wolniej niż aplikacja (`depends_on` nie czeka na gotowość DB),
  - zły host w konfiguracji (powinno być np. nazwa serwisu z Compose: `db`, a nie sztywny IP),
  - Postgres nasłuchuje tylko na `localhost` wewnątrz własnego kontenera,
  - firewall / błędna sieć Docker.

### 2. Fałszywie pozytywny stan `healthy` (10:15:32)

- Kontener był `healthy`, mimo że minutę później nie ma połączenia z DB.
- Health check prawdopodobnie sprawdza tylko **proces HTTP** lub „żyje kontener”, a **nie** dostępność PostgreSQL.
- **Problem projektowy:** health check nie odzwierciedla rzeczywistych zależności aplikacji.

### 3. Krótki czas między błędem a `unhealthy` (~2 s)

- System szybko reaguje na nieudany test — to poprawne zachowanie health checka.
- W produkcji orchestrator (Compose, Swarm, K8s) może zrestartować kontener lub odciąć ruch.

### 4. Użycie IP z sieci Docker (`172.17.0.3`)

- Adres z puli `172.17.0.0/16` to typowa sieć bridge; IP **może się zmienić** po restarcie kontenera.
- **Ryzyko:** twardo wpisane IP zamiast nazwy DNS serwisu (`db`, `postgres`) — kruche wdrożenie.

---

## Rekomendacje (DevOps)

1. **Sprawdzić kontener Postgresa:** `docker ps`, logi `docker logs <db-container>`, czy port 5432 jest otwarty w sieci Compose.
2. **Poprawić health check aplikacji** — np. endpoint `/health` weryfikujący połączenie z DB (ping SQL), nie tylko `200 OK` z serwera.
3. **Czekać na gotowość bazy:** `depends_on` z `condition: service_healthy` (Compose v2+) lub retry w aplikacji / init container.
4. **Konfiguracja po nazwie hosta:** `DATABASE_HOST=db` zamiast IP `172.17.0.3`.
5. **Monitorowanie:** alert na przejście `healthy` → `unhealthy` i na `connection refused` do portu 5432.

---

## Podsumowanie

Logi opisują **regresję stanu kontenera aplikacji** (`78a2b3c4`): najpierw uznany za zdrowy, potem nieudane połączenie z PostgreSQL pod `172.17.0.3:5432`, na końcu status **unhealthy**. Główna przyczyna to **niedostępna lub niewłaściwie skonfigurowana baza danych**; dodatkowo widać **słaby health check**, który wcześniej nie wykrył braku połączenia z DB.
