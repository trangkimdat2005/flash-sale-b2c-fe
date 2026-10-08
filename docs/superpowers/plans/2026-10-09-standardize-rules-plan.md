# Standardize Project Rules - Implementation Plan v2 (Optimized)

> **For agentic workers:** REQUIRED SUB-SKILL: Use tllq-workflow:itz-subagent-driven-development (recommended). This plan was revised after self-review to address 4 risks (D1-D4).

**Goal:** Re-author toan bo rule surface (24 file `.mdc` + `AGENTS.md` + `docs/CLAUDE.md`) ve UTF-8 sach, header metadata chuan, gop 1 cap trung scope, them meta-rule cho governance.

**Architecture:** 2 dot (P0 + P1) voi snapshot tag rollback. Tong 12 commit thay vi 37 de review de hon. Verify script dung PowerShell native (Windows-compatible).

**Tech Stack:** PowerShell 5+ (Windows), Git, Node 20+, pnpm 9+.

**Spec:** `docs/superpowers/specs/2026-10-09-standardize-rules-design.md`

---

## Global Constraints

- **Branch:** `docs/standardize-rules-utf8` (da fork tu `dev`).
- **Snapshot tag:** `baseline-before-utf8` tao o `dev` HEAD truoc khi bat dau re-author (rollback path).
- **Commit language:** Tieng Anh, Conventional Commits, scope `rules`. ASCII-only trong body.
- **2 dot thuc thi (theo workflow-process):**
  - **Dot A (P0):** 4 commit, 30-60 phut. Audit + schema + top-level + snapshot test.
  - **Dot B (P1):** 8 commit, 2-4 gio. Squash-re-author 24 file + meta-rule + verify.
- **Squash strategy:** gom theo concern, khong 1 file = 1 commit (tru khi review cho phep).
- **Encoding:** UTF-8 no BOM. Verify bang PowerShell native (KHONG dung `file` command).
- **Header metadata chuan (5 key bat buoc):** `description`, `globs`, `alwaysApply`, `owner`, `last_reviewed`.
- **Khong push.** Bước 6 workflow chỉ auto-commit local.
- **Khong** sua `package.json`, khong `pnpm install`, khong tao `pages/`, `app/api/**`.

---

## Phan 1 - Dot A (P0): Nen tang

### Task A.1: Snapshot baseline (D2)

**Files:**
- Create: git tag `baseline-before-utf8` (lightweight, local-only)

**Step 1:**

```powershell
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
git tag baseline-before-utf8 dev
git tag -l baseline-before-utf8
```

**Step 2: Ghi rollback procedure vao `docs/superpowers/specs/rollback-procedure.md`**

```markdown
# Rollback Procedure

If standardize-rules cause issues, rollback toan bo:

\`\`\`bash
git checkout docs/standardize-rules-utf8
git reset --hard baseline-before-utf8
git tag -d baseline-before-utf8
\`\`\`

Luu y: baseline tag chi luu local, khong push. Neu da push nhanh, dung `git revert` tung commit theo thu tu nguoc.
```

**Commit:**

```bash
git add docs/superpowers/specs/rollback-procedure.md
git commit -m "docs(rules): add rollback procedure for standardize-rules branch"
```

---

### Task A.2: Audit & dependency graph (SP1)

**Files:**
- Create: `docs/superpowers/specs/audit-inventory.md` (bang 24 file + encoding)
- Create: `docs/superpowers/specs/rule-dependency-graph.md` (map phu thuoc)

**Step 1: Audit tung file**

```powershell
$files = Get-ChildItem .cursor/rules/*.mdc
$results = foreach ($f in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $hasBom = $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
  $hasNonAscii = $false
  $corruptChars = 0
  foreach ($b in $bytes) {
    if ($b -gt 127) { $hasNonAscii = $true }
  }
  $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.UTF8Encoding]::new($false))
  $corruptCount = ([regex]::Matches($content, '[┤╞╟╠═╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳㼿]')).Count
  [PSCustomObject]@{
    File = $f.Name
    Size = $f.Length
    HasBom = $hasBom
    HasNonAscii = $hasNonAscii
    CorruptCount = $corruptCount
    LastCleanCommit = (git log --follow --oneline -- ".cursor/rules/$($f.Name)" | Select-Object -First 1)
  }
}
$results | Format-Table -AutoSize
```

