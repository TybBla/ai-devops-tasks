services:
  web:
    image: nginx
    ports:
      - "80:80"
  app:
    build: .
    ports
      - "3000:3000"
    depends_on:
      - db
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD=password

Błędy
1. Brak : przy ports w app
Masz:

    ports
      - "3000:3000"
Powinno być:

    ports:
      - "3000:3000"
Bez dwukropka YAML traktuje to jako niepoprawną strukturę i docker compose zgłosi błąd.

2. Zła składnia environment w db
Masz:

    environment:
      POSTGRES_PASSWORD=password
W Compose użyj dwukropka albo listy:

    environment:
      POSTGRES_PASSWORD: password
albo:

    environment:
      - POSTGRES_PASSWORD=password
Wariant POSTGRES_PASSWORD=password jako „klucz” bez : nie jest poprawnym formatem mapy w YAML.

3. Reszta — OK składniowo
web z nginx i 80:80 — poprawne
build: . — OK, jeśli w tym samym katalogu jest Dockerfile
depends_on: - db — poprawne (tylko czeka na start kontenera, nie na gotową bazę)

services:
  web:
    image: nginx
    ports:
      - "80:80"

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db

  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: password