Wyjaśnienie pliku check_docker.sh — linia po linii, prosto i od podstaw.

Linia 1: #!/bin/bash
To tzw. shebang. Mówi systemowi: „uruchom ten plik programem bash”. Dzięki temu możesz odpalić skrypt jako ./check_docker.sh, a nie wpisywać ręcznie bash check_docker.sh.

Linia 2: (pusta)
Tylko odstęp — czytelniejszy kod, nic nie robi.

Linia 3: if systemctl is-active --quiet docker; then
Warunek: czy usługa o nazwie docker jest aktywna (działa).

systemctl — narzędzie do zarządzania usługami w Linuxie (start/stop/status).
is-active docker — pytanie: „czy usługa docker jest włączona?”.
--quiet — bez zbędnego tekstu; skrypt dostaje tylko kod sukcesu (0 = tak, działa; inny = nie działa).
if ...; then — jeśli usługa działa, wykonaj blok poniżej (linie 4–6).
Linia 4: echo "Usługa docker działa."
Wypisz na ekranie komunikat, że wszystko jest OK.

Linia 5: exit 0
Zakończ skrypt z kodem 0. W bashu 0 oznacza zwykle „sukces, bez błędu”. Dalej skrypt już nie idzie.

Linia 6: fi
Koniec bloku if z linii 3. Jeśli Docker nie działał, linie 4–5 są pomijane i wykonanie idzie dalej — do linii 8.

Linia 7: (pusta)
Znowu tylko odstęp.

Linia 8: echo "Usługa docker zatrzymana. Uruchamiam..."
Tu trafiasz tylko wtedy, gdy Docker nie był aktywny. Informujesz użytkownika, że skrypt próbuje go włączyć.

Linia 9: sudo systemctl start docker
Uruchom usługę docker.

systemctl start docker — polecenie startu.
sudo — uruchom jako administrator (root), bo zwykły użytkownik często nie może startować usług systemowych. System może poprosić o hasło.
Linia 10: (pusta)
Odstęp.

Linia 11: if systemctl is-active --quiet docker; then
Drugie sprawdzenie — czy po start usługa naprawdę działa. To ważne: start mógł się nie udać (błąd konfiguracji, brak uprawnień itd.).

Linia 12: echo "Usługa docker uruchomiona."
Jeśli po starcie usługa jest aktywna — komunikat sukcesu.

Linia 13: exit 0
Koniec skryptu — sukces (udało się włączyć Docker).

Linia 14: else
Gałąź „w przeciwnym razie”: start się nie udał albo usługa dalej nie jest aktywna.

Linia 15: echo "Nie udało się uruchomić usługi docker."
Komunikat o błędzie.

Linia 16: exit 1
Koniec z kodem 1 — w skryptach i automatyzacji to zwykle oznacza błąd (np. cron lub inny program wie, że coś poszło nie tak).

Linia 17: fi
Zamyka drugi blok if (od linii 11).

Jak to wygląda w całości (schemat)
Start
  │
  ├─ Docker działa? ──TAK──► komunikat OK → exit 0 (koniec)
  │
  NIE
  │
  ├─ próba: sudo systemctl start docker
  │
  ├─ Docker działa teraz? ──TAK──► komunikat OK → exit 0
  │
  NIE
  │
  └─ komunikat błędu → exit 1
Ważne dla początkujących: skrypt sprawdza usługę systemową docker (daemon), a nie pojedynczy kontener. Działa na Linuxie z systemd; na Windows z Docker Desktop ten mechanizm jest inny.