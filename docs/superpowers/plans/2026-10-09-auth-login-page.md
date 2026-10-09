# Plan: Trang Đăng Nhập Vibe Mart (Stitch 203897a8 → React/Next 16)

> **For agentic workers:** REQUIRED SUB-SKILL: tllq-workflow:itz-subagent-driven-development
> để thực thi plan subplan-by-subplan. Mỗi subplan = 1 subagent (theo `workflow-process.mdc` Bước 2).

**Goal:** Clone visual 100% screen Stitch `203897a8` (Đăng nhập - Vibe Mart) sang trang `src/app/(auth)/dang-nhap/page.tsx`, đồng thời **tuân thủ nghiêm ngặt `docs/CLAUDE.md`** về design tokens, i18n, error handling, testing. Hỗ trợ đăng nhập email/password + 3 OAuth (Google, Facebook, GitHub).

**Architecture (sau quyết định user cuối — 2026-10-09 23:08):**
- 1 page route update: `src/app/(auth)/dang-nhap/page.tsx` (Client Component, đã tồn tại — viết lại)
- 1 layout update: `src/app/(auth)/layout.tsx` → full-bleed, chứa `<AuthHeader /> + main + <AuthFooter />`
- 1 form component: `src/components/auth/LoginForm.tsx` (tách riêng để test)
- 1 social buttons component: `src/components/auth/SocialLoginButtons.tsx` (3 nút OAuth với TODO)
- 1 password input với toggle: `src/components/auth/PasswordInput.tsx`
- 1 brand panel component: `src/components/auth/AuthBrandPanel.tsx` (cột trái Stitch — 3 lợi ích + inline SVG)
- 1 auth header: `src/components/auth/AuthHeader.tsx` (logo + "Xác thực tài khoản" + nav Trợ giúp/Về trang chủ)
- 1 auth footer: `src/components/auth/AuthFooter.tsx` (copyright + 3 link)
- 0 password toggle icon: dùng inline SVG (visibility / visibility_off) thay lucide
- 0 social icon library: dùng inline SVG (Google / Facebook / GitHub)
- 0 brand illustration: dùng inline SVG (túi mua sắm, hộp quà, coupon, bong bóng)
- 0 brand benefit icons: dùng inline SVG (storefront, bolt, wallet)
- 0 error icon: dùng inline SVG (error)
- 0 hex in components: hard-code `primary #006194`, `error #ba1a1a`, `outline-variant #bfc7d2` cho màu Stitch-specific (chấp nhận vi phạm rule §3 — user duyệt)
- 1 schema update: `src/features/auth/schemas.ts` — thêm `identifier` (email|SĐT) thay vì chỉ email
- 1 api update: `src/features/auth/api.ts` — payload `{ email?, phoneNumber?, password }` (backend tự chọn)
- i18n keys: thêm `auth.login.*`, `auth.errors.*`, `auth.social.*`, `auth.brand.*`, `auth.chrome.*` namespace vào `messages/vi.json` + `messages/en.json` (parity)
- Tests: 6 file `.test.tsx` cho form, password input, social buttons, brand panel, header, footer + 1 schema test + 1 parity script
- Stitch HTML tham chiếu: `.scratch/stitch-login-203897a8.html` (20KB, đã tải)

**Spec:**
- Visual: Stitch screen `203897a8` (2560×2048 desktop, đã tải HTML)
- Backend contract: `src/features/auth/api.ts` (đã có sẵn `loginRequest`, `fetchMe`, `logoutRequest`)
- Auth flow: `docs/CLAUDE.md` mục 7, 8; `auth-jwt.mdc`; `validation-forms.mdc`

## Decisions (đã duyệt bởi user ở Bước 4 — 2026-10-09)

| # | Stitch | Quyết định user | Lý do |
|---|---|---|---|
| 1 | Header + Footer riêng cho auth | **GIỮ** — tạo `AuthHeader` + `AuthFooter`, update `(auth)/layout.tsx` sang full-bleed | User đổi ý 2026-10-09 (ban đầu chọn `auth_chrome_minimal`, sau đó yêu cầu giữ lại) |
| 2 | `primary #006194` / `error #ba1a1a` | **DÙNG** hex Stitch (hard-code) | User chọn `use_stitch_hex` — chấp nhận vi phạm rule §3 để giống 100% |
| 3 | Cột trái: 3 lợi ích + SVG | **GIỮ NGUYÊN** | User chọn `keep_panel_full` — giống 100% |
| 4 | Material Symbols Outlined | **CHUYỂN thành inline SVG** (lucide không dùng cho icon nào trong trang này) | User chọn "giữ toàn bộ SVG" — không cài Material Symbols, không dùng lucide cho trang login |
| 5 | Field "Email hoặc SĐT" | **CHẤP NHẬN cả 2** (regex: email hoặc SĐT VN `0[0-9]{9,10}` hoặc `+84[0-9]{9,10}`) | User chọn `phone_or_email_vi_regex` |
| 6 | Payload login | **GỬI CẢ 2 FIELD** `{ email, phoneNumber, password }` | User chọn `send_email_field` — backend tự chọn dùng field nào |
| 7 | OAuth buttons | **Click → toast "Chức năng đang phát triển"** + TODO(auth) | User chọn `todo_toast` — phù hợp scope đồ án |

