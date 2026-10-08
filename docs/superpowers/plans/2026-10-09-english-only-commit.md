# Add English-only commit message rule

**Date**: 2026-10-09
**Branch**: `docs/convert-rules-to-utf8`
**Type**: docs (rule update)

## Scope
- `.cursor/rules/git-workflow.mdc` — thêm section "Commit message rules" với English-only + Conventional Commits
- `.cursor/rules/workflow-process.mdc` — thêm reference link tới git-workflow.mdc section mới

## Tham khảo
- `docs/CLAUDE.md` (Source of Truth #1) — không có section nào nói rõ về ngôn ngữ commit message
- `AGENTS.md` — section "Git" chỉ nói "branch từ dev, conventional commit" chưa nói ngôn ngữ

## Thay đổi chi tiết

### File 1: `.cursor/rules/git-workflow.mdc`
Thêm section mới (sau phần "Commit message format" hiện có) gọi là **"Commit language"** với nội dung:

```markdown
## Commit language (BẮT BUỘC từ 2026-10-09)

**Rule**: Mọi commit message (subject + body + footer) PHẢI viết bằng **tiếng Anh**. Tiếng Việt chỉ dùng trong comment code, doc string UI, hoặc khi user yêu cầu rõ ràng.

**Lý do**:
- Git log global (GitHub, GitLab) hiển thị công khai → maintainability
- Tìm kiếm với `git log --grep` dễ dàng hơn khi keyword nhất quán
- Conventional Commits convention toàn cầu đều dùng tiếng Anh

**Format mẫu** (tuân thủ Conventional Commits):
- `feat(scope): short description in English`
- `fix(scope): what was fixed`
- `docs(rules): add English-only commit language rule`
- `refactor(api): extract common fetch wrapper`

**Body** (nếu dài hơn 1 dòng):
- Wrap ở 72 ký tự
- Giải thích *what* và *why*, không phải *how*
- Bullet bằng `-`

**Khi nào KHÔNG áp dụng**:
- Branch name có thể giữ tiếng Việt không dấu (vd: `feat/them-trang-chu`) vì local only
- UI text (tiếng Việt cho user) KHÔNG liên quan
- Comment trong code (// TODO: ...) có thể giữ tiếng Việt

**Verify trước commit**:
- [ ] Subject ≤ 72 chars
- [ ] Subject bằng tiếng Anh (không có ký tự Việt)
- [ ] Type: feat/fix/docs/refactor/chore/test/perf/build/ci
- [ ] Scope (nếu có): module name ngắn
- [ ] Body wrap 72 chars
```

### File 2: `.cursor/rules/workflow-process.mdc`
Trong **Bước 6 — Review**, thêm 1 dòng reminder:

```markdown
- [ ] Commit message bằng tiếng Anh (xem `.cursor/rules/git-workflow.mdc` → "Commit language")
```

## Subplan

| # | Subplan | Output |
|---|---|---|
| 1 | Sửa `git-workflow.mdc` — thêm section "Commit language" | 1 file diff |
| 2 | Sửa `workflow-process.mdc` — thêm 1 dòng check ở Bước 6 | 1 file diff |

Cả 2 subplan độc lập → có thể chạy song song.

## Test strategy
- `node -e "const t=require('fs').readFileSync('.cursor/rules/git-workflow.mdc','utf8'); console.log('has English-only section:', /Commit language.*English/i.test(t))"`
- `node -e "const t=require('fs').readFileSync('.cursor/rules/workflow-process.mdc','utf8'); console.log('has reminder:', /Commit message bằng tiếng Anh/.test(t))"`
- `git diff` kiểm tra thay đổi đúng scope
- Commit + push

## Rủi ro
- Thấp: chỉ thêm section, không xóa/sửa logic cũ
- File đã được viết lại sạch ở commit trước → dễ edit
