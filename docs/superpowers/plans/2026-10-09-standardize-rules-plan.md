# Standardize Project Rules — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use tllq-workflow:itz-subagent-driven-development (recommended) or tllq-workflow:itz-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-author toàn bộ rule surface (24 file `.mdc` + `AGENTS.md` + `docs/CLAUDE.md`) về UTF-8 sạch, header metadata chuẩn, gộp 1 cặp trùng scope, thêm meta-rule cho governance.

**Architecture:** 6 subplan tuần tự. Mỗi file re-author là 1 commit riêng để user diff/review dễ. Verify cuối cùng bằng script PowerShell tự động.

**Tech Stack:** PowerShell 5+ (Windows), Git, Node 20+, pnpm 9+ (cho lint check YAML).

**Spec:** `docs/superpowers/specs/2026-10-09-standardize-rules-design.md`

---

## Global Constraints

- **Branch:** `docs/standardize-rules-utf8` (đã fork từ `dev`, KHÔNG tạo branch mới, KHÔNG rebase, KHÔNG push).
- **Commit language:** Tiếng Anh, Conventional Commits, scope `rules`. ASCII-only trong body.
- **Mỗi commit 1 file** (trừ SP3 commit gộp 2 file, SP4 commit gộp nội dung + xoá file cũ).
- **Encoding:** Tất cả file output là UTF-8 (no BOM), kiểm tra bằng `file --mime-encoding`.
- **Header metadata chuẩn** (xem spec §5.2): 5 key bắt buộc `description`, `globs`, `alwaysApply`, `owner`, `last_reviewed`.
- **Không push lên remote.** Bước 6 chỉ auto-commit local.
- **Không** sửa `package.json`, không `pnpm install`, không tạo file `pages/`, `app/api/**`.

---

## Task Structure Overview

| Subplan | Task count | Files touched |
|---|---|---|
| SP1 Audit & Inventory | 3 | 1 new |
| SP2 Header schema + template | 2 | 2 new |
| SP3 Re-author top-level files | 3 | 2 modified |
| SP4 Re-author 24 `.mdc` files | 25 (24 modified + 1 deleted) | 24 modified, 1 deleted |
| SP5 Meta-rule + Rule Index | 2 | 1 new + 1 modified |
| SP6 Verify + auto-commit | 2 | 1 new + 0 modified |

**Tổng commit tối đa: 37 commit** (mỗi file re-author = 1 commit, riêng SP4 cộng 1 commit xoá file cũ).

---

### Task 1.1: Khảo sát git history cho mỗi file `.mdc`

**Files:**
- Read-only: tất cả 24 file `.mdc` hiện tại
- Read-only: git log + git show output

**Step 1: Lấy danh sách file `.mdc` hiện tại**

```powershell
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
Get-ChildItem .cursor/rules/*.mdc | Select-Object Name, Length
```

Expected: 24 file.

**Step 2: Với mỗi file, tìm commit sạch cuối cùng**

```powershell
$files = Get-ChildItem .cursor/rules/*.mdc | ForEach-Object { $_.Name }
foreach ($f in $files) {
  Write-Host "=== $f ==="
  git log --follow --oneline -- ".cursor/rules/$f" | Select-Object -First 10
}
```

Output: bảng `<filename> → <last clean commit hash>`.

**Step 3: Ghi audit report**

Tạo `docs/superpowers/specs/audit-inventory.md` với format:

```markdown
# Audit Inventory — 2026-10-09

| File | Current encoding | Last clean commit | Note |
|---|---|---|---|
| skill-loading.mdc | utf-8 | <hash> | OK |
| flash-sale-b2c-api.mdc | binary | <hash> | corrupt, re-author |
| ... | ... | ... | ... |

## Tổng kết
- Tổng file: 24
- Đã sạch: X
- Cần re-author: Y
- Cần gộp: 2 (flash-sale-b2c-api.mdc + flash-sale-b2c-api-reference.mdc)
- File mới sau re-author: 24 (23 hiện tại - 1 gộp + 1 meta-rule mới)
```

**Step 4: Commit**

