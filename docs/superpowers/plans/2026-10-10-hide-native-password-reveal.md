# Plan — Hide Native Password Reveal Icon

> **Date**: 2026-10-10
> **Branch**: `feature/auth-login-page`
> **Type**: fix (UI bug report từ user)
> **Scope**: 1 file (CSS) + verify 1 component (LoginForm)

## Background

User báo: "ô mật khẩu còn hiện icon mắt mặc định của trình duyệt".

**Nguyên nhân**:
- Chrome (và Edge) mặc định render **nút "Hiện mật khẩu"** (eye icon) ở góc phải của mọi `<input type="password">`. Đây là **built-in browser feature** từ Chrome 87+.
- `LoginForm.tsx` đã có **icon SVG custom** (eye/eye-off) đè lên — nhưng icon của Chrome vẫn hiện bên cạnh → trông rối và có 2 icon.

**Reference**:
- [Chrome password reveal built-in](https://developer.chrome.com/docs/privacy-security/password-reuse) — pseudo-elements: `::-ms-reveal` (Edge), `::-webkit-credentials-auto-fill-button` (Chrome).
- Stitch screen 203897a8 — chỉ có 1 icon custom (eye/eye-off), không có icon native.

## Scope

### File thay đổi
| Path | Loại | Lý do |
|---|---|---|
| `src/app/globals.css` | **Sửa** (thêm rule) | Thêm CSS ẩn native password reveal buttons |

### File xác minh (không sửa)
| Path | Mục đích |
|---|---|
| `src/components/auth/LoginForm.tsx` | Đã có SVG custom, không cần thay đổi |
| `src/components/auth/LoginForm.test.tsx` | Test existing (toggle eye/eye-off) — KHÔNG cần thêm test vì đây là CSS thuần, không có logic |

## Implementation

```css
/* src/app/globals.css */

/* Hide native password reveal (Chrome + Edge) — keep only our custom eye icon */
input[type='password']::-ms-reveal,
input[type='password']::-ms-clear {
  display: none;
}

input[type='password']::-webkit-credentials-auto-fill-button,
input[type='password']::-webkit-strong-password-auto-fill-button {
  -webkit-appearance: none;
  appearance: none;
  display: none !important;
}
```

Lý do không cần test:
- Đây là **CSS thuần** (`display: none`), không có logic JS nào.
- Theo `testing-required.mdc` mục "Khi nào KHÔNG cần test": **CSS** (chỉ đổi class Tailwind / color / spacing) → không cần test.
- Lý do file này KHÔNG có logic: rule chỉ ẩn 4 pseudo-element của 2 trình duyệt; không có function/hook/state. → **COPY thuần**, không phải logic.

## Verification (Manual)

1. Mở `http://localhost:3000/dang-nhap` ở **Chrome** (Windows/Mac) — verify chỉ còn 1 icon mắt (custom).
2. Mở ở **Edge** — verify tương tự.
3. Bấm icon mắt custom → mật khẩu reveal/hide đúng (functional regression check).
4. Mở ở **Firefox** (không có native reveal) — verify vẫn hoạt động bình thường.

## Acceptance Criteria

- [ ] Chrome (v87+): chỉ hiện 1 icon mắt custom ở góc phải field password.
- [ ] Edge: tương tự Chrome.
- [ ] Firefox/Safari: không regress (vốn không có native reveal).
- [ ] Icon mắt custom vẫn toggle password visibility đúng.
- [ ] Không có console warning mới.

## Risks

| Rủi ro | Mitigation |
|---|---|
| CSS rule ẩn có thể che cả các pseudo hữu ích khác | Chỉ target `input[type='password']` cụ thể, không target chung |
| Test environment không verify được visual | Manual test trên browser thật |
| Affect accessibility (screen reader) | Các pseudo này không expose ra accessibility tree, OK |

## Files không thuộc scope

- ❌ Không sửa `LoginForm.tsx` (SVG icon đã đúng)
- ❌ Không thêm test (CSS thuần)
- ❌ Không đổi design system tokens
- ❌ Không refactor

## Commits

- 1 commit: `fix(auth): hide native browser password reveal icon`
