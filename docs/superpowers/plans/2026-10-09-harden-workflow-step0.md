# 2026-10-09 — Harden Bước 0: Detect Parallel Work (No Exception)

## Bối cảnh

Task `standardize-rules` trước đây (commit trên `chore/mcp-stitch-config`, push lên `origin/chore/mcp-stitch-config`) đã tạo **17 commit sửa 24 file `.mdc`** mà không phát hiện có chat/branch khác đang chạm cùng file. Kết quả: **27 file conflict** khi merge `origin/dev` (đã có 19 commit từ PR #3–#10 cùng sửa các file đó).

User yêu cầu: **"tôi không muốn tình trạng này xảy ra 1 lần nào nữa"** → phải bám sát rule đã đặt, không có ngoại lệ.

## Root cause

| # | Lỗi | Rule hiện tại | Cách rule hiện tại giải quyết |
|---|---|---|---|
| 1 | Không check `git log origin/dev` trước khi sửa | Bước 0 chỉ hỏi user | KHÔNG có cơ chế bắt buộc |
| 2 | Không check `docs/superpowers/plans/` cùng ngày | (không có rule) | Thiếu |
| 3 | Không check `agent-transcripts/` có chat khác | (không có rule) | Thiếu |
| 4 | Bước 0.5 Worktree chỉ kích hoạt khi user nói "có chat song song" | Bước 0.5 | **Phụ thuộc user nhận biết** — user không phải lúc nào cũng biết |
| 5 | 1 commit = nhiều concern | git-workflow.mdc | Đã có rule, agent đã vi phạm |

## Scope thay đổi

Sửa **1 file duy nhất**: `.cursor/rules/workflow-process.mdc`.

Thêm mục **"Bước 0 — Detect Parallel Work (BẮT BUỘC, hard gate)"** chèn giữa Bước 0 hiện tại và Bước 0.1. Nội dung:

### 0.1 — 4 kiểm tra bắt buộc (BẮT BUỘC — không có ngoại lệ)

Trước khi hỏi user ở Bước 0, agent **PHẢI** chạy 4 lệnh sau và đọc kết quả:

| # | Lệnh | Phát hiện | Nếu phát hiện có → hành động |
|---|---|---|---|
| 1 | `git fetch origin dev && git log origin/dev --oneline -20` | Commit gần đây trên `dev` | Nếu commit trong 7 ngày chạm file thuộc scope → **DỪNG**, hỏi user |
| 2 | `git log origin/dev -- <file-in-scope>` cho từng file dự kiến sửa | Có người sửa cùng file gần đây | **DỪNG**, hỏi user |
| 3 | `ls docs/superpowers/plans/*.md \| head -20` | Plan cùng ngày | Nếu plan cùng ngày và cùng concern → **DỪNG**, hỏi user |
| 4 | `ls .git/worktrees/ 2>/dev/null` và `ls C:\Users\trang\.cursor\projects\<repo>/agent-transcripts/*.jsonl 2>/dev/null \| wc -l` | Worktree khác + chat khác | Nếu có worktree khác cùng branch base hoặc > 1 chat file → **DỪNG**, hỏi user |

### 0.2 — Kết quả check quyết định hành động

| Kết quả 4 check | Hành động |
|---|---|
| Tất cả check **sạch** | Tiếp tục Bước 0 (hỏi user như bình thường) |
| Bất kỳ check nào **có dấu hiệu** | **DỪNG**, không qua Bước 1. Dùng `AskQuestion` với 3 options: (a) đợi chat kia xong, (b) tách worktree, (c) hủy task. |
| User chọn "tách worktree" | Load `git-worktree.mdc` và chạy Bước 0.5 |
| User chọn "đợi" | Ghi lại lý do vào plan, chờ user xác nhận lại |

### 0.3 — Hard gate (không có ngoại lệ ngầm)

Các câu agent **KHÔNG ĐƯỢC** tự rationalize:

- ❌ "Plan kia cùng ngày nhưng khác concern, không conflict" → vẫn phải hỏi user
- ❌ "Commit kia đã merge rồi, không sao" → vẫn phải hỏi user
- ❌ "Worktree kia làm việc khác, không liên quan" → vẫn phải hỏi user
- ❌ "Agent khác đã xong, mình tiếp tục được" → vẫn phải hỏi user

**Lý do**: Agent **không có đủ context** để tự phán định "có conflict hay không". User mới là người có context đầy đủ. Mọi nghi ngờ → hỏi.

## Test strategy

Không có code logic thay đổi → không cần test. Verify bằng:

1. Đọc lại file `.cursor/rules/workflow-process.mdc` sau khi sửa.
2. Đảm bảo 4 lệnh shell ở Bước 0.1 chạy được trên Windows PowerShell (đã có sẵn trong môi trường).
3. Đảm bảo rule mới không vi phạm rule hiện tại (đặc biệt là "KHÔNG cần hỏi" của Bước 0).

## Subplan

Không cần subagent. Task nhỏ (1 file rule, 1 thay đổi có cấu trúc rõ ràng).

## Tham khảo

- `.cursor/rules/workflow-process.mdc` (file được sửa)
- `.cursor/rules/git-workflow.mdc` (đã có rule "Push policy", "1 commit = 1 concern")
- `.cursor/rules/git-worktree.mdc` (Bước 0.5 — khi phát hiện parallel, dùng rule này)
- `docs/superpowers/plans/2026-10-09-standardize-rules.md` (plan cũ — root cause)

## Rủi ro

| Rủi ro | Giảm thiểu |
|---|---|
| Thêm 4 bước check làm chậm agent | 4 lệnh shell mỗi lệnh < 1 giây → tổng < 5 giây. Đánh đổi: 5 giây check vs hàng giờ resolve conflict 27 file |
| Rule mới quá strict, chặn task độc lập | Check (2) chỉ trigger khi có commit trong 7 ngày + cùng file → false positive thấp |

## Files thay đổi

| File | Loại | Dòng thay đổi |
|---|---|---|
| `.cursor/rules/workflow-process.mdc` | Sửa | +60 dòng (chèn Bước 0.1 mới) |
