Sonnet 4.6
dockerfile node

Przykładowy Dockerfile dla aplikacji Node.js (Express / API / zwykły backend):

Prosty (dev / nauka)
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
Uruchomienie:

docker build -t moja-app-node .
docker run -p 3000:3000 moja-app-node
Produkcyjny (multi-stage, mniejszy obraz)
# etap 1: build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
# etap 2: runtime
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
Dostosuj npm run build i ścieżkę dist/index.js do swojego projektu (np. server.js bez buildu TypeScript).

Ważne elementy
Instrukcja	Po co
FROM node:22-alpine
Lekki obraz z Node 22
COPY package*.json przed kodem
Lepszy cache warstw przy docker build
npm ci
Powtarzalna instalacja z package-lock.json
EXPOSE 3000
Dokumentacja portu (mapowanie: -p 3000:3000)
NODE_ENV=production
Mniej logów, optymalizacje npm
USER node
Kontener nie działa jako root (bezpieczniej)
.dockerignore (warto dodać)
node_modules
npm-debug.log
.git
.env
dist
Jeśli chcesz, mogę dopisać gotowy Dockerfile i .dockerignore do konkretnego folderu w repozytorium — podaj ścieżkę projektu i czy to Express, Nest, czy czysty node server.js

Napisz prosty Dockerfile dla aplikacji Node.js, który:

- używa Node 18 jako obrazu bazowego

- kopiuje pliki package.json i package-lock.json

- instaluje zależności

- kopiuje resztę plików aplikacji

- wystawia port 3000

- uruchamia aplikację poleceniem "npm start"

Oto prosty Dockerfile spełniający wszystkie wymagania:

FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
Krótko co robi każda linia:

FROM node:18 — obraz bazowy z Node.js 18
COPY package.json package-lock.json ./ — najpierw pliki zależności (lepszy cache przy kolejnych buildach)
RUN npm ci — instalacja zgodna z package-lock.json
COPY . . — reszta kodu aplikacji
EXPOSE 3000 — port aplikacji
CMD ["npm", "start"] — start przez npm start
Build i uruchomienie:

docker build -t node-app .
docker run -p 3000:3000 node-app
Jeśli nie masz package-lock.json, zamień RUN npm ci na RUN npm install albo wygeneruj lockfile lokalnie (npm install w projekcie).

wnioski:
Przy ogólnym pytaniu o Dockerfile dla Node odpowiedź była szersza (Node 22, wariant produkcyjny, dodatkowe wskazówki), a przy konkretnej liście wymagań — krótsza i dokładnie pod zadanie (Node 18, jawne package.json i package-lock.json, samo npm start). Im precyzyjniejszy prompt, tym mniej nadmiaru i mniejsze ryzyko rozjazdu wersji czy instrukcji między odpowiedziami. W obu przypadkach szkielet Dockerfile był ten sam; różniły się głównie wersja Node i zakres dodatkowych praktyk. Do zadań szkolnych warto od razu podać wersję runtime i oczekiwany poziom prostoty, żeby dostać gotowca bez zbędnych rozszerzeń.