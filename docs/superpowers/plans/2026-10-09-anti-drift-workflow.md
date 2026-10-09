# 2026-10-09 — Anti-Drift Workflow (Checklist + Auto Audit)

## Bối cảnh

Trong session 2026-10-09, agent (tôi) đã **2 lần vi phạm chính rule mình viết** trong task "harden workflow Step 0":

1. **Skip 9-step git workflow** — tạo nhánh từ HEAD cũ thay vì `origin/dev` (sửa sau 4 lệnh).
2. **Gọi `AskQuestion` không có gì thật sự để hỏi** (offer `none of the above` khi đã chốt scope).

User phản ánh: **"tôi có cảm giác sau này khi làm sẽ bị lệch khỏi rule"** — đúng, vì **rule chỉ hiệu quả khi agent tự kỷ luật**, mà agent thì:
- Bị áp lực thời gian → rationalize "task này dễ quá không cần test"
- Bị task "rõ ràng" → bỏ qua Bước 4 (Hỏi user)
- Bị working tree dirty → bỏ qua 9-step workflow

→ Cần **cơ chế bảo vệ thực tế** thay vì chỉ rule dạng văn bản.

## Root cause

| # | Lỗi | Cách rule hiện tại giải quyết | Vấn đề |
|---|---|---|---|
| 1 | Quên merge dev trước khi tạo nhánh | `git-workflow.mdc` Bước 1-3 | Rule nói, agent quên do `git checkout dev` fail ngầm |
| 2 | Skip AskQuestion khi đã chốt | `workflow-process.mdc` Bước 0 | Không có cơ chế bắt buộc |
| 3 | Bỏ qua 7 mục pre-commit checklist | `git-workflow.mdc` Pre-commit | Agent tự đánh giá, dễ miss |
| 4 | Working tree dirty khi commit | `git-workflow.mdc` Bước 6-7 | Không bắt buộc clean |
| 5 | Commit message thiếu Test: section | `git-workflow.mdc` Bước 8 (commit body) | Không verify |
| 6 | Commit không có test kèm (logic) | `testing-required.mdc` TDD gate | Không verify auto |

## Quyết định đã chốt với user (Bước 0)

User chọn: **A (rule .mdc) + B (script audit + unit test)**.

| Hạng mục | Quyết định |
|---|---|
| A: Checklist mỗi response | `rule_only` — chỉ thêm rule .mdc, không message header |
| B: Script audit | `script_tests` — Node + PowerShell wrapper, có unit test |
| Ngôn ngữ script | `node_powershell` — Node core (cross-platform) + PowerShell shim |
| Cách gọi | `precommit_hook` — `.husky/pre-commit` (nếu có husky) hoặc hook thủ công |

## Scope thay đổi

### 1. Rule mới: `.cursor/rules/anti-drift-workflow.mdc`

**Mục đích**: bắt buộc agent mỗi response PHẢI thực hiện + tự báo cáo 7 mục checklist.

**Nội dung chính**:

```markdown
# Anti-Drift Workflow (Mandatory Checklist)

Mỗi response từ agent, PHẢI có 7 mục checklist ở đầu response.
Tick ✅ = đã làm, tick ❌ = chưa làm (không được code).

- [ ] Bước 0.0: 5 check parallel work (git log, plan same day, worktree, 24h chat, stash)
- [ ] Bước 0.1: Nhánh từ origin/dev (git fetch + checkout -b dev)
- [ ] Bước 1: Plan có scope + tham khảo + subplan + test
- [ ] Bước 2: Subplan độc lập, mỗi subagent 1 subplan
- [ ] Bước 3: Model phù hợp (mặc định inherit)
- [ ] Bước 4: Hỏi user (file/loại/rủi ro/ước lượng)
- [ ] Bước 5: TDD (test đỏ trước → sửa → xanh)
- [ ] Bước 5.0: Audit file (logic vs copy) trước khi sửa
- [ ] Bước 6: Auto-commit + báo cáo (KHÔNG push)

## Rationale

Agent đã 2 lần vi phạm rule trong session 2026-10-09 (skip 9-step, gọi AskQuestion vô lý).
Rule văn bản không đủ — cần CHECKLIST ĐẦU RESPONSE để agent tự audit.
```