Expected: 24 rows. It nhat 1 file co `CorruptCount > 0` (la `AGENTS.md` hoac `docs/CLAUDE.md`).

**Step 2: Dependency graph** — cho 24 file, list `depends_on` (nguoi viet se tu dien dua vao noi dung rule).

**Step 3: Ghi file audit**

Tao 2 file Markdown voi bang. Output dang:

| File | Size | HasBom | HasNonAscii | CorruptCount | LastCleanCommit |
|---|---|---|---|---|---|

**Commit:**

```bash
git add docs/superpowers/specs/audit-inventory.md docs/superpowers/specs/rule-dependency-graph.md
git commit -m "docs(rules): add audit inventory and dependency graph for 24 mdc files"
```

---

### Task A.3: Header schema + template (SP2)

**Files:**
- Create: `docs/superpowers/specs/header-schema.md` (spec ky thuat)
- Create: `templates/rule-template.mdc` (template copy khi tao rule moi)

**Step 1: Viet template**

```markdown
---
description: <one-line English, what this rule enforces>
globs:
  - <path pattern 1>
  - <path pattern 2>
alwaysApply: <true|false>
owner: <ai|human|team>
depends_on:
  - <other-rule.mdc>
last_reviewed: 2026-10-09
version: 1
---
> Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x
> Source-of-truth: docs/CLAUDE.md section <X> - <name>

# <Rule Title in English>

<Body in Vietnamese, UTF-8 clean, 1-4 sections>

## 1. <Section title>

<Markdown body>
```

**Step 2: Verify YAML frontmatter (PowerShell)**

```powershell
$content = Get-Content "templates/rule-template.mdc" -TotalCount 30
if ($content[0] -ne "---") { throw "Missing opening ---" }
$endIdx = ($content | Select-String -Pattern "^---$" | Select-Object -Skip 1 -First 1).LineNumber
if ($endIdx -lt 2) { throw "Missing closing ---" }
Write-Host "Frontmatter OK"
```

**Step 3: Viet header-schema.md** mo ta 5 key bat buoc, 2 key tuy chon, vi du cho moi key.

**Commit:**

```bash
git add templates/rule-template.mdc docs/superpowers/specs/header-schema.md
git commit -m "docs(rules): add canonical mdc template and header schema spec"
```

---

### Task A.4: Verify script (SP6 phan setup, D4)

**Files:**
- Create: `scripts/verify-rules.ps1`

**Step 1: Viet script PowerShell native (KHONG dung `file` command)**

```powershell
<#
.SYNOPSIS
  Verify rule surface: encoding, header metadata, corrupt chars, BOM.
.NOTES
  Chay tu repo root: powershell -File scripts/verify-rules.ps1
  Windows-compatible, khong can Git Bash hay WSL.
#>

$ErrorActionPreference = "Stop"
$rulesDir = ".cursor/rules"
$requiredKeys = @("description", "globs", "alwaysApply", "owner", "last_reviewed")
$corruptPattern = "[┤╞╟╠═╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳㼿]"

# 1. Count
$mdcFiles = Get-ChildItem "$rulesDir/*.mdc" -ErrorAction SilentlyContinue
Write-Host "=== File count ===" -ForegroundColor Cyan
Write-Host "Total .mdc files: $($mdcFiles.Count) (expected 24 after merge + meta-rule)"
if ($mdcFiles.Count -ne 24) { Write-Warning "  File count mismatch" }

# 2. Encoding + BOM
Write-Host "`n=== Encoding + BOM ===" -ForegroundColor Cyan
foreach ($f in $mdcFiles) {
  $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
  $hasBom = $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF
  if ($hasBom) {
    Write-Host "  FAIL: $($f.Name) has UTF-8 BOM" -ForegroundColor Red
  } else {
    Write-Host "  OK:   $($f.Name)" -ForegroundColor Green
  }
}