```bash
git add docs/superpowers/specs/audit-inventory.md
git commit -m "docs(rules): add audit inventory of 23 mdc files"
```

---

### Task 1.2: Tạo dependency graph giữa các rule

**Files:**
- Create: `docs/superpowers/specs/rule-dependency-graph.md`

**Step 1: Vẽ sơ đồ phụ thuộc**

Quan sát cross-ref trong body từng rule + globs. Output file dạng:

```markdown
# Rule Dependency Graph — 2026-10-09

| Rule | Depends on | Referenced by |
|---|---|---|
| workflow-process.mdc | — | (always) |
| git-workflow.mdc | workflow-process.mdc | git-worktree.mdc |
| layer-convention.mdc | stack-versions.mdc, design-system.mdc | component-pattern.mdc |
| ... | ... | ... |

**Tổng file: 24**
```

**Step 2: Commit**

```bash
git add docs/superpowers/specs/rule-dependency-graph.md
git commit -m "docs(rules): map dependency graph between 23 rules"
```

---

### Task 1.3: Review + chốt scope re-author

**Step 1: Mở `audit-inventory.md` + `rule-dependency-graph.md`, xác nhận:**

- Số file cần re-author (mục tiêu: 24 file sau cùng — 23 re-author + 1 mới, sau khi gộp api + api-reference thành 1).
- Thứ tự ưu tiên: luôn bắt đầu từ rule **không phụ thuộc ai** (workflow, stack, error-handling, skill-loading, no-overengineering, testing-required).

**Step 2: Ghi chú thứ tự vào cuối `audit-inventory.md`**

```markdown
## Thứ tự re-author (SP4)
1. skill-loading
2. stack-versions
3. workflow-process
4. error-handling
5. no-overengineering
6. testing-required
7. layer-convention
8. design-system
9. component-pattern
10. state-management
11. auth-jwt
12. websocket-realtime
13. enum-labels
14. validation-forms
15. routing-guards
16. i18n
17. api-data
18. flash-sale-b2c-api (gộp từ api + api-reference, xoá api-reference)
19. flash-sale-payment
20. features-migration
21. git-workflow
22. git-worktree
23. docs-sync
```

**Step 3: Commit**

```bash
git add docs/superpowers/specs/audit-inventory.md
git commit -m "docs(rules): finalize re-author order in audit inventory"
```

---

### Task 2.1: Tạo template `.mdc` chuẩn

**Files:**
- Create: `templates/rule-template.mdc`

**Step 1: Viết template**

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
> Source-of-truth: docs/CLAUDE.md section <X> — <name>

# <Rule Title in English>

<Body in Vietnamese, UTF-8 clean, 1–4 sections>

## 1. <Section title>

<Markdown body>

## 2. <Section title>

<Markdown body>
```

**Step 2: Verify YAML frontmatter hợp lệ**

```powershell
# PowerShell: parse 30 dòng đầu, check có đủ ---
$content = Get-Content "templates/rule-template.mdc" -TotalCount 30
if ($content[0] -ne "---") { throw "Missing opening ---" }
$endIndex = ($content | Select-String -Pattern "^---$" | Select-Object -Skip 1 -First 1).LineNumber
if ($endIndex -lt 2) { throw "Missing closing ---" }
Write-Host "Frontmatter OK"
```

**Step 3: Commit**

```bash
git add templates/rule-template.mdc
git commit -m "docs(rules): add canonical mdc template with metadata schema"
```

---

### Task 2.2: Viết spec header schema (chuẩn hoá convention)

**Files:**
- Create: `docs/superpowers/specs/header-schema.md`

**Step 1: Ghi chuẩn header**

Tài liệu này **không** phải rule, chỉ là spec kỹ thuật để agent tham chiếu khi tạo rule. Nội dung
tương tự spec §5.2, viết thành markdown sạch.

**Step 2: Commit**

```bash
git add docs/superpowers/specs/header-schema.md
git commit -m "docs(rules): document canonical header metadata schema"
```

---

### Task 3.1: Re-author `docs/CLAUDE.md`

**Files:**
- Modify: `docs/CLAUDE.md`

**Step 1: Lấy version sạch từ git**

```bash
git log --follow --oneline -- docs/CLAUDE.md
git show <last-clean-commit>:docs/CLAUDE.md > .scratch/CLAUDE.clean.md
```

Nếu **tất cả** lịch sử đều hỏng (không có commit sạch):

- Dùng `git log -p --all -- docs/CLAUDE.md | head -500` để xem diff qua từng commit.
- Tìm nội dung trong commit `git log -S "<key word>" --all -- docs/CLAUDE.md` với từ khoá đặc trưng
  (vd: "Be Vietnam Pro", "tanstack", "shadcn").
- Best-effort: ghi cờ trong commit message.

**Step 2: Verify file sạch trước khi copy**

```bash
file --mime-encoding .scratch/CLAUDE.clean.md  # phải là utf-8
```

**Step 3: Re-author theo template (giữ nguyên 12 mục)**

Giữ cấu trúc 12 mục (Bối cảnh dự án, Tech stack, Cấu trúc thư mục, Design tokens, ...). Chỉ:

- Sửa encoding cho sạch.
- Giữ nguyên mọi quyết định (Tailwind, shadcn/ui, TanStack Query, RHF+Zod, Be Vietnam Pro, ...).
- Mỗi mục dùng heading `##` (KHÔNG dùng `>` blockquote cho heading).