### 2. Script: `scripts/audit-workflow.mjs`

**Mục đích**: chạy tự động trước `git commit`, fail nếu vi phạm pre-commit checklist.

**7 check** (theo `git-workflow.mdc` Pre-commit checklist):

| # | Check | Implementation |
|---|---|---|
| 1 | Working tree sạch (chỉ file trong scope) | `git status --porcelain` so với list file trong commit |
| 2 | Commit có test kèm (nếu sửa logic) | `git diff --name-only HEAD` × grep `.test.ts(x)?$` |
| 3 | Commit message có `Test:` section | `git log -1 --format=%b` match `/Test:/i` |
| 4 | Không commit `.env`, `*.local`, `node_modules/`, `dist/` | `git diff --name-only HEAD` × blocklist |
| 5 | Branch base = origin/dev | `git merge-base HEAD origin/dev` ≡ `git rev-parse origin/dev` |
| 6 | ESLint pass (nếu có code TS) | shell `npm run lint --silent` |
| 7 | TSC pass (nếu có code TS) | shell `npx tsc --noEmit` |

**Skip conditions** (để không quá strict):

- Commit message body chứa `[skip-audit]` → skip toàn bộ
- File thay đổi chỉ là `.md`, `.mdc`, `.json` (config) → skip check #2, #6, #7
- Branch là `hotfix/*` hoặc `main` → skip check #5

**Output format** (giống ESLint):

```
[audit-workflow] ✅ 1. Working tree clean (3 files in scope)
[audit-workflow] ✅ 2. Test file present (added: src/lib/decimal.test.ts)
[audit-workflow] ❌ 3. Commit message missing "Test:" section
[audit-workflow]     Hint: add body like "Test: src/lib/decimal.test.ts (added)"
[audit-workflow] ❌ 4. BLOCKED: .env found in diff
[audit-workflow] ❌ AUDIT FAILED (2/7 failed)
```

### 3. Wrapper: `scripts/audit-workflow.ps1`

**Mục đích**: PowerShell shim cho Windows (vì Cursor IDE trên Windows + husky hook thường dùng `.husky/pre-commit` cross-platform nhưng cần fallback cho PowerShell user).

```powershell
# scripts/audit-workflow.ps1
& node scripts/audit-workflow.mjs @args
exit $LASTEXITCODE
```

### 4. Hook: `.husky/pre-commit` (nếu chưa có husky → tạo `git/hooks/pre-commit` manual)

```bash
#!/usr/bin/env sh
node scripts/audit-workflow.mjs --pre-commit
```

### 5. Unit test: `scripts/audit-workflow.test.mjs`

**Tool**: Node built-in `node:test` (Node 20+) — không cần thêm dep.

**Test cases** (≥ 10 case):