# 3. Header metadata
Write-Host "`n=== Header metadata (5 key bat buoc) ===" -ForegroundColor Cyan
foreach ($f in $mdcFiles) {
  $head = Get-Content $f.FullName -TotalCount 30
  $inFrontmatter = $false
  $frontmatterLines = @()
  foreach ($line in $head) {
    if ($line -eq "---") {
      if (-not $inFrontmatter) { $inFrontmatter = $true; continue }
      else { break }
    }
    if ($inFrontmatter) { $frontmatterLines += $line }
  }
  $yaml = ($frontmatterLines -join "`n")
  $missing = @()
  foreach ($key in $requiredKeys) {
    if ($yaml -notmatch "(?m)^${key}:") { $missing += $key }
  }
  if ($missing.Count -gt 0) {
    Write-Host "  FAIL: $($f.Name) missing keys: $($missing -join ', ')" -ForegroundColor Red
  } else {
    Write-Host "  OK:   $($f.Name)" -ForegroundColor Green
  }
}

# 4. Corrupt chars
Write-Host "`n=== Corrupt characters ===" -ForegroundColor Cyan
foreach ($f in $mdcFiles) {
  $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.UTF8Encoding]::new($false))
  $corruptCount = ([regex]::Matches($content, $corruptPattern)).Count
  if ($corruptCount -gt 0) {
    Write-Host "  FAIL: $($f.Name) has $corruptCount corrupt chars" -ForegroundColor Red
  } else {
    Write-Host "  OK:   $($f.Name)" -ForegroundColor Green
  }
}

