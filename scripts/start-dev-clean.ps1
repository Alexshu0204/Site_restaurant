# This script is intended to be used as a "clean" start for development, ensuring that any existing node 
# processes related to the project are stopped and that the specified port is free before starting the 
# development server. It can be used in place of `npm run start:dev` when you want to ensure a clean slate.

param(
  [int]$Port = 3010
)

$projectPath = (Resolve-Path "$PSScriptRoot\..").Path

function Get-ProjectNodePids {
  Get-CimInstance Win32_Process -Filter "Name = 'node.exe'" |
    Where-Object {
      $_.CommandLine -and $_.CommandLine -like "*$projectPath*"
    } |
    Select-Object -ExpandProperty ProcessId -Unique
}

function Stop-Pids([int[]]$Pids, [string]$Reason) {
  if (-not $Pids) {
    return
  }

  foreach ($targetPid in $Pids | Sort-Object -Unique) {
    try {
      $proc = Get-Process -Id $targetPid -ErrorAction Stop
      Stop-Process -Id $targetPid -Force -ErrorAction Stop
      Write-Host ("Stopped PID {0} ({1}) [{2}]" -f $targetPid, $proc.ProcessName, $Reason)
    } catch {
      Write-Host ("Failed to stop PID {0} [{1}]: {2}" -f $targetPid, $Reason, $_.Exception.Message)
    }
  }
}

# Stop all node processes related to this project to avoid watcher/runtime respawn races.
$projectNodePids = Get-ProjectNodePids
Stop-Pids -Pids $projectNodePids -Reason 'project-node'

$listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

if ($listeners) {
  Stop-Pids -Pids $listeners -Reason "listen-port-$Port"
}

# Wait briefly until the port is actually free.
$maxChecks = 20
for ($i = 0; $i -lt $maxChecks; $i++) {
  $stillListening = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $stillListening) {
    Write-Host ("Port {0} is free" -f $Port)
    break
  }
  Start-Sleep -Milliseconds 250
}

$finalListener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($finalListener) {
  Write-Host ("Port {0} is still busy; aborting clean start." -f $Port)
  exit 1
}

npm run start:dev
