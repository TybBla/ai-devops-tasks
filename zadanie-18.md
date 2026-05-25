# Zadanie 18 — bezpieczeństwo aplikacji Docker w produkcji

## 5 kluczowych praktyk bezpieczeństwa

### 1. Uruchamianie kontenerów jako użytkownik nieuprzywilejowany (non-root)

Proces w kontenerze nie powinien działać jako `root`. W przypadku przejęcia kontenera atakujący ma mniejsze szanse eskalacji na hosta.

### 2. Minimalne i zaufane obrazy bazowe (pinowanie wersji)

Używaj lekkich obrazów (`alpine`, `slim`, `distroless`) z konkretnym tagiem (`node:18-alpine`), nie `latest`. Mniejsza powierzchnia ataku i przewidywalne buildy.

### 3. Zarządzanie sekretami poza obrazem i repozytorium

Hasła, tokeny i klucze — przez Docker Secrets, Vault, zmienne z CI/CD lub menedżer sekretów. **Nigdy** na stałe w `Dockerfile` ani w commitowanym `.env`.

### 4. Segmentacja sieci i minimalna ekspozycja portów

Baza danych i wewnętrzne usługi tylko w sieci wewnętrznej Compose/Kubernetes. Na zewnątrz tylko reverse proxy / API. Nie publikuj portu DB (`5432`, `27017`) na hosta bez potrzeby.

### 5. Ograniczenia zasobów, capabilities i skanowanie obrazów

Limity CPU/RAM w Compose/K8s, `no-new-privileges`, wyłączenie trybu `privileged`, regularne skanowanie (`docker scout`, Trivy) i aktualizacje baz.

---

## Implementacja praktyki 1: non-root w `Dockerfile` i `docker-compose.yml`

Poniżej przykład dla aplikacji Node.js (można dostosować do własnego projektu).

### `Dockerfile`

```dockerfile
FROM node:18-alpine

# Utworzenie użytkownika systemowego bez powłoki logowania
RUN addgroup -g 1001 appgroup && \
    adduser -u 1001 -G appgroup -s /bin/sh -D appuser

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --chown=appuser:appgroup . .

# Katalog na dane/cache z prawami tylko dla appuser
RUN mkdir -p /app/tmp && chown -R appuser:appgroup /app

USER appuser

EXPOSE 3000

CMD ["node", "server.js"]
```

**Co robi ta implementacja:**

| Element | Cel |
|---------|-----|
| `adduser` / `addgroup` | Dedykowany użytkownik `appuser` (UID 1001) |
| `COPY --chown=appuser:appgroup` | Pliki aplikacji nie należą do root |
| `chown` na `/app` | Uprawnienia do zapisu tylko tam, gdzie potrzeba |
| `USER appuser` | Proces startuje **nie** jako root |

> Na obrazach Debian/Ubuntu zamiast `adduser -D` używa się np. `useradd -r -u 1001 appuser`.

---

### `docker-compose.yml`

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    # Wymuszenie non-root (muszą zgadzać się z USER w Dockerfile)
    user: "1001:1001"
    read_only: true
    tmpfs:
      - /tmp
      - /app/tmp
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    networks:
      - internal
    # Bez ports: — baza niedostępna z hosta (praktyka 4)

networks:
  internal:
    driver: bridge

secrets:
  db_password:
    file: ./secrets/db_password.txt
```

**Uwagi do Compose:**

| Ustawienie | Znaczenie |
|------------|-----------|
| `user: "1001:1001"` | Ten sam UID/GID co `appuser` w Dockerfile — nawet jeśli obraz by się zmienił, runtime nie startuje jako root |
| `read_only: true` + `tmpfs` | System plików tylko do odczytu; zapis tylko w `/tmp` (praktyka uzupełniająca) |
| `no-new-privileges:true` | Blokada podniesienia uprawnień |
| `cap_drop: ALL` | Usunięcie zbędnych capability Linux |

`cap_add: NET_BIND_SERVICE` — tylko jeśli aplikacja **musi** bindować port < 1024 wewnątrz kontenera; dla portu 3000 zwykle **nie jest potrzebne** i można pominąć `cap_add`.

Uproszczona wersja Compose (sam non-root):

```yaml
services:
  app:
    build: .
    user: "1001:1001"
    ports:
      - "3000:3000"
```

---

## Weryfikacja (po `docker compose up`)

```bash
docker compose exec app id
# uid=1001(appuser) gid=1001(appgroup) ...
```

Jeśli widzisz `uid=0(root)` — praktyka 1 **nie** jest wdrożona poprawnie.

---

## Podsumowanie

| # | Praktyka | Krótko |
|---|----------|--------|
| 1 | Non-root | `USER` w Dockerfile + `user:` w Compose |
| 2 | Minimalne obrazy | `alpine`, pinowane tagi |
| 3 | Sekrety | secrets / vault, nie w Git |
| 4 | Sieć | wewnętrzna sieć dla DB |
| 5 | Hardening | limity, `cap_drop`, skanowanie |

W tym zadaniu szczegółowo zaimplementowano **praktykę 1**; pozostałe warto wdrażać stopniowo w tym samym stacku.