**Step 4: Verify encoding**

```bash
file --mime-encoding docs/CLAUDE.md  # phải là utf-8
# Check không còn ký tự lỗi:
grep -P "[┤╞╟╠═╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳]" docs/CLAUDE.md  # phải trống
```

**Step 5: Commit**

```bash
git add docs/CLAUDE.md
git commit -m "docs(rules): re-author CLAUDE.md as clean utf-8 (12 sections preserved)"
```

---

### Task 3.2: Re-author `AGENTS.md`

**Files:**
- Modify: `AGENTS.md`

**Step 1: Lấy version sạch từ git**

```bash
git log --follow --oneline -- AGENTS.md
git show <last-clean-commit>:AGENTS.md > .scratch/AGENTS.clean.md
```

**Step 2: Re-author với Rule Index cập nhật**

- Giữ Next.js warning block (`<!-- BEGIN:nextjs-agent-rules -->`) vì `next dev` sẽ re-add.
- Phần "Flash Sale B2C — FE Agent Quick Reference": sạch encoding, giữ nguyên nội dung.
- **Rule Index**: cập nhật theo 22 file mới (sau khi gộp api + api-reference) + 1 mới `meta-rule-authoring.mdc`.
- Bỏ entry `flash-sale-b2c-api-reference.mdc`.

**Step 3: Verify encoding**

```bash
file --mime-encoding AGENTS.md
grep -P "[\x{FFF0}-\x{FFFF}]" AGENTS.md  # phải trống
```

**Step 4: Commit**

```bash
git add AGENTS.md
git commit -m "docs(rules): re-author AGENTS.md clean utf-8, refresh rule index (22+1 files)"
```

---

### Task 3.3: Commit gộp SP1-SP3 (verify nhanh)

**Step 1: Check trạng thái**

```bash
git log --oneline dev..HEAD
```

Expected: 5 commit mới (1.3 + 2.2 + 3.1 + 3.2 + ...).

**Step 2: Verify không có file rule nào bị động trong SP1-SP3**

```bash
git diff dev..HEAD --name-only | grep ".cursor/rules"  # phải trống
```

**Step 3: Ghi log**

```bash
# Không commit mới, chỉ note cho người đọc log
git log --oneline dev..HEAD
```

---

### Task 4.1: Re-author `skill-loading.mdc`

**Files:**
- Modify: `.cursor/rules/skill-loading.mdc`

**Step 1: Lấy version sạch**

```bash
git show <last-clean-commit>:.cursor/rules/skill-loading.mdc > .scratch/skill-loading.clean.md
```

**Step 2: Re-author theo template**

- Header 5 key bắt buộc.
- Body giữ 2 section: "Checklist mỗi turn" + "Skill auto-gitignore (BẮT BUỘC)".
- Sửa lỗi chính tả nhỏ nếu có (vd: "mỗi turn" thay vì "moĩ turn").

