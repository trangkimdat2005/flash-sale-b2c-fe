# Flash Sale B2C — Frontend

> Next.js 16 storefront (B2C marketplace) consume Spring Boot backend `flash-sale-b2c-UTC2`. Tính năng nổi bật: **Flash Sale chống bán vượt kho** (over-selling). Đồ án Kỹ thuật Phần mềm — UTC2.
>
> Next.js 16 storefront for the Flash Sale B2C marketplace. Consumes the `flash-sale-b2c-UTC2` Spring Boot backend. Headline feature: **over-selling-safe Flash Sale**. Capstone project — UTC2.

## Stack

![Next.js 16.3.8](https://img.shields.io/badge/Next.js-16.3.8-black?logo=next.js)
![React 19.2](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![TypeScript 5](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss)

**Server state:** TanStack Query · **Client state:** Zustand · **Form:** React Hook Form + Zod
**Realtime:** STOMP · **Money:** decimal.js · **i18n:** next-intl · **UI primitives:** shadcn/ui (planned)

## Getting Started

> Yêu cầu / Requirements: **Node ≥ 20.x**, **npm ≥ 10.x**.

```bash
# Cài đặt / Install
npm install

# Chạy dev server / Run dev server (mặc định http://localhost:3000)
npm run dev

# Build production / Build for production
npm run build

# Chạy production / Start production server
npm start

# Lint / Lint
npm run lint
```

### Environment variables

> Xem chi tiết ở `docs/CLAUDE.md` mục **Quy trình / API** và backend `flash-sale-b2c-UTC2`.
> See `docs/CLAUDE.md` § **API workflow** and the backend repo for details.

| Key | Required | Mô tả / Description |
|---|:---:|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Backend base URL (vd `http://localhost:8080`). |
| `NEXT_PUBLIC_WS_URL` | ✅ | WebSocket STOMP endpoint. |

Tạo file `.env.local` ở root (KHÔNG commit — đã có trong `.gitignore`).

## Project Structure

```
src/
  app/                # Next.js App Router (route groups: (auth), storefront, seller, admin)
  components/         # Shared UI (flash-sale, common, ui)
  features/           # Feature-first modules (mục tiêu / target)
  hooks/              # Custom React hooks (useAuth, useFlashSaleWs, ...)
  lib/                # Logic layer (api/, validators/, utils)
  providers/          # React context providers
  stores/             # Zustand stores (auth persisted, flash-sale/UI in-memory)
  types/              # TypeScript types

.cursor/rules/        # Convention rules (22 file .mdc)
docs/                 # Source of Truth + API contract
```

📘 **Đọc [`AGENTS.md`](./AGENTS.md)** để biết overview đầy đủ + rule index.
📘 **Read [`AGENTS.md`](./AGENTS.md)** for the full overview + rule index.

## Documentation

| Tài liệu / Doc | Mục đích / Purpose |
|---|---|
| [`AGENTS.md`](./AGENTS.md) | Quick reference + rule index (bắt đầu ở đây). |
| [`docs/CLAUDE.md`](./docs/CLAUDE.md) | **Source of Truth #1** — quy định UI chuẩn. Đọc trước khi code. |
| [`docs/api-document.md`](./docs/api-document.md) | Backend Swagger export (1.358 dòng). |
| [`docs/api-reference.md`](./docs/api-reference.md) | API contract per module (791 dòng). |
| [`docs/i18n-convention.md`](./docs/i18n-convention.md) | i18n convention. |
| [`docs/01_project_planning.md`](./docs/01_project_planning%20%281%29.md) | Project planning. |
| [`docs/02_requirement_analysis.md`](./docs/02_requirement_analysis%20%281%29.md) | Requirement analysis. |
| [`docs/03_system_design.md`](./docs/03_system_design%20%282%29.md) | System design. |
| [`docs/04_architecture_analysis.md`](./docs/04_architecture_analysis.md) | Architecture analysis. |
| [`docs/flashsale_order_contract.md`](./docs/flashsale_order_contract.md) | Flash sale + order contract. |

> ⚠️ Các rule trong `.cursor/rules/*.mdc` **BẮT BUỘC** phải đọc trước khi viết/sửa code (xem `AGENTS.md` mục "Trước khi code").
>
> ⚠️ Rules in `.cursor/rules/*.mdc` are **MANDATORY** to read before writing/editing code (see `AGENTS.md` § "Before coding").

## Backend Repository

> Frontend chỉ chứa UI + data layer. Mọi logic nghiệp vụ quan trọng (tính tiền, trừ kho, voucher, phân quyền) do backend quyết định.
>
> The frontend only handles UI + data layer. All critical business logic (pricing, stock deduction, vouchers, authorization) is decided by the backend.

Repo backend: **`flash-sale-b2c-UTC2`** (Spring Boot + PostgreSQL + Redis + WebSocket STOMP).

## Contributing

> Repo này theo **branching model** `dev` → `feature/*` → `dev` → `main`.
>
> This repo follows the **`dev` → `feature/*` → `dev` → `main`** branching model.

Quy trình chi tiết xem `.cursor/rules/git-workflow.mdc` + `.cursor/rules/workflow-process.mdc`.
Detailed workflow: see `.cursor/rules/git-workflow.mdc` + `.cursor/rules/workflow-process.mdc`.

**Quy tắc nhanh / Quick rules:**

- ✅ Conventional Commit (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `hotfix:`).
- ✅ 1 commit = 1 concern.
- ✅ Branch từ `dev` (xem `git-workflow.mdc`).
- ✅ Push khi đã được user duyệt — agent KHÔNG tự ý push.
- ❌ KHÔNG sửa backend trong repo này.
- ❌ KHÔNG tạo `app/api/**` (Next.js Route Handlers) — backend đã lo REST.

## License

> Private — đồ án Kỹ thuật Phần mềm, UTC2.
>
> Private — Software Engineering capstone project, UTC2.