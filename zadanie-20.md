# Zadanie 20 — walidacja adresu IPv4 (regex)

## Pliki

| Plik | Opis |
|------|------|
| `ipv4-validator.js` | Funkcja `isValidIPv4()` |
| `zadanie-20.md` | Regex, wyjaśnienie, testy |

---

## Wyrażenie regularne

```regex
^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$
```

W JavaScript (jak w `ipv4-validator.js`):

```javascript
/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
```

---

## Jak działa to wyrażenie — krok po kroku

| Fragment | Znaczenie |
|----------|-----------|
| `^` … `$` | Cały łańcuch musi **w całości** pasować (bez dodatkowych znaków) |
| `(?: ... )` | Grupa nieprzechwytująca (bez zapamiętywania numeru) |
| `25[0-5]` | Oktet **250–255** |
| `2[0-4][0-9]` | Oktet **200–249** |
| `[01]?[0-9][0-9]?` | Oktet **0–199** (opcjonalne wiodące 0, np. `07`, `192`) |
| `\.` | Kropka jako separator oktetów (escapowana) |
| `{3}` | Powtórzenie „oktet + kropka” **trzy razy** (pierwsze trzy oktety) |
| Ostatni oktet | Ten sam wzorzec oktetu **bez** kropki na końcu |

**Logika:** adres to dokładnie **cztery** grupy licz 0–255 oddzielone kropkami.

---

## Funkcja w `ipv4-validator.js`

```javascript
const { isValidIPv4 } = require('./ipv4-validator');

isValidIPv4('192.168.1.1');  // true
isValidIPv4('256.0.0.1');    // false
```

---

## Przykłady testów

### Poprawne adresy (oczekiwane: `true`)

| Adres | Uwagi |
|-------|--------|
| `192.168.1.1` | Typowa sieć prywatna |
| `10.0.0.1` | Klasa A prywatna |
| `127.0.0.1` | Localhost |
| `0.0.0.0` | Minimum |
| `255.255.255.255` | Maksimum |
| `172.16.0.1` | Sieć prywatna |

### Niepoprawne adresy (oczekiwane: `false`)

| Adres | Powód odrzucenia |
|-------|------------------|
| `256.1.1.1` | Oktet > 255 |
| `192.168.1` | Tylko 3 oktety |
| `192.168.1.1.1` | 5 części |
| `192.168.1.999` | Oktet > 255 |
| `abc.def.ghi.jkl` | Nie liczby |
| `` (pusty) | Brak adresu |
| `192.168.1.1 ` | Spacja na końcu — `trim()` w funkcji to usuwa; sam regex z `$` bez trim by odrzucił |
| `300.2.2.2` | Pierwszy oktet > 255 |

### Uruchomienie testów w Node.js

```bash
node -e "
const { isValidIPv4 } = require('./ipv4-validator');
const ok = ['192.168.1.1','10.0.0.1','255.255.255.255','0.0.0.0'];
const bad = ['256.1.1.1','192.168.1','abc','300.2.2.2'];
ok.forEach(ip => console.log(ip, isValidIPv4(ip)));
bad.forEach(ip => console.log(ip, isValidIPv4(ip)));
"
```

Oczekiwany wynik: pierwsza grupa same `true`, druga same `false`.

---

## Ograniczenia regex IPv4

- Nie sprawdza, czy adres ma **znaczenie sieciowe** (np. multicast, rezerwacje).
- Dopuszcza wiodące zera w oktetach (`192.168.001.1` — często akceptowane przez regex, rzadziej w strict API).
- Adresy z **spacjami** w środku są odrzucane; na brzegach obsługuje `trim()` w funkcji.
- Do produkcji często używa się biblioteki (`net.isIP` w Node) obok lub zamiast regex.

---

## Podsumowanie

Wyrażenie wymusza format **czterech oktetów 0–255** oddzielonych kropkami. Funkcja `isValidIPv4` opakowuje regex w prosty interfejs do testów i walidacji w aplikacji.
