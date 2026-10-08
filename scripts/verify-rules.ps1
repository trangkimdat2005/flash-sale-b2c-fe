<#
.SYNOPSIS
  Verify .mdc rule files in .cursor/rules/ for encoding and header compliance.

.DESCRIPTION
  Checks each .mdc file (plus AGENTS.md and docs/CLAUDE.md) for:
   1. UTF-8 BOM (fail if present)
   2. 5 required frontmatter keys (description, globs, alwaysApply, owner, last_reviewed)
   3. Corrupt characters (regex match for known encoding-broken chars)

  Uses PowerShell native APIs ([System.IO.File]::ReadAllBytes) instead
  of bash `file` command which is not available on default Windows.

.PARAMETER RepoRoot
  Repository root to scan. Defaults to current directory.

.EXAMPLE
  powershell -File scripts/verify-rules.ps1
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = (Get-Location).Path
)

$ErrorActionPreference = 'Continue'

# --- Configuration ---
$RulesDir = Join-Path $RepoRoot '.cursor/rules'
$DocsToCheck = @(
  (Join-Path $RepoRoot 'AGENTS.md'),
  (Join-Path $RepoRoot 'docs/CLAUDE.md')
)

$RequiredKeys = @('description', 'globs', 'alwaysApply', 'owner', 'last_reviewed')

# Build corrupt-character regex via Unicode codepoints to avoid encoding-broken
# chars in this file (PowerShell here-strings mis-render them).
$CorruptCodepoints = @(0x2514, 0x2556, 0x2573, 0x2534, 0x252C, 0x251C, 0x2500, 0x2567, 0x25BC, 0x2592, 0x25A0, 0x25C7, 0x22A1, 0xFFFD, 0x003F)
$CorruptChars = -join ($CorruptCodepoints | ForEach-Object { [char]$_ })
$CorruptRegex = '[' + $CorruptChars + ']'

# --- Counters ---
$totalFiles = 0
$bomFails = 0
$headerFails = 0
$corruptFails = 0
$failedFiles = @()

# --- Helper functions ---
function Test-Bom {
  param([byte[]]$Bytes)
  if ($Bytes.Length -lt 3) { return $false }
  return ($Bytes[0] -eq 0xEF -and $Bytes[1] -eq 0xBB -and $Bytes[2] -eq 0xBF)
}

function Test-Corrupt {
  param([string]$Content)
  return ([regex]::Matches($Content, $CorruptRegex)).Count
}

function Test-Frontmatter {
  param([string]$Content)
  $result = [PSCustomObject]@{
    HasFrontmatter = $false
    MissingKeys = @()
    HasDescription = $false
    DescriptionLength = 0
  }

  if ($Content -notmatch '(?s)^---\r?\n(.*?)\r?\n---\r?\n') {
    $result.MissingKeys = $RequiredKeys
    return ,$result
  }
  $result.HasFrontmatter = $true
  $fm = $matches[1]

  foreach ($key in $RequiredKeys) {
    if ($fm -notmatch "(?m)^${key}\s*:") {
      $result.MissingKeys += $key
    }
  }

  if ($fm -match '(?m)^description\s*:\s*(.+)$') {
    $result.HasDescription = $true
    $result.DescriptionLength = $matches[1].Trim().Length
  }

  return ,$result
}

function Test-OneFile {
  param([string]$Path)
  $relPath = $Path.Replace($RepoRoot, '').TrimStart('\','/')
  $bytes = [System.IO.File]::ReadAllBytes($Path)
  $content = [System.IO.File]::ReadAllText($Path, [System.Text.UTF8Encoding]::new($false))

  $failures = @()

  if (Test-Bom -Bytes $bytes) {
    $failures += 'UTF-8 BOM detected'
  }

  $fmResult = Test-Frontmatter -Content $content
  if (-not $fmResult.HasFrontmatter) {
    $failures += 'No frontmatter block'
  } elseif ($fmResult.MissingKeys.Count -gt 0) {
    $failures += ('Missing keys: ' + ($fmResult.MissingKeys -join ', '))
  }
  if ($fmResult.HasDescription -and $fmResult.DescriptionLength -gt 100) {
    $failures += ('description too long (' + $fmResult.DescriptionLength + ' chars, max 100)')
  }

  $corruptCount = Test-Corrupt -Content $content
  if ($corruptCount -gt 0) {
    $failures += ('Corrupt characters: ' + $corruptCount)
  }

  return [PSCustomObject]@{
    File = $relPath
    BomFail = ($failures -match 'BOM')
    HeaderFail = ($failures -match 'frontmatter|Missing keys|description too long')
    CorruptFail = ($corruptCount -gt 0)
    CorruptCount = $corruptCount
    Failures = $failures
  }
}

# --- Scan .mdc files ---
Write-Host 'Scanning .cursor/rules/*.mdc ...' -ForegroundColor Cyan
$mdcFiles = Get-ChildItem -Path $RulesDir -Filter '*.mdc' -ErrorAction SilentlyContinue
if (-not $mdcFiles) {
  Write-Warning ('No .mdc files found in ' + $RulesDir)
} else {
  foreach ($f in $mdcFiles) {
    $result = Test-OneFile -Path $f.FullName
    $totalFiles++
    if ($result.BomFail) { $bomFails++ }
    if ($result.HeaderFail) { $headerFails++ }
    if ($result.CorruptFail) { $corruptFails++ }
    if ($result.Failures.Count -gt 0) {
      $failedFiles += $result
      Write-Host ('  [' + ($result.Failures -join '; ') + '] ' + $result.File) -ForegroundColor Yellow
    } else {
      Write-Host ('  [OK] ' + $result.File) -ForegroundColor Green
    }
  }
}

# --- Scan AGENTS.md and docs/CLAUDE.md ---
foreach ($docPath in $DocsToCheck) {
  if (Test-Path $docPath) {
    Write-Host ''
    Write-Host ('Scanning ' + $docPath + ' ...') -ForegroundColor Cyan
    $result = Test-OneFile -Path $docPath
    if ($result.Failures.Count -gt 0) {
      $failedFiles += $result
      Write-Host ('  [' + ($result.Failures -join '; ') + '] ' + $result.File) -ForegroundColor Yellow
    } else {
      Write-Host ('  [OK] ' + $result.File) -ForegroundColor Green
    }
  }
}

# --- Summary ---
Write-Host ''
Write-Host '=== SUMMARY ===' -ForegroundColor Cyan
Write-Host ('Total .mdc files scanned: ' + $totalFiles)
Write-Host ('UTF-8 BOM fails:           ' + $bomFails)
Write-Host ('Header fails:              ' + $headerFails)
Write-Host ('Corrupt char fails:        ' + $corruptFails)
Write-Host ('Total files with failures: ' + $failedFiles.Count)

if ($failedFiles.Count -gt 0) {
  Write-Host ''
  Write-Host '=== FAILED FILES ===' -ForegroundColor Red
  foreach ($f in $failedFiles) {
    Write-Host ('  ' + $f.File + ' :: ' + ($f.Failures -join ' | '))
  }
  exit 1
} else {
  Write-Host ''
  Write-Host 'All files PASS.' -ForegroundColor Green
  exit 0
}