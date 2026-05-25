# Zadanie 16 — backup bazy: bash vs PowerShell

## Pliki w repozytorium

| Plik | Opis |
|------|------|
| `backup-db.sh` | Oryginalny skrypt bash (Linux) |
| `backup-db.ps1` | Równoważny skrypt PowerShell (Windows) |
| `zadanie-16.md` | Porównanie różnic |

---

## Główne różnice (na przykładzie backupu MySQL)

### 1. Składnia zmiennych

| Bash | PowerShell |
|------|------------|
| `DB_NAME="app_database"` | `$DB_NAME = "app_database"` |
| `"${BACKUP_DIR}/${DB_NAME}_..."` | `Join-Path $BACKUP_DIR "${DB_NAME}_..."` |

W PowerShell zmienne mają prefiks `$`, a ścieżki składa się wygodniej przez `Join-Path` (obsługa separatorów Windows).

### 2. Ścieżki i system plików

| Bash | PowerShell |
|------|------------|
| `/var/backups/db` | `C:\Backups\db` |

Bash zakłada hierarchię Unix; PowerShell — dyski i backslashe Windows (`C:\...`).

### 3. Data i czas

| Bash | PowerShell |
|------|------------|
| `$(date +%Y%m%d_%H%M%S)` | `Get-Date -Format "yyyyMMdd_HHmmss"` |

W bash wywołanie zewnętrznego polecenia `date`; w PowerShell wbudowane cmdlet/funkcja.

### 4. Sprawdzenie katalogu i tworzenie

| Bash | PowerShell |
|------|------------|
| `[ ! -d "$BACKUP_DIR" ]` | `-not (Test-Path ... -PathType Container)` |
| `mkdir -p "$BACKUP_DIR"` | `New-Item -ItemType Directory -Force` |

Bash używa testów w nawiasach kwadratowych; PowerShell — cmdletów (`Test-Path`, `New-Item`).

### 5. Backup i kompresja

| Bash | PowerShell |
|------|------------|
| `mysqldump ... \| gzip > "$FILENAME"` | `mysqldump` → plik tymczasowy → **GZipStream** → `.sql.gz` |

Bash łączy procesy **potokiem** (`|`) w jednym kroku. W PowerShell potok binarny do `gzip` bywa niewygodny bez dodatkowych narzędzi, więc użyto API .NET (`GZipStream`) albo pliku pośredniego — efekt ten sam (`.sql.gz`), implementacja inna.

Wywołanie zewnętrznego programu: bash `mysqldump ...`; PowerShell `& mysqldump ...` (operator call).

### 6. Komunikaty i błędy

| Bash | PowerShell |
|------|------------|
| `echo "..."` | `Write-Host "..."` |
| `[ $? -eq 0 ]` | `$LASTEXITCODE -ne 0` |

Bash sprawdza kod wyjścia ostatniego polecenia w `$?`; PowerShell — `$LASTEXITCODE` po programach zewnętrznych.

### 7. Shebang i uruchomienie

| Bash | PowerShell |
|------|------------|
| `#!/bin/bash` | brak shebang (opcjonalny) |
| `chmod +x ./backup-db.sh` | `.\backup-db.ps1` (polityka wykonywania) |

Skrypt bash wymaga interpretera bash; PowerShell uruchamia się w `powershell.exe` / `pwsh.exe`, czasem z ograniczeniami `ExecutionPolicy`.

### 8. Obsługa wyjątków

Bash w tym przykładzie nie ma `try/finally`. PowerShell używa `try/finally`, aby usunąć plik tymczasowy `.sql` nawet przy błędzie kompresji.

---

## Podsumowanie

Oba skrypty robią to samo: tworzą katalog backupu, robią zrzut MySQL, kompresują do `.sql.gz` i raportują sukces lub błąd. Różnią się **składnią**, **ścieżkami**, **sposobem łączenia mysqldump z kompresją** oraz **sprawdzaniem błędów**. Bash jest zwięzły dzięki potokom Unix; PowerShell opiera się na cmdletach i obiektach .NET, co na Windows daje lepszą integrację z systemem bez zewnętrznego `gzip`.

---

## Uruchomienie

**Linux (bash):**
```bash
chmod +x backup-db.sh
./backup-db.sh
```

**Windows (PowerShell):**
```powershell
.\backup-db.ps1
```

W obu przypadkach w PATH musi być `mysqldump` (klient MySQL).
