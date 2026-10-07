<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Flash Sale B2C — FE Agent Quick Reference

**Project**: Next.js 16 (App Router) storefront cho Flash Sale B2C marketplace (consume API từ `flash-sale-b2c-UTC2` Spring Boot backend).

## Trước khi code

1. **Đọc rule liên quan** trong `.cursor/rules/` — mỗi rule theo concern, không viết dài ở đây.
2. **Đọc `node_modules/next/dist/docs/`** cho API Next 16 (cookies/headers/params/searchParams là async, không dùng knowledge cũ).
4. **Check code hiện tại** — không chỉ tin docs.

## Quy tắc nhanh

- **Source-of-truth UI**: `docs/CLAUDE.md` (mục 1–11). Khi cần quyết định UI/styling/convention → đọc file đó trước.
- **API**: mọi HTTP request đi qua `src/lib/api/client.ts` (`apiFetch`). Không fetch trực tiếp trong component. Token đọc từ `localStorage` key `"fs_access_token"`.
- **Auth**: state ở `src/stores/auth.store.ts` (Zustand persist key `"fs_auth"`). `useAuth()` qua `src/hooks/useAuth.ts`. Server guard ở `src/lib/auth-guard.ts` (cookie `access_token`). Khi migrate: sẽ thêm `middleware.ts` (xem `routing-guards.mdc`).
- **Providers**: `src/providers/Providers.tsx` — gồm `QueryClientProvider` + `WsConnectionProvider` + `SessionCookieBridge` + `<ToastViewport>`.
- **Realtime**: `src/hooks/useFlashSaleWs.ts` mount qua `WsConnectionProvider` ở root. Cache realtime ở `src/stores/flash-sale.store.ts`. WS chỉ là notification, không quyết định logic.
- **Validation**: RHF + Zod, message tiếng Việt. Schema ở `src/lib/validators/<module>.validator.ts` (mục tiêu: `src/features/<x>/schemas.ts`).
- **State**: TanStack Query (server), Zustand (`src/stores/`: auth persisted, flash-sale/UI in-memory), Context (UI providers), local state (component).
- **Style**: Tailwind 4 + tokens `brand/seller/admin/sale/ink/page/card/line` trong `tailwind.config.ts` (chưa có). Font **Be Vietnam Pro** subset `vietnamese`, weight 400/500/600 (chưa có — hiện tại là Geist). UI primitives từ **shadcn/ui** (chưa có — hiện tại custom). Xem `design-system.mdc`, `component-pattern.mdc`.
- **URL**: tiếng Anh không dấu (`/login`, `/products`, `/orders`...) — xem `routing-guards.mdc` mục 1.
- **Layer convention**: xem `.cursor/rules/layer-convention.mdc` (đã map source hiện tại + mục tiêu).
- **i18n**: BẮT BUỘC dùng `next-intl`. Locale `vi` (mặc định) + `en`. Mỗi component có namespace riêng, key đầy đủ trong cả `vi.json` + `en.json`. **KHÔNG hard-code text** trong component. Xem `.cursor/rules/i18n.mdc`.
- **Copy**: đa ngôn ngữ `vi` + `en` qua `next-intl`. Default `vi`. Message lỗi từ `ApiError.code` dịch qua key `error.<CODE>` (xem `i18n.mdc` mục 8). Enum backend → nhãn đa ngôn ngữ ở namespace `order.status`, `payment.status`, ... (xem `enum-labels.mdc`).
- **Tiền**: VND BigDecimal — KHÔNG float, dùng `decimal.js`. Format `1.290.000₫` qua `formatVND` (chưa có helper, sẽ tạo).
- **Ảnh**: `next/image` + `alt` tiếng Việt (xem `component-pattern.mdc` mục 10).
- **Stack bắt buộc**: see `.cursor/rules/stack-versions.mdc` (Next 16.3.8, React 19.2, TS 5, Tailwind 4, RQ 5, Zustand 5, RHF 7, Zod 3, STOMP 7, shadcn/ui, date-fns vi, next-intl).
- **Git**: branch từ `dev`, conventional commit. **KHÔNG push**, KHÔNG sửa backend, KHÔNG tạo `app/api/**`, `pages/`.

## Source of Truth (ưu tiên)

1. **`docs/CLAUDE.md`** — quy định UI chuẩn của dự án.
2. `.cursor/rules/` — convention cụ thể cho từng concern.
3. `AGENTS.md` này — overview ngắn.
4. Code hiện tại trong repo (khi rule chưa migrate xong).
5. Backend `AGENTS.md` ở `flash-sale-b2c-UTC2/` — đặc biệt API contract, Auth, Flash Sale, WS, Idempotency, Error Code.
6. `deploy-b2c-utc2/README.md` — khi cần biết env/nginx/domain thật.

## Rule Index

