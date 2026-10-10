# Plan: Trang Đăng ký tài khoản – match Stitch 100% (2026-10-10)

## Goal

Tạo trang đăng ký tài khoản (`/dang-ky`) khớp 100% với Stitch screen
**"Đăng ký tài khoản - Vibe Mart"** (id `0f04994fa0a545c08f65be1c1208490e`,
project 15206106541998912100). Tái sử dụng `AuthHeader` + `AuthFooter`
+ `AuthBrandPanel` đã có sẵn ở `(auth)/layout.tsx` (do trang đăng nhập đã
làm ở commit `f4167e7`).

## Reference

- Stitch project: `15206106541998912100` (Vibe Mart Marketplace UI/UX)
- Stitch screen: `0f04994fa0a545c08f65be1c1208490e` – "Đăng ký tài khoản - Vibe Mart"
- HTML downloaded: `agent-tools/stitch-screens/dang-ky.html` (22 KB)
- Stitch plan mẫu (login): `docs/superpowers/plans/2026-10-10-stitch-login-pixel-match.md`

## Source of Truth

- `docs/CLAUDE.md` mục 3 (design tokens Material 3) – KHÔNG sửa, chỉ tham chiếu.
- Stitch HTML đã match đúng tokens hiện tại (primary `#006194`,
  secondary `#006C49`, surface-container `#EAEDFF`, …). Bám sát tokens
  hiện có trong `src/app/globals.css` + `tailwind.config.ts`.

## Sơ đồ màn hình (Stitch)

```
[Fixed Header – AuthHeader]                 (đã có)
[Main max-w-1240 grid 12 col]
  [Left col-6/7  – AuthBrandPanel]          (đã có, dùng lại)
  [Right col-5/6 – Form card max-w-460]
    Title: "Tạo tài khoản" + subtitle
    [Social buttons 3-col – ĐẦU form]       (variant mới, khác login)
    Divider "hoặc đăng ký bằng email"
    Form fields:
      - Họ và tên (text)
      - Email (email)
      - Số điện thoại (tel + prefix +84)
      - Mật khẩu (password + show/hide)
      - Password strength bar (4 seg) + label
      - Nhập lại mật khẩu (password + show/hide)
    Checkbox "Đồng ý điều khoản + chính sách bảo mật"
    Primary button "Đăng ký" + icon arrow_forward (h-11)
    Link "Đã có tài khoản? Đăng nhập"
[Footer – AuthFooter]                        (đã có)
```

## Changes (chia 2 commit theo concern)

### Commit 1: `feat(auth): add register form component with Stitch pixel match`

File mới (logic):
- `src/components/auth/RegisterForm.tsx` (~280 dòng)
  - `useForm<RegisterInput>` với `zodResolver(registerSchema)`
  - State: `apiError`, `showPassword`, `showConfirmPassword`,
    `agreedTerms`, `passwordStrength` (4 levels: empty/weak/medium/strong)
  - Form fields theo Stitch
  - Show/hide password tương tự LoginForm
  - Strength bar client-side (4 segment), label "Yếu / Khá / Mạnh / Rất mạnh"
  - Submit gọi `useRegisterMutation` (chưa có, tạo mới ở commit 2)
  - Submit button disable khi chưa đồng ý điều khoản
  - Link "Đăng nhập" → `/dang-nhap`
  - `data-testid` cho mọi phần tử test được
- `src/components/auth/RegisterForm.test.tsx` (~150 dòng)
  - Render: title, all 5 fields, 2 password toggles, 1 checkbox, submit btn
  - Validation: empty fullName/email/phone/password/confirmPassword
  - Validation: invalid email, invalid phone VN format
  - Validation: password mismatch, password < 8 ký tự
  - Toggle show/hide password cả 2 ô
  - Checkbox terms agreement toggle
  - Strength bar hiển thị đúng số segment theo input
  - Submit khi chưa tick "đồng ý" → không gọi mutation
  - Submit khi form hợp lệ → gọi mutation với payload đúng
  - Mock `useRegisterMutation` (chưa có ở commit 1, sẽ có ở commit 2)

### Commit 2: `feat(auth): wire dang-ky page with backend register contract`

File thay đổi (logic):
- `src/features/auth/schemas.ts` – thêm `registerSchema` (zod)
  - `fullName`: min 2, max 100
  - `email`: email format
  - `phone`: `+84` + 9 chữ số (regex phoneVnSchema có sẵn, bỏ tiền tố)
  - `password`: 8-64 ký tự, có chữ + số (regex `/[A-Za-z]/` + `/\d/`)
  - `confirmPassword`: bằng `password` (refine)
- `src/features/auth/schemas.test.ts` – thêm test cho `registerSchema`
- `src/features/auth/api.ts` – thêm `registerRequest(payload)`
  - `POST /api/v1/auth/register` với body `{ fullName, email, phone, password }`
  - Trả về `AuthResponse` (giống login)
- `src/features/auth/api.test.ts` – thêm test cho `registerRequest`
- `src/features/auth/hooks.ts` – thêm `useRegisterMutation`
  - Lưu token + user
  - **Redirect về `/xac-thuc-email?email=<email>`** (theo user chọn)
  - Tạm thời route này là placeholder, sẽ build OTP page ở task riêng