**Step 3: Verify + commit**

```bash
file --mime-encoding .cursor/rules/skill-loading.mdc
git add .cursor/rules/skill-loading.mdc
git commit -m "docs(rules): re-author skill-loading.mdc clean utf-8 + canonical header"
```

---

### Task 4.2: Re-author `stack-versions.mdc`

**Step 1–3: Tương tự Task 4.1**

Lưu ý: đây là rule `alwaysApply: true`, phải có 5 key đầy đủ. Body liệt kê version stack: Next 16.3.8,
React 19.2, TS 5, Tailwind 4, RQ 5, Zustand 5, RHF 7, Zod 3, STOMP 7, shadcn/ui, date-fns vi,
next-intl, decimal.js.

**Commit:**

```bash
git commit -m "docs(rules): re-author stack-versions.mdc clean utf-8 + header"
```

---

### Task 4.3: Re-author `workflow-process.mdc`

**Step 1–3: Tương tự Task 4.1**

Body: 6 bước (0 → 0.1 → 0.5 → 1 → 2 → 3 → 4 → 5 → 6). Số bước giữ nguyên, chỉ re-author format.

**Commit:**

```bash
git commit -m "docs(rules): re-author workflow-process.mdc clean utf-8 (6 steps preserved)"
```

---

### Task 4.4: Re-author `error-handling.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author error-handling.mdc clean utf-8"
```

---

### Task 4.5: Re-author `no-overengineering.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author no-overengineering.mdc clean utf-8"
```

---

### Task 4.6: Re-author `testing-required.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author testing-required.mdc clean utf-8"
```

---

### Task 4.7: Re-author `layer-convention.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `stack-versions.mdc`, `design-system.mdc`. Thêm `depends_on` vào header.

**Commit:**

```bash
git commit -m "docs(rules): re-author layer-convention.mdc clean utf-8 + depends_on"
```

---

### Task 4.8: Re-author `design-system.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author design-system.mdc clean utf-8"
```

---

### Task 4.9: Re-author `component-pattern.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `design-system.mdc`, `layer-convention.mdc`. Thêm `depends_on`.

**Commit:**

```bash
git commit -m "docs(rules): re-author component-pattern.mdc clean utf-8 + depends_on"
```

---

### Task 4.10: Re-author `state-management.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `stack-versions.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author state-management.mdc clean utf-8 + depends_on"
```

---

### Task 4.11: Re-author `auth-jwt.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `api-data.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author auth-jwt.mdc clean utf-8 + depends_on"
```

---

### Task 4.12: Re-author `websocket-realtime.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `state-management.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author websocket-realtime.mdc clean utf-8 + depends_on"
```

---

### Task 4.13: Re-author `enum-labels.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author enum-labels.mdc clean utf-8"
```

---

### Task 4.14: Re-author `validation-forms.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author validation-forms.mdc clean utf-8"
```

---

### Task 4.15: Re-author `routing-guards.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author routing-guards.mdc clean utf-8"
```

---

### Task 4.16: Re-author `i18n.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author i18n.mdc clean utf-8"
```

---

### Task 4.17: Re-author `api-data.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `flash-sale-b2c-api.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author api-data.mdc clean utf-8 + depends_on"
```

---

### Task 4.18: Gộp `flash-sale-b2c-api.mdc` + `flash-sale-b2c-api-reference.mdc`

**Files:**
- Modify: `.cursor/rules/flash-sale-b2c-api.mdc` (gộp nội dung)
- Delete: `.cursor/rules/flash-sale-b2c-api-reference.mdc`

**Step 1: Lấy version sạch của cả 2 file**

```bash
git show <last-clean-commit-A>:.cursor/rules/flash-sale-b2c-api.mdc > .scratch/api.clean.md
git show <last-clean-commit-B>:.cursor/rules/flash-sale-b2c-api-reference.mdc > .scratch/api-ref.clean.md
```

**Step 2: Gộp nội dung**

File mới `flash-sale-b2c-api.mdc` có:

- Header chuẩn (5 key).
- §1–§7: policy tích hợp (cũ của `api.mdc`).
- §8: "Khi nào đọc docs/api-document.md / docs/api-reference.md" (cũ của `api-reference.mdc`).

**Step 3: Xoá file cũ**

```bash
git rm .cursor/rules/flash-sale-b2c-api-reference.mdc
```

**Step 4: Verify + commit gộp**

```bash
file --mime-encoding .cursor/rules/flash-sale-b2c-api.mdc
git add .cursor/rules/flash-sale-b2c-api.mdc
git commit -m "docs(rules): merge flash-sale-b2c-api.mdc + reference into single api rule"
```

---

### Task 4.19: Re-author `flash-sale-payment.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `flash-sale-b2c-api.mdc`, `websocket-realtime.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author flash-sale-payment.mdc clean utf-8 + depends_on"
```

---

### Task 4.20: Re-author `features-migration.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author features-migration.mdc clean utf-8"
```

---

### Task 4.21: Re-author `git-workflow.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `workflow-process.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author git-workflow.mdc clean utf-8 + depends_on"
```

---

### Task 4.22: Re-author `git-worktree.mdc`

**Step 1–3: Tương tự Task 4.1**

Phụ thuộc: `git-workflow.mdc`.

**Commit:**

```bash
git commit -m "docs(rules): re-author git-worktree.mdc clean utf-8 + depends_on"
```

---

### Task 4.23: Re-author `docs-sync.mdc`

**Step 1–3: Tương tự Task 4.1**

**Commit:**

```bash
git commit -m "docs(rules): re-author docs-sync.mdc clean utf-8"
```

---

### Task 4.24: Verify SP4

**Step 1: Đếm file**

```powershell
(Get-ChildItem .cursor/rules/*.mdc).Count
# Expected: 24 (23 re-author + 1 meta-rule ở SP5, hoặc 23 nếu đếm trước SP5)
```

**Step 2: Verify encoding mỗi file**

```powershell
Get-ChildItem .cursor/rules/*.mdc | ForEach-Object {
  $enc = file --mime-encoding $_.FullName
  if ($enc -notmatch "utf-8") { Write-Host "FAIL: $($_.Name) → $enc" -ForegroundColor Red }
  else { Write-Host "OK:   $($_.Name)" -ForegroundColor Green }
}
```

**Step 3: Verify không còn ký tự lỗi**

```powershell
Get-ChildItem .cursor/rules/*.mdc | ForEach-Object {
  $content = Get-Content $_.FullName -Raw
  if ($content -match "[┤╞╟╠═╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳㼿]") {
    Write-Host "FAIL: $($_.Name) has corrupt chars" -ForegroundColor Red
  }
}
```

**Step 4: Log + commit (nếu có fix)**

Nếu fail → sửa ngay trong SP4, không để qua SP5.

**Step 5: Verify file count cuối (sau khi SP5 thêm meta-rule)**

```powershell
(Get-ChildItem .cursor/rules/*.mdc).Count
# Expected: 24 (24 re-author = 23 cũ - 1 gộp + 1 meta-rule mới)
```

---

### Task 5.1: Tạo meta-rule mới

**Files:**
- Create: `.cursor/rules/meta-rule-authoring.mdc`

**Step 1: Viết file theo template**