| File | Áp dụng khi |
|---|---|
| `.cursor/rules/skill-loading.mdc` | always — auto-load skill mỗi turn |
| `.cursor/rules/flash-sale-b2c-api.mdc` | `src/lib/api/**`, `hooks/**`, `stores/**`, `types/**`, `components/flash-sale/**` |
| `.cursor/rules/flash-sale-b2c-api-reference.mdc` | (index chi tiết API, đọc khi tích hợp endpoint cụ thể) |
| `.cursor/rules/stack-versions.mdc` | always |
| `.cursor/rules/testing-required.mdc` | always — bắt buộc viết test mỗi lần thay đổi, không được bỏ qua |
| `.cursor/rules/layer-convention.mdc` | `src/lib/**`, `src/stores/**`, `src/providers/**`, `src/hooks/**`, `src/components/**`, `src/app/**` |
| `.cursor/rules/auth-jwt.mdc` | `src/stores/auth.store.ts`, `src/lib/api/client.ts`, `src/hooks/useAuth.ts`, `src/components/layout/SessionCookieBridge.tsx`, `src/app/(auth)/**` |
| `.cursor/rules/websocket-realtime.mdc` | `src/hooks/useFlashSaleWs.ts`, `src/providers/WsConnectionProvider.tsx`, `src/stores/flash-sale.store.ts`, `src/components/flash-sale/**` |
| `.cursor/rules/component-pattern.mdc` | `src/components/**`, `src/app/**/*.tsx`, `src/app/globals.css`, `tailwind.config.ts` — cấu trúc component, cva, forwardRef, props, layout, state styling, a11y, image, icon, date, money, loading |
| `.cursor/rules/design-system.mdc` | `tailwind.config.ts`, `src/app/globals.css`, `src/components/**`, `src/app/**` — Tailwind 4 setup, design tokens (color, font, spacing, radius, shadow, z-index), responsive breakpoints |
| `.cursor/rules/enum-labels.mdc` | `StatusBadge`, `Badge`, `lib/constants.ts`, status enum types |
| `.cursor/rules/api-data.mdc` | `src/lib/api/**`, `src/lib/api-client.ts`, `src/features/**/api.ts`, `src/features/**/hooks.ts`, `src/features/**/mock.ts`, `src/features/**/types.ts` |
| `.cursor/rules/flash-sale-payment.mdc` | `src/components/flash-sale/**`, `src/components/common/Countdown.tsx`, `src/lib/api/flash-sale.api.ts`, `src/features/flash-sale/**`, `src/features/checkout/**` |
| `.cursor/rules/validation-forms.mdc` | `src/app/**/page.tsx`, `*Form.tsx`, `*Modal.tsx`, `src/lib/validators/**`, `src/features/**/schemas.ts` |
| `.cursor/rules/routing-guards.mdc` | `src/app/**`, `src/middleware.ts`, `src/lib/auth-guard.ts`, `src/i18n/**` |
| `.cursor/rules/i18n.mdc` | `src/**/*.{ts,tsx}`, `src/i18n/**`, `messages/**`, `src/middleware.ts` |
| `.cursor/rules/state-management.mdc` | `src/stores/**`, `src/lib/**`, `src/hooks/**`, `src/providers/**` |
| `.cursor/rules/git-workflow.mdc` | always |
| `.cursor/rules/no-overengineering.mdc` | always |
| `.cursor/rules/workflow-process.mdc` | always — mọi thay đổi lớn phải qua 7 bước: Xin phép (0) → Worktree (0.5) → Plan (1) → Song song (2) → Model (3) → Hỏi (4) → Làm (5) → Review (6). Bước 0.5 (worktree) tách riêng sang `git-worktree.mdc`. |
| `.cursor/rules/git-worktree.mdc` | `.cursor/rules/*.mdc`, `AGENTS.md` — quy trình tạo git worktree khi 2+ chat song song có khả năng conflict (chỉ load khi trigger, không phải always) |
| `.cursor/rules/docs-sync.mdc` | `docs/**`, `AGENTS.md` — bảo vệ Source of Truth #1 (`docs/CLAUDE.md` read-only) |
| `.cursor/rules/error-handling.mdc` | always — chuẩn xử lý lỗi: throw vs catch vs toast, console log, Error Boundary, 404/500/offline UI |
| `.cursor/rules/features-migration.mdc` | `src/features/**`, `src/lib/api/**`, `src/lib/validators/**`, `src/hooks/**` — quy trình + template tạo feature module |

## Báo cáo sau khi hoàn thành task

```text
## Changes
- ...

## Implementation
- ...

## API / WS (nếu có)
- ...

## Tests
- Build: `npm run build` → pass / fail
- Lint: `npm run lint` → pass / fail
- Manual smoke: trang nào đã mở, status

## Notes
- ...
```

**Không tuyên bố** "perfect", "100% safe", "guaranteed". Mô tả đúng phạm vi đã kiểm tra.