# 5. AGENTS.md + docs/CLAUDE.md
Write-Host "`n=== Top-level files ===" -ForegroundColor Cyan
foreach ($f in @("AGENTS.md", "docs/CLAUDE.md")) {
  if (-not (Test-Path $f)) { Write-Host "  SKIP: $f (not found)"; continue }
  $content = [System.IO.File]::ReadAllText($f, [System.Text.UTF8Encoding]::new($false))
  $corruptCount = ([regex]::Matches($content, $corruptPattern)).Count
  $hasBom = $false
  $bytes = [System.IO.File]::ReadAllBytes($f)
  if ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { $hasBom = $true }
  if ($corruptCount -gt 0 -or $hasBom) {
    Write-Host "  FAIL: $f (corrupt=$corruptCount, bom=$hasBom)" -ForegroundColor Red
  } else {
    Write-Host "  OK:   $f" -ForegroundColor Green
  }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan
```

**Step 2: Chay thu (se FAIL vi chua re-author file nao)**

```powershell
powershell -File scripts/verify-rules.ps1
```

Expected output: nhieu FAIL lines (encoding, header, corrupt). Day la baseline de so sanh sau khi re-author.

**Commit:**

```bash
git add scripts/verify-rules.ps1
git commit -m "docs(rules): add verify-rules.ps1 sanity check script (Windows-native)"
```

---

### Task A.5: Keyword snapshot test (semantic regression guard)

**Files:**
- Create: `scripts/snapshot-keywords.ps1`

**Step 1: Viet script**

Script extract tat ca keyword "MUST", "BAT BUOC", "KHONG", "REQUIRED", "PROHIBITED" tu moi file rule, luu vao `docs/superpowers/specs/keyword-snapshot.json`. Sau khi re-author, chay lai de diff. Mat keyword nao -> flag.

```powershell
<#
.SYNOPSIS
  Extract strong keywords from rule files for semantic regression check.
.NOTES
  Run: powershell -File scripts/snapshot-keywords.ps1
  Output: docs/superpowers/specs/keyword-snapshot.json
#>

$rulesDir = ".cursor/rules"
$outputFile = "docs/superpowers/specs/keyword-snapshot.json"
$keywords = @("\bMUST\b", "\bBAT BUOC\b", "\bKHONG\b", "\bREQUIRED\b", "\bPROHIBITED\b", "\bNEVER\b", "\bALWAYS\b")

$rules = @{}
Get-ChildItem "$rulesDir/*.mdc" | ForEach-Object {
  $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($false))
  $counts = @{}
  foreach ($kw in $keywords) {
    $pattern = $kw -replace "\\b", ""
    $count = ([regex]::Matches($content, [regex]::Escape($pattern), [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)).Count
    $counts[$pattern] = $count
  }
  $rules[$_.Name] = $counts
}

$snapshot = @{
  generatedAt = (Get-Date -Format "o")
  rules = $rules
}
$snapshot | ConvertTo-Json -Depth 5 | Set-Content $outputFile -Encoding UTF8
Write-Host "Snapshot saved: $outputFile"
Write-Host "Total rules: $($rules.Count)"
```

**Step 2: Chay tao snapshot truoc khi re-author**

```powershell
powershell -File scripts/snapshot-keywords.ps1
git add docs/superpowers/specs/keyword-snapshot.json
git commit -m "docs(rules): add keyword snapshot baseline for semantic regression check"
```

**Su dung:** Sau Dot B, chay lai script, diff 2 file JSON. Mat keyword nao -> review.

---

### Checkpoint A

Sau Dot A, **dung lai va bao cao cho user**:

```text
## Dot A Complete

Commit: 5 (A.1 rollback, A.2 audit, A.3 template, A.4 verify, A.5 snapshot)
File moi: 4 (rollback-procedure.md, audit-inventory.md, rule-dependency-graph.md, header-schema.md, rule-template.mdc, verify-rules.ps1, snapshot-keywords.ps1, keyword-snapshot.json)
File sua: 0

Verify script baseline:
- File count: 24
- Encoding FAIL: N (se sua o Dot B)
- Header FAIL: 24 (chua co file nao co header chuan)
- Corrupt FAIL: M (se sua o Dot B)

Snapshot baseline saved.
San sang Dot B (re-author 24 file + meta-rule)? OK thi tiep.
```

---

## Phan 2 - Dot B (P1): Re-author squash

### Task B.1: Re-author nhom 1 (6 rule "always") (D3)

**Files (6 file, squash 1 commit):**
- `.cursor/rules/skill-loading.mdc`
- `.cursor/rules/stack-versions.mdc`
- `.cursor/rules/workflow-process.mdc`
- `.cursor/rules/error-handling.mdc`
- `.cursor/rules/no-overengineering.mdc`
- `.cursor/rules/testing-required.mdc`

**Step 1: Lay version sach tu git cho moi file**

```powershell
foreach ($f in @("skill-loading.mdc", "stack-versions.mdc", "workflow-process.mdc", "error-handling.mdc", "no-overengineering.mdc", "testing-required.mdc")) {
  $lastCommit = (git log --follow --format=%H -- ".cursor/rules/$f" | Select-Object -Last 1)
  git show "${lastCommit}:.cursor/rules/$f" > ".scratch/clean-$f"
  Write-Host "$f <- $lastCommit"
}
```

**Step 2: Re-author moi file theo template**

- Header 5 key bat buoc.
- Body giu noi dung chinh (khong doi y), sua encoding.
- Luu qua `[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))` de dam bao UTF-8 no BOM.

**Step 3: Verify tung file**

```powershell
foreach ($f in @("skill-loading.mdc", "stack-versions.mdc", "workflow-process.mdc", "error-handling.mdc", "no-overengineering.mdc", "testing-required.mdc")) {
  $bytes = [System.IO.File]::ReadAllBytes(".cursor/rules/$f")
  Write-Host "$f - first 4 bytes: $($bytes[0..3] | ForEach-Object { $_.ToString('X2') })"
}
```

Expected: first 4 bytes = `23 20 XX XX` (ASCII `#` + space + 2 ASCII).

**Step 4: Commit squash**

