ERROR: for app  Cannot start service app: driver failed programming external connectivity on endpoint app (172.18.0.2): Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use

Co oznacza ten błąd
Docker próbuje uruchomić usługę app i zmapować port kontenera na komputer hosta:

0.0.0.0:3000  →  port 3000 w kontenerze
Komunikat bind: address already in use znaczy: port 3000 na Twoim komputerze jest już zajęty przez inny program lub kontener. Docker nie może „podpiąć” tego samego portu drugi raz, więc kontener app się nie startuje.

Fragment driver failed programming external connectivity to tylko opis techniczny — sedno problemu to konflikt portu 3000.

Najczęstsze przyczyny
Lokalnie działa npm start / inny dev server na porcie 3000
Inny kontener Docker już używa 3000:3000
Inna aplikacja (np. drugi projekt, czasem IDE z wbudowanym serwerem)
Jak to naprawić
1. Sprawdź, co zajmuje port 3000 (Windows, PowerShell)
netstat -ano | findstr :3000
Ostatnia kolumna to PID. Sprawdź proces:

tasklist /FI "PID eq <PID>"
Zatrzymaj go, jeśli to niepotrzebny proces:

Stop-Process -Id <PID> -Force
2. Sprawdź inne kontenery Docker
docker ps
Jeśli widzisz mapowanie 0.0.0.0:3000->3000/tcp, zatrzymaj ten kontener:

docker stop <nazwa_lub_id>
Albo zatrzymaj cały projekt:

docker compose down
Potem uruchom ponownie:

docker compose up -d
3. Zmień port na hoście (gdy 3000 musi zostać zajęty)
W docker-compose.yml w usłudze app:

ports:
  - "3001:3000"
3001 — port na Twoim PC (otwierasz http://localhost:3001)
3000 — port wewnątrz kontenera (bez zmian w aplikacji)
Podsumowanie
Element	Znaczenie
app
Nazwa usługi w Compose, która nie wystartowała
0.0.0.0:3000
Próba nasłuchu na porcie 3000 na całym hoście
address already in use
Port 3000 jest już używany
Rozwiązanie: zwolnij port 3000 (zatrzymaj proces/kontener) albo zmień mapowanie na inny port hosta, np. 3001:3000.