| # | Test | Expected |
|---|---|---|
| 1 | Working tree clean | pass |
| 2 | Working tree có file ngoài scope | fail #1 |
| 3 | Sửa logic không có test | fail #2 |
| 4 | Sửa rule .mdc (không logic) | pass #2 (skip) |
| 5 | Commit body có "Test:" | pass #3 |
| 6 | Commit body không có "Test:" | fail #3 |
| 7 | Diff có `.env` | fail #4 (block) |
| 8 | Diff có `*.local` | fail #4 (block) |
| 9 | Branch base ≠ origin/dev | fail #5 |
| 10 | Commit message có `[skip-audit]` | skip all |
| 11 | ESLint fail | fail #6 |
| 12 | TSC fail | fail #7 |
| 13 | hotfix/* branch | skip #5 |

### 6. Cập nhật `package.json`

```json
{
  "scripts": {
    "audit:workflow": "node scripts/audit-workflow.mjs",
    "test:audit": "node --test scripts/audit-workflow.test.mjs"
  }
}
```

### 7. Cập nhật `AGENTS.md` (Rule Index)

Thêm row mới:

```markdown
| `.cursor/rules/anti-drift-workflow.mdc` | `docs/**`, `AGENTS.md` — bắt buộc checklist 6 bước mỗi response |
```

## Subplan (Bước 2)

| # | Subplan | Model | Output | Deps |
|---|---|---|---|---|
| 1 | Tạo `anti-drift-workflow.mdc` | `general-purpose` | 1 file rule (~80 dòng) | — |
| 2 | Tạo `audit-workflow.mjs` core | `general-purpose` | 1 file script (~200 dòng) | — |
| 3 | Tạo `audit-workflow.test.mjs` | `general-purpose` | 1 file test (~150 dòng) | Subplan 2 |
| 4 | Tạo `.husky/pre-commit` + `package.json` updates | `general-purpose` | 2 file config | Subplan 2 |
| 5 | Update `AGENTS.md` index | `general-purpose` | 1 file edit (1 row) | Subplan 1 |

## Test strategy

- **Trước commit**: chạy `npm run audit:workflow` trên chính commit này → phải pass
- **Trước commit**: chạy `npm run test:audit` → tất cả unit test pass
- **Trước commit**: chạy `npm run lint` + `npm run tsc --noEmit` → pass
- **Manual smoke**: tạo 1 commit giả vi phạm → hook phải block; tạo 1 commit sạch → hook pass

## Out of scope

- Thay đổi `workflow-process.mdc` hoặc `git-workflow.mdc` (chưa cần)
- Thay đổi `docs/CLAUDE.md` (read-only)
- Thêm CI step (chỉ local pre-commit)
- Auto-rebase origin/dev (chỉ check, không tự fix)
- Auto-format (đã có Prettier/ESLint)

## Files sẽ thay đổi

```
.cursor/rules/anti-drift-workflow.mdc            (NEW, ~80 dòng)
scripts/audit-workflow.mjs                        (NEW, ~200 dòng)
scripts/audit-workflow.test.mjs                   (NEW, ~150 dòng)
scripts/audit-workflow.ps1                        (NEW, ~10 dòng, shim)
.gitignore                                        (MODIFY, thêm scripts/_fixtures/)
package.json                                      (MODIFY, thêm 2 script)
AGENTS.md                                         (MODIFY, thêm 1 row)
docs/superpowers/plans/2026-10-09-anti-drift-workflow.md  (NEW, plan này)
```

## Risk

| Risk | Mitigation |
|---|---|
| Agent ignore checklist (vẫn drift) | Checklist là 1 phần response — user sẽ thấy ❌ ngay |
| Script quá strict → false positive | Skip conditions rõ ràng (chỉ .md/.mdc, [skip-audit]) |
| Pre-commit hook cản flow dev | Có thể bypass bằng `git commit --no-verify` (đã có sẵn) |
| Thêm dep mới | Dùng Node built-in `node:test` — KHÔNG thêm dep |

## Commit strategy

- 1 subplan = 1 commit (nếu có nhiều concern → tách)
- Commit 1: `docs(rules): add anti-drift-workflow.mdc checklist rule`
- Commit 2: `feat(scripts): add audit-workflow.mjs with 7-check pre-commit gate`
- Commit 3: `test(scripts): add unit tests for audit-workflow (13 cases)`
- Commit 4: `chore(hooks): wire pre-commit hook + add audit npm scripts`
- Commit 5: `docs(agents): add anti-drift-workflow rule to index`

## Pre-commit checklist cho task này (áp dụng chính nó)

- [ ] Audit file: 4 file mới là LOGIC (rule/script/test) + 1 file shim (copy) + 1 file config (copy) + 1 file docs (copy)
- [ ] Mỗi file LOGIC có `.test.mjs` kèm
- [ ] `npm run test:audit` PASS
- [ ] `npm run audit:workflow` PASS trên chính commit này
- [ ] `npm run lint` PASS
- [ ] `npm run tsc --noEmit` PASS
- [ ] Commit message body có `Test: scripts/audit-workflow.test.mjs (added)`

## Notes

- Tôi đã vi phạm rule 2 lần trong session này → đây là lý do tôi cần task này
- Không thay đổi `docs/CLAUDE.md` (read-only)
- Sau task này, mỗi response sẽ mở đầu bằng 7-item checklist
- Script KHÔNG push, KHÔNG rebase — chỉ check