## Tech Stack

Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4 · shadcn/ui (Button, Input, Label — đã có) · next-intl 4.x · `lucide-react` (icon) · `clsx` (cn) · `react-hook-form` 7.x + `zod` 3.x (đã có) · TanStack Query 5 (đã có) · Vitest + @testing-library/react (đã có).

## Global Constraints

- **ĐỌC** trước khi viết: `docs/CLAUDE.md` mục 0, 1, 2, 3, 5, 6, 7, 8, 10, 11; `.cursor/rules/i18n.mdc`; `.cursor/rules/component-pattern.mdc`; `.cursor/rules/validation-forms.mdc`; `.cursor/rules/auth-jwt.mdc`; `.cursor/rules/error-handling.mdc`; `.cursor/rules/stitch-workflow.mdc` (rule riêng về Stitch).
- **KHÔNG** hard-code text tiếng Việt/Anh trong component (rule i18n).
- **KHÔNG** dùng hex màu trực tiếp trong component — dùng token (`brand`, `danger`, `ink`, `page`, `card`, `line`, `success`, `warning`) trong `tailwind.config.ts` (rule CLAUDE.md §3).
- **KHÔNG** sửa `docs/CLAUDE.md` (rule docs-sync.mdc).
- **KHÔNG** commit lên `dev` (rule git-workflow.mdc) — branch `feature/auth-login-page`.
- **KHÔNG** push (chờ user duyệt).
- **KHÔNG** thêm lib mới (rule no-overengineering.mdc, stack-versions.mdc) — đặc biệt KHÔNG cài Material Symbols.
- **MỖI** component có file test kèm (rule testing-required.mdc, TDD gate).
- Mỗi subplan xong phải `npm run test`, `npm run lint`, `npm run tsc --noEmit` đều PASS.
- 1 commit = 1 concern (rule git-workflow.mdc).
- Commit message EN + Conventional Commit (rule git-workflow.mdc "Commit language").

## Cấu trúc Plan → Subplan → Task

| # | Subplan | Concern | Dispatch đợt | Phụ thuộc |
|---|---|---|---|---|
| SP1 | **Audit file + i18n keys** | Đọc file hiện tại, liệt kê i18n keys cần thêm | đợt 1 (alone) | (none) |
| SP2 | **i18n messages** | Thêm `auth.*` namespace (login, errors, social, brand, **chrome**) vào `vi.json` + `en.json` (parity) + parity test | đợt 1 (alone) | SP1 |
| SP3 | **Auth chrome (Header/Footer/Layout)** | Tạo `AuthHeader`, `AuthFooter`, update `(auth)/layout.tsx` sang full-bleed | đợt 2 (sau SP2) | SP2 |
| SP4 | **Brand panel + form skeleton** | Tạo `AuthBrandPanel`, `LoginForm` skeleton (RHF + Zod), `PasswordInput` | đợt 2 | SP1, SP2 |
| SP5 | **Social buttons** | Tạo `SocialLoginButtons` (3 OAuth với TODO handler) | đợt 2 | SP1, SP2 |
| SP6 | **Schema + API payload update** | Thêm `identifierSchema` (email|SĐT VN), update `loginRequest` payload type `{ email?, phoneNumber?, password }` | đợt 2 | SP1, SP2 |
| SP7 | **Tests** | Unit test cho form, password input, social buttons, brand panel, header, footer; schema test | đợt 3 (sau SP3-SP6) | SP3-SP6 |
| SP8 | **Page wiring + redirect theo role** | Update `dang-nhap/page.tsx` dùng các component mới + redirect theo role BUYER/SELLER/ADMIN | đợt 3 (sau SP3-SP6) | SP3-SP6 |
| SP9 | **Audit + review** | Self-check: lint, tsc, test, build; commit + báo cáo | đợt 4 (cuối) | SP1-SP8 |