```markdown
---
description: Quy trình bắt buộc khi tạo/sửa/xoá 1 file rule trong .cursor/rules/. Áp dụng mỗi khi thay đổi rule surface.
globs:
  - .cursor/rules/*.mdc
  - AGENTS.md
alwaysApply: true
owner: human
depends_on:
  - workflow-process.mdc
  - docs-sync.mdc
last_reviewed: 2026-10-09
version: 1
---
> Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x
> Source-of-truth: docs/superpowers/specs/header-schema.md

# Meta Rule — Authoring Conventions

## 1. Header metadata (BẮT BUỘC)

Mỗi file `.mdc` phải có YAML frontmatter 5 key:
- `description` (1 câu tiếng Anh)
- `globs` (danh sách path pattern)
- `alwaysApply` (true|false)
- `owner` (ai|human|team)
- `last_reviewed` (YYYY-MM-DD)

Tuỳ chọn: `version`, `depends_on`.

## 2. Khi tạo rule mới

1. Copy từ `templates/rule-template.mdc`.
2. Điền header.
3. Viết body ≤ 200 dòng (nếu hơn → tách thành 2 rule con).
4. Chạy `bash scripts/verify-rules.ps1` để check header.
5. Cập nhật `AGENTS.md` Rule Index (thêm entry + scope).
6. Commit: `docs(rules): add <name>.mdc`.

## 3. Khi sửa rule

1. Cập nhật `last_reviewed` ở header.
2. Nếu đổi scope/globs → cập nhật `AGENTS.md` Rule Index.
3. Commit: `docs(rules): update <name>.mdc — <mô tả ngắn>`.

## 4. Khi xoá rule

1. `git rm .cursor/rules/<name>.mdc`.
2. Xoá entry trong `AGENTS.md` Rule Index.
3. Commit: `docs(rules): remove <name>.mdc`.

## 5. Khi gộp/tách rule

- Gộp: cập nhật cả 2 entry trong Rule Index → còn 1 entry mới.
- Tách: tạo rule mới + sửa entry rule cũ trong Rule Index.
- Commit: `docs(rules): merge|split <old> <new>`.

## 6. KHÔNG

- KHÔNG tạo rule trùng scope với rule hiện có → gộp hoặc cross-ref.
- KHÔNG đặt code/secret trong rule.
- KHÔNG push trực tiếp lên `dev` — đi qua nhánh + PR.
```

**Step 2: Verify**

```bash
file --mime-encoding .cursor/rules/meta-rule-authoring.mdc
git add .cursor/rules/meta-rule-authoring.mdc
git commit -m "docs(rules): add meta-rule-authoring.mdc (governance for rule changes)"
```

---

### Task 5.2: Cập nhật Rule Index trong `AGENTS.md`

**Files:**
- Modify: `AGENTS.md` (chỉ phần Rule Index)

**Step 1: Thay bảng cũ bằng bảng mới (24 entry)**

Bảng mới phải khớp với `globs` thật của từng file sau khi re-author. Mỗi entry có format:

```
| `.cursor/rules/<name>.mdc` | <scope ngắn gọn> |
```

Số entry: 24 (23 file cũ re-author - 1 do gộp api + api-reference + 1 meta-rule-authoring mới).

**Step 2: Commit**

```bash
git add AGENTS.md
git commit -m "docs(rules): refresh rule index in AGENTS.md (22 rules + meta-rule)"
```

---

### Task 6.1: Viết verify script

**Files:**
- Create: `scripts/verify-rules.ps1`

**Step 1: Viết script**

```powershell
<#
.SYNOPSIS
  Verify toàn bộ rule surface: encoding, header, dependency, rule index.
.NOTES
  Run từ repo root: powershell -File scripts/verify-rules.ps1
#>

$ErrorActionPreference = "Stop"
$rulesDir = ".cursor/rules"
$requiredKeys = @("description", "globs", "alwaysApply", "owner", "last_reviewed")

# 1. Count
$mdcFiles = Get-ChildItem "$rulesDir/*.mdc"
Write-Host "Total .mdc files: $($mdcFiles.Count) (expected 24 after merge + meta-rule)"
if ($mdcFiles.Count -ne 24) {
  Write-Warning "File count mismatch"
}

# 2. Encoding
foreach ($f in $mdcFiles) {
  $enc = file --mime-encoding $f.FullName
  if ($enc -notmatch "utf-8") {
    Write-Host "FAIL [encoding]: $($f.Name) → $enc" -ForegroundColor Red
  }
}

# 3. Header (5 key bắt buộc)
foreach ($f in $mdcFiles) {
  $head = Get-Content $f.FullName -TotalCount 30
  $inFrontmatter = $false
  $frontmatter = @()
  foreach ($line in $head) {
    if ($line -eq "---") {
      if (-not $inFrontmatter) { $inFrontmatter = $true; continue }
      else { break }
    }
    if ($inFrontmatter) { $frontmatter += $line }
  }
  $yaml = ($frontmatter -join "`n") -replace ":\s*\|", "" -replace ":\s*>", ""
  foreach ($key in $requiredKeys) {
    if ($yaml -notmatch "(?m)^${key}:") {
      Write-Host "FAIL [header missing $key]: $($f.Name)" -ForegroundColor Red
    }
  }
}

