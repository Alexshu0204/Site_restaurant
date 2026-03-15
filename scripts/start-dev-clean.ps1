param(
  [int]$Port = 3010
)

$projectPath = (Resolve-Path "$PSScriptRoot\..").Path

# Stop stale Nest watch/runtime processes for this project to avoid port-race restarts.
$staleWatchers = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
  Where-Object {
    $_.CommandLine -and
    $_.CommandLine -like "*$projectPath*" -and
    (
      $_.CommandLine -like "*nest*start*" -or
      $_.CommandLine -like "*\\dist\\main*"
    )
  } |
  Select-Object -ExpandProperty ProcessId -Unique

if ($staleWatchers) {
  foreach ($staleId in $staleWatchers) {
    try {
      Stop-Process -Id $staleId -Force -ErrorAction Stop
      Write-Host ("Stopped stale watcher PID {0}" -f $staleId)
    } catch {
      Write-Host ("Failed to stop stale watcher PID {0}: {1}" -f $staleId, $_.Exception.Message)
    }
  }
}

$listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

if ($listeners) {
  foreach ($procId in $listeners) {
    try {
      $proc = Get-Process -Id $procId -ErrorAction Stop
      Stop-Process -Id $procId -Force -ErrorAction Stop
      Write-Host ("Stopped PID {0} ({1}) on port {2}" -f $procId, $proc.ProcessName, $Port)
    } catch {
      Write-Host ("Failed to stop PID {0}: {1}" -f $procId, $_.Exception.Message)
    }
  }
} else {
  Write-Host ("Port {0} is already free" -f $Port)
}

Start-Sleep -Milliseconds 500

npm run start:dev
