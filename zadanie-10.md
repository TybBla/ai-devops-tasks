Dlaczego ważne jest ignorowanie tych plików?
node_modules/
Setki tysięcy plików — repo staje się ogromne i wolne.
Zależności odtworzysz z package.json / package-lock.json (npm ci).
Na innym OS mogą być problemy z natywnymi modułami skompilowanymi pod Twój system.
.env i sekrety
Hasła do MongoDB, klucze API, tokeny JWT — nie mogą trafić do Gita (GitHub, współpraca, wyciek).
Historia Gita zostaje na zawsze — nawet po usunięciu pliku sekret często da się odzyskać.
W repo trzymasz tylko .env.example (szablon bez prawdziwych wartości).
dist/, build/, cache
To wynik buildu, nie źródło — generujesz go przy npm run build lub w Dockerze.
Duplikacja w repo → konflikty merge i niejasne, która wersja jest „prawdziwa”.
Logi i coverage/
Pliki tymczasowe, zmienne przy każdym uruchomieniu.
Nie niosą wartości dla projektu, zaśmiecają diffy i historię commitów.
Dane MongoDB (data/, mongo-data/, dump/)
To lokalna baza — binaria, indeksy, często duże pliki.
Każdy developer ma swoje dane testowe; wrzucanie ich do Gita nie ma sensu.
Ryzyko przypadkowego commitu danych osobowych z deva.
W Dockerze dane i tak trzymasz w volume — odtwarzasz je lokalnie, nie z repozytorium.
docker-compose.override.yml
Osobiste ustawienia (porty, ścieżki, debug) — różne u każdego.
Wspólna konfiguracja jest w docker-compose.yml; override zostaje lokalnie.
Pliki IDE (.idea/, .vscode/)
Ustawienia edytora specyficzne dla jednej osoby — nie dotyczą aplikacji.