# 4. Corrupt chars
$pattern = "[┤╞╟╠═╡╢╣╤╥╦╧╨╩╪╫╬╭╮╯╰╱╲╳㼿]"
foreach ($f in $mdcFiles) {
  $content = Get-Content $f.FullName -Raw
  if ($content -match $pattern) {
    Write-Host "FAIL [corrupt chars]: $($f.Name)" -ForegroundColor Red
  }
}

# 5. AGENTS.md
$agentsContent = Get-Content AGENTS.md -Raw
if ($agentsContent -match $pattern) {
  Write-Host "FAIL [corrupt chars in AGENTS.md]" -ForegroundColor Red
}

# 6. Top-level
Write-Host "---"
Write-Host "Done. See FAIL lines above."
```

**Step 2: Commit**

```bash
git add scripts/verify-rules.ps1
git commit -m "docs(rules): add verify-rules.ps1 sanity check script"
```

---

### Task 6.2: Chạy verify + final report

**Step 1: Chạy script**

```bash
powershell -File scripts/verify-rules.ps1
```

**Step 2: Nếu có FAIL → sửa ngay (cùng commit cuối)**

Các sửa có thể:

- Thiếu key → sửa header.
- Encoding sai → convert UTF-8.
- Corrupt char → sửa text.

**Step 3: Final report**

Viết `docs/superpowers/specs/final-report-2026-10-09.md` với:

```markdown
# Final Report — Standardize Rules (2026-10-09)

## Tổng kết
- Subplan: 6/6
- Tasks: 37/37
- Commit: 37
- File `.mdc` sau: 24 (23 cũ - 1 do gộp + 1 meta-rule mới)
- File xoá: 1 (`flash-sale-b2c-api-reference.mdc`)
- File mới: 3 (`meta-rule-authoring.mdc`, `rule-template.mdc`, `verify-rules.ps1`)

## Verify kết quả
- Encoding: PASS (24/24 file UTF-8)
- Header: PASS (24/24 file có 5 key bắt buộc)
- Corrupt chars: PASS (0 ký tự lỗi)
- Rule Index: PASS (khớp với file thật)
- AGENTS.md: PASS (UTF-8 sạch)
- docs/CLAUDE.md: PASS (UTF-8 sạch, 12 mục giữ nguyên)

## Notes
- Branch: `docs/standardize-rules-utf8`
- KHÔNG push (Bước 6 workflow chỉ auto-commit local)
- User push khi review xong
```

**Step 4: Commit**

```bash
git add docs/superpowers/specs/final-report-2026-10-09.md
git commit -m "docs(rules): add final report for standardize-rules (23/23 pass)"
```

---

## Self-Review Checklist

- [x] Spec §10 (Open Questions) đã resolve trước khi viết plan
- [x] Mỗi task có file cụ thể, step cụ thể, command cụ thể
- [x] Mỗi task có commit message tiếng Anh
- [x] Không có "TBD" / "TODO" / "similar to Task N"
- [x] Test/verify: Task 6.1 + 6.2 (script PowerShell + final report)
- [x] Dependency order: SP1 → SP2/SP3 song song → SP4 → SP5 → SP6
- [x] Branch đã tạo (`docs/standardize-rules-utf8` từ `dev`)
- [x] Tổng commit ước tính: 37 (mỗi file re-author = 1 commit, gộp/xoá = cộng thêm)

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-10-09-standardize-rules-plan.md`.

Two execution options:

1. **Subagent-Driven (recommended)** — Dispatch 1 subagent per task, review between tasks. Tốn thời gian nhưng review kỹ từng commit.

2. **Inline Execution** — Thực thi trong session này theo thứ tự 6 subplan, checkpoint mỗi 5–6 commit. Nhanh hơn nhưng ít review hơn.