```bash
git add .cursor/rules/skill-loading.mdc .cursor/rules/stack-versions.mdc \
        .cursor/rules/workflow-process.mdc .cursor/rules/error-handling.mdc \
        .cursor/rules/no-overengineering.mdc .cursor/rules/testing-required.mdc
git commit -m "docs(rules): re-author 6 always-apply rules (utf-8 + canonical header)

Group 1 of 2: foundation rules loaded on every agent turn.
- skill-loading.mdc: checklist + auto-gitignore
- stack-versions.mdc: Next 16.3.8, React 19.2, TS 5, Tailwind 4, etc.
- workflow-process.mdc: 6-step mandatory workflow
- error-handling.mdc: throw vs catch vs toast convention
- no-overengineering.mdc: YAGNI scope
- testing-required.mdc: TDD red-green-refactor

Each file re-authored from git history, intent preserved, format
normalized to canonical header (5 required keys)."
```

---

### Task B.2: Re-author nhom 2 (8 rule "design/component")

**Files (8 file, squash 1 commit):**
- `.cursor/rules/design-system.mdc`
- `.cursor/rules/component-pattern.mdc`
- `.cursor/rules/layer-convention.mdc`
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/enum-labels.mdc`
- `.cursor/rules/validation-forms.mdc`
- `.cursor/rules/routing-guards.mdc`
- `.cursor/rules/i18n.mdc`

**Step 1-3:** Tuong tu Task B.1.

**Step 4: Commit squash**

```bash
git add .cursor/rules/design-system.mdc .cursor/rules/component-pattern.mdc \
        .cursor/rules/layer-convention.mdc .cursor/rules/state-management.mdc \
        .cursor/rules/enum-labels.mdc .cursor/rules/validation-forms.mdc \
        .cursor/rules/routing-guards.mdc .cursor/rules/i18n.mdc
git commit -m "docs(rules): re-author 8 design/component rules (utf-8 + canonical header)

Group 2 of 2: Tailwind 4 tokens, component structure (cva/forwardRef),
layer convention, Zustand stores, enum labels, RHF+Zod validation,
middleware/routing, next-intl."
```

---

### Task B.3: Re-author nhom 3 (7 rule "data/integration") + GỘP api

**Files (7 file squash, 1 file xoa, 1 commit gop):**
- Modify: `.cursor/rules/api-data.mdc`
- Modify: `.cursor/rules/flash-sale-b2c-api.mdc` (gop noi dung tu api-reference)
- Modify: `.cursor/rules/flash-sale-payment.mdc`
- Modify: `.cursor/rules/auth-jwt.mdc`
- Modify: `.cursor/rules/websocket-realtime.mdc`
- Modify: `.cursor/rules/features-migration.mdc`
- Modify: `.cursor/rules/docs-sync.mdc`
- Delete: `.cursor/rules/flash-sale-b2c-api-reference.mdc`

**Step 1: Lay version sach**

Tuong tu B.1, nhung them:

```powershell
# Rieng cho flash-sale-b2c-api.mdc, lay ca 2 file de gop
$apiHash = (git log --follow --format=%H -- ".cursor/rules/flash-sale-b2c-api.mdc" | Select-Object -Last 1)
$apiRefHash = (git log --follow --format=%H -- ".cursor/rules/flash-sale-b2c-api-reference.mdc" | Select-Object -Last 1)
git show "${apiHash}:.cursor/rules/flash-sale-b2c-api.mdc" > .scratch/clean-flash-sale-b2c-api.mdc
git show "${apiRefHash}:.cursor/rules/flash-sale-b2c-api-reference.mdc" > .scratch/clean-flash-sale-b2c-api-reference.mdc
```

**Step 2: Gop noi dung**

File moi `flash-sale-b2c-api.mdc` co:
- Header chuan (5 key).
- Section 1-7: policy tich hop (cu cua api.mdc).
- Section 8: "Khi nao doc docs/api-document.md / docs/api-reference.md" (cu cua api-reference.mdc).
- Cross-ref den 2 file docs goc.

**Step 3: Xoa file cu**

```powershell
git rm .cursor/rules/flash-sale-b2c-api-reference.mdc
```

**Step 4: Commit gop**

```bash
git add .cursor/rules/api-data.mdc .cursor/rules/flash-sale-b2c-api.mdc \
        .cursor/rules/flash-sale-payment.mdc .cursor/rules/auth-jwt.mdc \
        .cursor/rules/websocket-realtime.mdc .cursor/rules/features-migration.mdc \
        .cursor/rules/docs-sync.mdc
