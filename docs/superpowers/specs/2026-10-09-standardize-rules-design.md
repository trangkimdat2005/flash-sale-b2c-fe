# Standardize Project Rules — Design Spec

> **For agentic workers:** This spec describes the **what** and **why**. The bite-sized tasks live in
> `docs/superpowers/plans/2026-10-09-standardize-rules-plan.md`.

**Date:** 2026-10-09
**Author:** Cursor Assistant
**Status:** Approved (architectural, level = high)
**Branch:** `docs/standardize-rules-utf8` (forked from `dev`)
**Source-of-truth (UI):** `docs/CLAUDE.md` (mục 1–12) — read-only reference

---

## 1. Context

Project `flash-sale-b2c-fe` dùng Cursor Rules (`.cursor/rules/*.mdc` + `AGENTS.md` + `docs/CLAUDE.md`)
làm **single source of truth** cho mọi AI agent (Cursor, Claude Code, Copilot, v0) khi viết code giao
diện. Quy tắc đã tăng lên 23 file `.mdc` + 2 file top-level qua nhiều lần merge nhưng **chưa từng
được chuẩn hoá** về:

1. **Encoding** — nhiều file bị corrupt UTF-8 (ký tự Việt hiển thị thành `㼿㼿㼿`, `┤ó┤Ç┤ü`, `═Æ`, `☒`).
2. **Metadata header** — một số có `description`/`globs`/`alwaysApply`, một số không.
3. **Phạm vi trùng lặp** — `flash-sale-b2c-api.mdc` và `flash-sale-b2c-api-reference.mdc` đều nói
   về API contract.
4. **Governance** — không có meta-rule nào quy định quy trình thêm/sửa rule trong tương lai.
5. **Rule Index** trong `AGENTS.md` đã lệch so với metadata thật của từng file.

Hệ quả: AI agents đọc các file này ra **noise thay vì chỉ dẫn**, dẫn đến output không nhất quán
giữa các session.

## 2. Goal

Đưa toàn bộ rule surface về trạng thái:

- 100% file `.mdc` + `AGENTS.md` + `docs/CLAUDE.md` đọc được, không còn ký tự lỗi encoding.
- 100% file `.mdc` có header metadata đầy đủ theo schema chuẩn.
- Rule Index duy nhất, khớp với metadata thật.
- Bớt trùng lặp: gộp `flash-sale-b2c-api.mdc` + `flash-sale-b2c-api-reference.mdc` thành 1 file.
- Có meta-rule để mọi thay đổi rule sau này đi qua quy trình.

## 3. Non-Goals

- **Không** thay đổi nội dung quyết định AI (vd: vẫn dùng TanStack Query, vẫn token ở
  `localStorage` key `fs_access_token`, vẫn i18n qua `next-intl`).
- **Không** xoá rule nào — chỉ gộp 1 cặp (api.mdc + api-reference.mdc).
- **Không** sửa code, không sửa docs khác ngoài `docs/CLAUDE.md`.
- **Không** push lên remote (Bước 6 của workflow-process chỉ auto-commit local; user tự push).
- **Không** tạo file `pages/`, `app/api/`, không đụng backend.

## 4. Target State (after this work)

```
.cursor/
  rules/
    22 .mdc files (UTF-8 sạch, header chuẩn, scope rõ)
    + 1 mới: meta-rule-authoring.mdc
AGENTS.md                              (UTF-8 sạch, Rule Index duy nhất)
docs/CLAUDE.md                         (UTF-8 sạch — không đổi mục 1–12)
templates/
  rule-template.mdc                    (template để clone khi tạo rule mới)
docs/superpowers/
  specs/2026-10-09-standardize-rules-design.md   ← file này
  plans/2026-10-09-standardize-rules-plan.md
```

Cấu trúc mỗi file `.mdc` sau chuẩn hoá:

```yaml
---
description: <1 câu tiếng Anh, mục đích rule, mục nào trong CLAUDE.md phục vụ>
globs:
  - <path pattern 1>
  - <path pattern 2>
alwaysApply: <true|false>
owner: <ai|human|team>
depends_on:
  - <file.mdc khác>     # nếu có
last_reviewed: 2026-10-09
---
> Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x
> Source-of-truth: docs/CLAUDE.md mục X — <tên mục>

# <Title tiếng Anh, PascalCase-ish>

<Body Markdown sạch, tiếng Việt có dấu, mỗi section 1–3 đoạn>
```

## 5. Strategy (chi tiết kỹ thuật)

### 5.1. Khôi phục nội dung từ lịch sử

Vì file hiện tại bị corrupt encoding không thể sửa chữa bằng text-substitution (ký tự 2-byte UTF-8
bị chia cắt ngẫu nhiên), ta **re-author từ commit sạch gần nhất**:

- Dùng `git log --follow --oneline <file>` để tìm commit cuối cùng file còn ở encoding sạch
  (thường là commit ban đầu trên `dev` hoặc commit đầu của PR mỗi rule).
- Dùng `git show <commit>:<file>` để dump phiên bản sạch ra 1 file tạm.
- Đọc file tạm, dịch lại ý theo format chuẩn, ghi đè file mới dưới dạng UTF-8.
- Commit mới: `docs(rules): re-author <file>.mdc (utf-8 + metadata)`.

Trong trường hợp tất cả lịch sử đều hỏng (không có commit sạch), sẽ:

- Dùng git blame + commit message để suy luận ý.
- Đối chiếu chéo với rule tương đương trong `AGENTS.md` (chỗ không bị hỏng).
- Nếu vẫn mơ hồ → ghi rõ phần đó là "best-effort reconstruction" trong Notes commit, và
  `git commit --no-verify` để báo flag TODO cho user review lại trong PR.

### 5.2. Header schema chuẩn

Tất cả file `.mdc` phải có đủ 7 key sau ở frontmatter YAML:

| Key | Bắt buộc | Mô tả |
|---|---|---|
| `description` | ✓ | 1 câu tiếng Anh, dùng cho Cursor Rule Editor + auto-grep |
| `globs` | ✓ | Danh sách path pattern (relative từ repo root); `[]` nếu always-apply |
| `alwaysApply` | ✓ | `true` chỉ cho rule "always" (workflow, stack, error-handling) |
| `owner` | ✓ | `ai` (Cursor tự sinh) / `human` / `team` |
| `depends_on` | ✗ | Danh sách file rule phụ thuộc (vd: api-data → flash-sale-b2c-api) |
| `last_reviewed` | ✓ | Ngày review cuối (YYYY-MM-DD) |
| `version` | ✗ | SemVer rule riêng (mặc định 1 nếu không có) |

Trường bị thiếu → fail check ở SP6.

### 5.3. Body format

- **Tiêu đề H1** tiếng Anh, không dấu (`# API Contract — Flash Sale B2C`).
- **Body** tiếng Việt có dấu, nhưng mã UTF-8 sạch (kiểm tra bằng `file --mime-encoding`).
- **Bảng** dùng Markdown table, **không** dùng `>` blockquote cho heading trong bảng.
- **Code block** có language tag (`ts`, `bash`, ...).
- **Không** có binary noise cuối file (kiểm tra bằng `tail -c 100 file | xxd | tail -1`).
- **Không** có placeholder `TBD` / `TODO` / `...` ngoại trừ `// TODO(api): ...` trong code.

### 5.4. Gộp file trùng scope

- `flash-sale-b2c-api.mdc` + `flash-sale-b2c-api-reference.mdc` →
  **giữ 1 file** `flash-sale-b2c-api.mdc` với 2 section:
  - §1–§7: policy tích hợp (cũ của `api.mdc`)
  - §8: "Khi nào đọc `docs/api-document.md` / `docs/api-reference.md`" (cũ của `api-reference.mdc`)
- Cập nhật `AGENTS.md` Rule Index bỏ entry trùng.

### 5.5. Meta-rule mới

File `.cursor/rules/meta-rule-authoring.mdc` quy định:

- Khi tạo/sửa 1 file rule, bắt buộc cập nhật `AGENTS.md` Rule Index.
- Khi tạo/sửa rule, phải chạy `pnpm lint` + `pnpm tsc --noEmit` (lint có check YAML frontmatter).
- Rule mới phải có header metadata đầy đủ (theo §5.2).
- Không tạo rule trùng scope với rule hiện có — nếu cần, gộp hoặc cross-ref.
- Commit message tiếng Anh, Conventional Commits, scope `rules`.

### 5.6. Verify (SP6)

Sau khi tất cả file xong, chạy script verify `scripts/verify-rules.ps1`:

```powershell
# Mỗi file .mdc:
#   1. file --mime-encoding <file>  → phải là utf-8
#   2. Có frontmatter YAML đầu file (bắt đầu bằng --- và kết thúc bằng --- trong 30 dòng đầu)
#   3. Có đủ 5 key bắt buộc: description, globs, alwaysApply, owner, last_reviewed
#   4. Không có ký tự lỗi encoding (regex /[\xFF\xFE]|\u003F{3,}/)
#   5. Tail file 100 bytes không có binary noise
#   6. AGENTS.md Rule Index liệt kê đúng số file

# Tổng kết:
#   Total .mdc files: N
#   Pass: X
#   Fail: Y
```

Nếu fail → sửa trong cùng subplan, không merge.

