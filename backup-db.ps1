# Prosty skrypt do backupu bazy danych (Windows / PowerShell)

$DB_NAME = "app_database"
$BACKUP_DIR = "C:\Backups\db"
$DATE = Get-Date -Format "yyyyMMdd_HHmmss"
$FILENAME = Join-Path $BACKUP_DIR "${DB_NAME}_${DATE}.sql.gz"

# Sprawdź, czy katalog istnieje
if (-not (Test-Path -Path $BACKUP_DIR -PathType Container)) {
    New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
    Write-Host "Utworzono katalog $BACKUP_DIR"
}

# Wykonaj backup
Write-Host "Rozpoczynam backup bazy $DB_NAME..."

$sqlTemp = Join-Path $env:TEMP "${DB_NAME}_${DATE}.sql"

# mysqldump musi być w PATH (klient MySQL); -p poprosi o hasło
& mysqldump -u root -p $DB_NAME --result-file=$sqlTemp

if ($LASTEXITCODE -ne 0) {
    Write-Host "Błąd podczas wykonywania backupu!"
    if (Test-Path $sqlTemp) { Remove-Item $sqlTemp -Force }
    exit 1
}

# Kompresja do .sql.gz (odpowiednik: mysqldump | gzip)
try {
    $inputStream = [System.IO.File]::OpenRead($sqlTemp)
    $outputStream = [System.IO.File]::Create($FILENAME)
    $gzipStream = New-Object System.IO.Compression.GZipStream(
        $outputStream,
        [System.IO.Compression.CompressionMode]::Compress
    )
    $inputStream.CopyTo($gzipStream)
    $gzipStream.Close()
    $outputStream.Close()
    $inputStream.Close()
}
finally {
    if (Test-Path $sqlTemp) { Remove-Item $sqlTemp -Force }
}

Write-Host "Backup zakończony sukcesem: $FILENAME"
exit 0