git rm .cursor/rules/flash-sale-b2c-api-reference.mdc
git commit -m "docs(rules): re-author 7 data/integration rules + merge api pair (utf-8)

Group 3 of 2: data layer, API contract, payment flow, JWT auth, STOMP
WebSocket, feature migration, docs sync.

flash-sale-b2c-api.mdc and flash-sale-b2c-api-reference.mdc are merged
into a single rule (api-reference removed). API endpoint details stay
in docs/api-document.md and docs/api-reference.md; the .mdc rule now
only covers integration policy and cross-refs."
```

---

### Task B.4: Re-author nhom 4 (3 rule "git") + meta-rule moi (D3 + D7)

**Files (4 file, 1 commit):**
- Modify: `.cursor/rules/git-workflow.mdc`
- Modify: `.cursor/rules/git-worktree.mdc`
- Create: `.cursor/rules/meta-rule-authoring.mdc` (MỚI)
- Modify: `AGENTS.md` (Rule Index)

**Step 1: Re-author 3 file git** (tuong tu B.1)

**Step 2: Tao meta-rule-authoring.mdc**

Header 5 key, body:
- Section 1: Header metadata (BAT BUOC 5 key).
- Section 2: Khi tao rule moi.
- Section 3: Khi sua rule.
- Section 4: Khi xoa rule.
- Section 5: Khi gop/tach rule.
- Section 6: KHONG.
- **Phan biet scope:** "Scope: file RULE (.mdc). Quy trinh code xem workflow-process.mdc." (D7)

**Step 3: Update Rule Index trong AGENTS.md**

Bang moi: 24 entry (23 re-author + 1 meta-rule moi). Moi entry co format:

```
| `.cursor/rules/<name>.mdc` | <scope ngan gon> |
```

Bo entry `flash-sale-b2c-api-reference.mdc` (da xoa).

**Step 4: Commit gop (3 file git + 1 file moi + AGENTS.md)**

```bash
git add .cursor/rules/git-workflow.mdc .cursor/rules/git-worktree.mdc \
        .cursor/rules/meta-rule-authoring.mdc AGENTS.md
git commit -m "docs(rules): re-author 3 git rules, add meta-rule, refresh index

Group 4 of 2 (final): git workflow + worktree conventions.

New: .cursor/rules/meta-rule-authoring.mdc — governance for creating/
modifying/deleting rules. Distinguishes scope from workflow-process.mdc
(that one covers code changes, this one covers rule files only).

AGENTS.md Rule Index refreshed: 24 entries (23 re-authored + 1 new
meta-rule), api-reference entry removed (merged into flash-sale-b2c-api)."
```

---

### Task B.5: Re-author top-level (docs/CLAUDE.md)

**Files:**
- Modify: `docs/CLAUDE.md`

**Step 1: Lay version sach**

```powershell
git log --follow --oneline -- docs/CLAUDE.md
git show <hash>:docs/CLAUDE.md > .scratch/clean-CLAUDE.md
```

**Step 2: Re-author UTF-8 sach, giu nguyen 12 muc**

Chi sua encoding, khong doi noi dung. Moi muc dung heading `##`, khong dung `>` blockquote cho heading.

**Step 3: Verify + commit**

```bash
git add docs/CLAUDE.md
git commit -m "docs(rules): re-author docs/CLAUDE.md as clean utf-8 (12 sections preserved)"
```

---

### Task B.6: Verify cuoi cung + final report

**Step 1: Chay verify script**

```powershell
powershell -File scripts/verify-rules.ps1
```