- `src/features/auth/index.ts` – export `registerSchema`, `useRegisterMutation`,
  `RegisterInput`
- `src/features/auth/types.ts` – export `RegisterRequest`
- `src/app/(auth)/dang-ky/page.tsx` (rewrite, ~60 dòng)
  - 2-cột giống login (md:flex-row, max-w-1240)
  - `AuthBrandPanel` bên trái (đã có)
  - Form card bên phải: chứa `RegisterForm`
  - **KHÔNG** nhúng `SocialLoginButtons` (Stitch đăng ký có social riêng,
    nhưng để tránh trùng nút, dùng lại 3-col grid trong form)
  - Redirect rule: nếu user đã đăng nhập → HOME/SELLER_HOME/ADMIN_HOME
- `src/app/(auth)/dang-ky/page.test.tsx` (mới, ~80 dòng)
  - Render: brand panel + register form
  - Render: 5 form fields + submit button
- `src/app/(auth)/xac-thuc-email/page.tsx` (mới, ~30 dòng)
  - Stub: hiện thông báo "Vui lòng kiểm tra email" + email từ query
  - TODO: tích hợp OTP flow khi backend có endpoint
- `src/components/auth/RegisterForm.tsx` (sửa nhỏ) – import `useRegisterMutation`
  từ `@/features/auth` thay vì mock.

### Commit 3: `chore(i18n): add register translations for vi + en`

File thay đổi (copy thuần, không test):
- `messages/vi.json` – thêm key `auth.register.*`, `auth.social.register.*`,
  `auth.errors.*` (register-specific errors), `auth.password.strength.*`
- `messages/en.json` – thêm tương ứng

Các key mới (vi):
```json
"auth.register": {
  "title": "Tạo tài khoản",
  "subtitle": "Chỉ mất 1 phút để bắt đầu nhận ưu đãi",
  "fullNameLabel": "Họ và tên",
  "fullNamePlaceholder": "Nguyễn Văn An",
  "emailLabel": "Email",
  "emailPlaceholder": "nguyen.van.an@gmail.com",
  "phoneLabel": "Số điện thoại",
  "phonePrefix": "+84",
  "phonePlaceholder": "912 345 678",
  "passwordLabel": "Mật khẩu",
  "passwordPlaceholder": "Nhập mật khẩu",
  "confirmPasswordLabel": "Nhập lại mật khẩu",
  "confirmPasswordPlaceholder": "Nhập lại mật khẩu vừa tạo",
  "passwordHint": "Tối thiểu 8 ký tự, có chữ và số",
  "termsLabel": "Tôi đồng ý với",
  "termsLink": "Điều khoản dịch vụ",
  "andLabel": "và",
  "privacyLink": "Chính sách bảo mật",
  "submit": "Đăng ký",
  "submitPending": "Đang đăng ký…",
  "hasAccount": "Đã có tài khoản?",
  "loginCta": "Đăng nhập",
  "dividerEmail": "hoặc đăng ký bằng email"
},
"auth.password": {
  "strength": {
    "weak": "Yếu",
    "medium": "Khá mạnh",
    "strong": "Mạnh",
    "veryStrong": "Rất mạnh"
  }
},
"auth.social": {
  "googleRegister": "Đăng ký bằng Google",
  "facebookRegister": "Đăng ký bằng Facebook",
  "githubRegister": "Đăng ký bằng GitHub"
}
```

## Subplan (chia theo concern)

1. **Subplan 1 (commit 1 + 2)**: Code + tests cho RegisterForm + page.
   - Có thể chạy 1 subagent general-purpose vì 2 commit liên quan.
   - Test: RED trước → GREEN sau.
2. **Subplan 2 (commit 3)**: i18n copy thuần.
   - Chạy thẳng, không cần subagent (chỉ sửa JSON).

## Risks & mitigations

1. **Backend `/api/v1/auth/register` chưa verify CORS** – như handoff
   `docs/handoffs/2026-10-10-backend-cors-issue.md` đã ghi. Form vẫn
   hiển thị bình thường; chỉ khi submit sẽ fail nếu backend chưa fix.
   → Acceptable, vẫn ship được UI 100% Stitch.
2. **Phone prefix +84** – client validate với regex không có tiền tố
   (vd `912345678`), nhưng Stitch HTML hiển thị prefix cứng `+84`.
   → Validate `+84` stripped, hiển thị prefix tĩnh.
3. **Password strength bar** – chỉ client-side, KHÔNG dùng lib (no
   overengineering). Đánh giá theo độ dài + có số + có chữ hoa/thường/
   ký tự đặc biệt.
4. **CORS preflight khi gọi register** – test cuối cùng sau khi backend
   confirm CORS đã whitelist `localhost:3000`.

## Test strategy

- `npm run test` cho tất cả file test (RegisterForm, schemas, api, page).
- `npm run lint` PASS.
- `npm run tsc --noEmit` PASS.
- Manual smoke: mở `http://localhost:3000/dang-ky`, check 100% giống
  Stitch (so với screenshot trong `agent-tools/stitch-screens/dang-ky.html`
  và screenshot Stitch).

## Out of scope

- Social Register backend OAuth (giống login – TODO)
- Email verification flow (sẽ làm riêng khi backend verify endpoint)
- ReCAPTCHA (no overengineering)
- 2FA / SMS OTP (chưa có backend)