## 6. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Lịch sử file hỏng hết, re-author sai ý | Giữ file gốc dưới `.scratch/originals/` để user diff; ghi flag "best-effort" trong commit |
| Re-author làm thay đổi ý nghĩa rule | Mỗi file re-author phải có commit riêng để user review từng cái; cuối cùng mới update AGENTS.md |
| File `.mdc` lỗi YAML frontmatter | Test bằng `pnpm yaml` parse; verify script (SP6) báo fail rõ |
| Merge conflict với branch `docs/convert-rules-to-utf8` đang mở | Branch mới `docs/standardize-rules-utf8` từ `dev`; nếu user muốn merge cả 2, làm sau khi cả 2 PR ready |
| Agent tự ý thêm/sửa nội dung quyết định | Mỗi commit có prefix `docs(rules):` rõ ràng; kèm `Refs: docs/superpowers/specs/2026-10-09-standardize-rules-design.md` trong body |
| Encoding re-corrupt khi commit | Commit message body bằng tiếng Anh ASCII-only (đã quy định ở commit trước) |

## 7. Affected Files

### Re-author (UTF-8 sạch + header chuẩn)

- `.cursor/rules/skill-loading.mdc`
- `.cursor/rules/stack-versions.mdc`
- `.cursor/rules/workflow-process.mdc`
- `.cursor/rules/git-workflow.mdc`
- `.cursor/rules/git-worktree.mdc`
- `.cursor/rules/no-overengineering.mdc`
- `.cursor/rules/error-handling.mdc`
- `.cursor/rules/testing-required.mdc`
- `.cursor/rules/layer-convention.mdc`
- `.cursor/rules/state-management.mdc`
- `.cursor/rules/auth-jwt.mdc`
- `.cursor/rules/websocket-realtime.mdc`
- `.cursor/rules/component-pattern.mdc`
- `.cursor/rules/design-system.mdc`
- `.cursor/rules/enum-labels.mdc`
- `.cursor/rules/api-data.mdc`
- `.cursor/rules/validation-forms.mdc`
- `.cursor/rules/routing-guards.mdc`
- `.cursor/rules/i18n.mdc`
- `.cursor/rules/docs-sync.mdc`
- `.cursor/rules/features-migration.mdc`
- `.cursor/rules/flash-sale-payment.mdc`
- `.cursor/rules/flash-sale-b2c-api.mdc` (giữ, gộp nội dung từ api-reference)
- `AGENTS.md`
- `docs/CLAUDE.md`

### Xoá (sau khi đã gộp nội dung sang api.mdc)

- `.cursor/rules/flash-sale-b2c-api-reference.mdc`

### Tạo mới

- `.cursor/rules/meta-rule-authoring.mdc`
- `templates/rule-template.mdc`
- `scripts/verify-rules.ps1`

### Không động

- Bất kỳ file nào khác trong `src/`, `public/`, `package.json`, `next.config.*`, ...

## 8. Execution Order (6 subplan)

| # | Subplan | Phụ thuộc | Output |
|---|---|---|---|
| SP1 | Audit & inventory | — | `audit-inventory.md` |
| SP2 | Header schema + template | — | `templates/rule-template.mdc` |
| SP3 | Re-author `AGENTS.md` + `docs/CLAUDE.md` | SP1 | 2 file sạch |
| SP4 | Re-author 23 file `.mdc` (gộp 1 cặp, xoá 1) | SP1, SP2 | ~22 file sạch + 1 file xoá |
| SP5 | Tạo meta-rule + cập nhật Rule Index | SP2, SP4 | 1 file mới + index cập nhật |
| SP6 | Verify + auto-commit | SP1–SP5 | Báo cáo Verify, commit pass |

## 9. Acceptance Criteria

- [ ] `find .cursor/rules -name "*.mdc" | wc -l` = 22 (sau khi gộp api, trừ 1)
- [ ] `find .cursor/rules -name "*.mdc"` — tất cả file đều có frontmatter đầy đủ 5 key bắt buộc
- [ ] `file --mime-encoding` mỗi file `.mdc` = `utf-8`
- [ ] Không còn ký tự `㼿`, `┤`, `═` trong bất kỳ file nào
- [ ] `AGENTS.md` Rule Index liệt kê đúng số file, đúng scope
- [ ] Có `meta-rule-authoring.mdc` mô tả quy trình tạo/sửa rule
- [ ] Có `scripts/verify-rules.ps1` chạy được và pass
- [ ] Tất cả commit tiếng Anh, Conventional Commits, không push

## 10. Open Questions

_(Resolved trước khi viết plan)_

- ~~Có giữ file `flash-sale-b2c-api-reference.mdc` riêng không?~~ → Gộp vào `flash-sale-b2c-api.mdc`.
- ~~Có xoá rule nào không?~~ → Không, chỉ gộp 1 cặp.
- ~~Có đụng `docs/CLAUDE.md` không?~~ → Có, re-author UTF-8 sạch, giữ nguyên mục 1–12.