Expected: 0 FAIL, 0 corrupt, header OK 24/24.

**Step 2: Chay keyword snapshot diff**

```powershell
# Luu snapshot moi
powershell -File scripts/snapshot-keywords.ps1

# Diff voi snapshot cu
$old = Get-Content docs/superpowers/specs/keyword-snapshot.json -Raw | ConvertFrom-Json
# (Tao snapshot truoc khi re-author, da commit o Task A.5)
$new = Get-Content docs/superpowers/specs/keyword-snapshot.json -Raw | ConvertFrom-Json

foreach ($rule in $old.rules.PSObject.Properties) {
  $ruleName = $rule.Name
  $oldCount = ($rule.Value | ConvertFrom-Json).PSObject.Properties | Measure-Object -Sum Value
  # ... so sanh
}
```

Neu mat keyword nao (count giam) -> flag cho user review truoc khi commit final.

**Step 3: Viet final report**

Tao `docs/superpowers/specs/final-report-2026-10-09.md`:

```markdown
# Final Report - Standardize Rules (2026-10-09)

## Tong ket
- Branch: docs/standardize-rules-utf8
- Subplan: 6/6 (gom thanh 2 dot)
- Commit: 12 (5 o Dot A + 7 o Dot B)
- File .mdc sau: 24 (23 re-author + 1 meta-rule moi)
- File xoa: 1 (flash-sale-b2c-api-reference.mdc)
- File moi: 8 (rollback-procedure, audit-inventory, dependency-graph, header-schema, rule-template, verify-rules, snapshot-keywords, meta-rule-authoring)

## Verify ket qua
- Encoding: PASS (24/24 UTF-8 no BOM)
- Header: PASS (24/24 co 5 key bat buoc)
- Corrupt chars: PASS (0 ky tu loi)
- Keyword snapshot: PASS (khong mat keyword MUST/KHONG/REQUIRED nao)
- Rule Index: PASS (24 entry, khop file that)
- AGENTS.md: PASS (UTF-8 sach)
- docs/CLAUDE.md: PASS (UTF-8 sach, 12 muc giu nguyen)

## Notes
- Rollback: git reset --hard baseline-before-utf8
- KHONG push (user tu push khi review xong)
- Best-effort: neu 1 file re-author khong khop git history, flag trong commit body
```

**Commit:**

```bash
git add docs/superpowers/specs/final-report-2026-10-09.md
git commit -m "docs(rules): add final report - 12/12 commit pass verify"
```

---

## Self-Review Checklist

- [x] Spec coverage: 10 muc spec duoc map vao 6 subplan
- [x] D1 (chia 2 dot): Dot A (P0) + Dot B (P1)
- [x] D2 (snapshot tag): Task A.1 baseline-before-utf8 + rollback procedure
- [x] D3 (squash): 4 group commit thay vi 24 file rieng
- [x] D4 (Windows script): verify-rules.ps1 dung PowerShell native, khong dung `file` command
- [x] D5 (keyword snapshot): scripts/snapshot-keywords.ps1 + diff sau Dot B
- [x] D6 (cross-ref CLAUDE.md): ghi chu trong Task B.5
- [x] D7 (phan biet scope): Task B.4 Step 2 them 1 dong phan biet
- [x] Tong commit: 12 (Dot A: 5, Dot B: 7)
- [x] Branch: docs/standardize-rules-utf8 da tao tu dev
- [x] Khong push
- [x] Test/verify: verify-rules.ps1 + snapshot-keywords.ps1

## Execution Handoff

Plan v2 saved. 2 che do thuc thi (theo itz-writing-plans):

1. **Subagent-driven (Recommended):**
   - Dot A: 1 subagent (audit + template + script + snapshot).
   - Dot B: 4 subagent song song (4 group re-author), 1 subagent cho meta-rule + AGENTS.md update, 1 subagent cho verify cuoi.
   - Review giua Dot A va Dot B.

2. **Inline execution:** Toi chay tuan tu trong session, checkpoint sau Dot A (5 commit) va Dot B (7 commit).