**Dispatch chiến lược:**
- **Đợt 1**: 1 subagent = SP1 (audit) + 1 subagent = SP2 (i18n) → chạy song song
- **Đợt 2**: 4 subagent song song = SP3 (chrome), SP4 (form+panel), SP5 (social), SP6 (schema+api)
- **Đợt 3**: 2 subagent = SP7 (tests), SP8 (page wiring) → chạy song song
- **Đợt 4**: agent chính = SP9 (review + commit + báo cáo)

### Test strategy (BẮT BUỘC — testing-required.mdc)

| File test | Cover |
|---|---|
| `scripts/i18n-parity.test.mjs` | Parity vi/en + 5 namespace có đủ keys |
| `src/components/auth/LoginForm.test.tsx` | Render, validation email/SĐT/password, submit gọi `login.mutate`, error hiển thị, button disabled khi pending |
| `src/components/auth/PasswordInput.test.tsx` | Toggle show/hide, accessibility (aria-label) |
| `src/components/auth/SocialLoginButtons.test.tsx` | 3 nút render, click gọi handler (mock) |
| `src/components/auth/AuthBrandPanel.test.tsx` | Render 3 lợi ích, snapshot không bắt buộc |
| `src/components/auth/AuthHeader.test.tsx` | Render logo + 2 nav link |
| `src/components/auth/AuthFooter.test.tsx` | Render copyright + 3 link |
| `src/features/auth/schemas.test.ts` | identifierSchema accept email/SĐT/reject; passwordSchema |
| `src/app/(auth)/dang-nhap/page.test.tsx` | Integration: render + submit gọi đúng hook |

### Commit strategy (git-workflow.mdc)

1 commit = 1 concern. Dự kiến:
- `feat(i18n): add auth.* namespace (vi/en)` (SP2)
- `feat(auth): add auth shell (header/footer/layout)` (SP3)
- `feat(auth): add login form + brand panel + password input` (SP4)
- `feat(auth): add social login buttons (Google/Facebook/GitHub)` (SP5)
- `feat(auth): add identifierSchema and update loginRequest payload type` (SP6)
- `test(auth): add tests for login components and i18n parity` (SP7)
- `feat(auth): wire dang-nhap page with role-based redirect` (SP8)
- `chore(auth): lint/tsc/test pass + review report` (SP9)

## Liên kết

- Stitch HTML: `.scratch/stitch-login-203897a8.html`
- Stitch screen: `projects/15206106541998912100/screens/203897a8633d41618a493cf7a0eed51a`
- Backend API: `src/features/auth/api.ts` (đã có)
- Auth store: `src/stores/auth.store.ts` (đã có)
- Middleware: `src/middleware.ts` (chưa có — bước sau, không thuộc scope plan này)

## Không thuộc scope plan này

- Trang đăng ký (`dang-ky`) — đã có stub, làm sau
- OAuth handler thật (Google/Facebook/GitHub backend) — chỉ TODO
- Middleware `src/middleware.ts` cho guard route — làm sau
- Server-side guard trong `lib/auth-guard.ts` — đã có, không sửa
- Refresh token flow — đã có trong `apiFetch`, không sửa
- Quên mật khẩu — chỉ link, không có trang

## Rủi ro & Notes

- **Mâu thuẫn Stitch vs CLAUDE.md** (6 điểm còn lại — 1 điểm header/footer đã giải quyết: GIỮ) — đã liệt kê ở bảng "Decisions", giải quyết ở Bước 4.
- **Branch hiện tại** `feature/auth-login-page` đã có sẵn từ session cleanup, base = `origin/dev` `637741f`.
- **Stash cũ** (4 stash) không liên quan, không động.
- **Encoding**: tất cả file mới phải UTF-8 NO BOM (rule encoding-utf8.mdc).
- **Test coverage**: tối thiểu 70% cho components mới, 90% cho validators.
- **Layout `(auth)` hiện tại** đang tối giản (chỉ card), sẽ chuyển sang full-bleed (header + main + footer). Ảnh hưởng `(auth)/dang-ky/page.tsx` cũng (sẽ có header/footer). Cần user chấp nhận side-effect.

## Out of scope (để tránh overengineering)

- KHÔNG thêm skeleton state cho form (chỉ button loading).
- KHÔNG thêm reCAPTCHA.
- KHÔNG thêm 2FA.
- KHÔNG thêm "Quên mật khẩu" form (chỉ link trỏ đến `/quen-mat-khau` chưa có — sẽ 404, OK cho đồ án).
- KHÔNG thêm "Đăng nhập bằng số điện thoại" riêng (Stitch dùng chung field "Email hoặc SĐT" → field là email với regex cho phép SĐT VN).
