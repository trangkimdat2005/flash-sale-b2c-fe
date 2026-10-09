# scripts/audit-workflow.ps1
# PowerShell shim for audit-workflow.mjs
# Usage: .\scripts\audit-workflow.ps1 [--pre-commit]

$ErrorActionPreference = 'Stop'
& node "$PSScriptRoot\audit-workflow.mjs" @args
exit $LASTEXITCODE
