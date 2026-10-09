<#
.SYNOPSIS
  Extract strong keywords from rule files for semantic regression check.

.DESCRIPTION
  For each .mdc file in .cursor/rules/, count occurrences of strong directive
  keywords (MUST, BAT BUOC, KHONG, REQUIRED, PROHIBITED, NEVER, ALWAYS).
  Saves result as JSON (docs/superpowers/specs/keyword-snapshot.json) so
  that Dot B verification step can re-run and diff against baseline.

  Any keyword whose count drops signals a rule where semantic content
  was lost during re-author and needs review.

.PARAMETER RepoRoot
  Repository root. Defaults to current directory.

.EXAMPLE
  powershell -File scripts/snapshot-keywords.ps1
#>
[CmdletBinding()]
param(
  [string]$RepoRoot = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$RulesDir = Join-Path $RepoRoot '.cursor/rules'
$OutputFile = Join-Path $RepoRoot 'docs/superpowers/specs/keyword-snapshot.json'

$Keywords = @('MUST', 'BAT BUOC', 'KHONG', 'REQUIRED', 'PROHIBITED', 'NEVER', 'ALWAYS')

$Rules = @{}

$mdcFiles = Get-ChildItem -Path $RulesDir -Filter '*.mdc' -ErrorAction SilentlyContinue
if (-not $mdcFiles) {
  Write-Warning ('No .mdc files found in ' + $RulesDir)
  exit 1
}

foreach ($f in $mdcFiles) {
  $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.UTF8Encoding]::new($false))
  $counts = [ordered]@{}
  foreach ($kw in $Keywords) {
    $count = ([regex]::Matches($content, [regex]::Escape($kw), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
    $counts[$kw] = $count
  }
  $Rules[$f.Name] = $counts
}

$Snapshot = [ordered]@{
  generatedAt = (Get-Date -Format 'o')
  baseline = 'pre-Dot-B-re-author'
  rules = $Rules
}

$Json = $Snapshot | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($OutputFile, $Json, [System.Text.UTF8Encoding]::new($false))

Write-Host ('Snapshot saved: ' + $OutputFile)
Write-Host ('Total rules: ' + $Rules.Count)