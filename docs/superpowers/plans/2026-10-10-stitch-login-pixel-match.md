# Plan: Match Stitch login design 100% (2026-10-10)

## Goal
Update FE login page to 100% match the Stitch screen
"Đăng nhập - Vibe Mart" (id 203897a8633d41618a493cf7a0eed51a)
in project "Vibe Mart Marketplace UI/UX" (id
15206106541998912100) of the user's Stitch account.

User confirmed: full pixel match.

## Reference
- Stitch project: 15206106541998912100
- Stitch screen: 203897a8633d41618a493cf7a0eed51a
- HTML downloaded: agent-tools/stitch/login-stitch.html (20KB)
- Screenshot: agent-tools/stitch/login-stitch.png

## Source of Truth
Stitch Material 3 design system ("Ocean Mint E-Commerce") is
the new SoT for the design tokens. Per user approval 2026-10-10,
docs/CLAUDE.md section 3 (design tokens) will be updated to
match Stitch tokens.

## Changes (1 commit)

### 1. Docs sync — docs/CLAUDE.md section 3
- Replace existing token table with Stitch Material 3 tokens:
  - brand (#0284C7) → primary (#006194)
  - brand-hover (#0369A1) → primary-container (#007BB9)
  - brand-soft (#E0F2FE) → primary-fixed (#CCE5FF)
  - surface (existing F8FAFC) → background (#FAF8FF)
  - card (#FFFFFF) → surface-container-lowest (#FFFFFF)
  - line (#E2E8F0) → outline-variant (#BFC7D2)
  - ink (#0F172A) → on-surface (#131B2E)
  - ink-2 (#64748B) → on-surface-variant (#3F4850)
  - ink-3 (#94A3B8) → outline (#707881)
  - sale (#E11D48) → tertiary (#BA0035) [keep semantic name "sale" for
    flash sale elements]

### 2. tailwind.config.ts
- Update `theme.extend.colors` to match Stitch tokens (primary
  instead of brand; tertiary instead of sale; etc.)
- Update `theme.extend.fontFamily.sans` to use Be Vietnam Pro
  weights 400/500/600/700
- Update `theme.extend.borderRadius` to match Stitch sm 0.25,
  DEFAULT 0.5, md 0.75, lg 1, xl 1.5, full 9999

### 3. Layout refactor — src/app/(auth)/layout.tsx
- Add fixed top header with logo, "Xác thực tài khoản" breadcrumb
  label, and "Trợ giúp" + "Về trang chủ" nav links
- Add footer with copyright + 3 policy links
- max-width 1240px (per Stitch), centered

### 4. src/app/(auth)/dang-nhap/page.tsx
- Change layout to 2-column desktop (md:flex-row):
  - Left (md:w-[54%]): brand panel with 3 benefits + flat illustration
  - Right (md:w-[46%]): form card
- max-w-[420px] for form card

### 5. components/auth/BrandPanel.tsx
- Rewrite to match Stitch left panel:
  - Logo top
  - Headline "Mua sắm dễ dàng, săn deal mỗi ngày"
  - 3 benefit cards with Material Symbols icons (storefront, bolt,
    account_balance_wallet)
  - SVG illustration of shopping bag + gift box + coupon tag
- Use `bg-surface-container`, `rounded-2xl`, `p-8 lg:p-12`,
  blur blob backgrounds

### 6. components/auth/LoginForm.tsx
- Add "Remember me" checkbox + "Quên mật khẩu?" link row
- Change primary button bg to primary token (new #006194)
- Update input height to 42px
- Add error icon (Material Symbols "error")
- Keep RHF + zod wiring

### 7. components/common/Logo.tsx
- Make sure existing logo asset matches Stitch "Vibe Mart" SVG
  (if not, use placeholder)

### 8. components/auth/SocialLoginButtons.tsx
- Add Material Symbols hover states
- Verify 3-col grid with gap-space-sm
- Replace inline SVGs with the exact Google/Facebook/GitHub
  SVGs from Stitch HTML

### 9. components/auth/AuthHeader.tsx
- Update to fixed top, backdrop-blur-xl, shadow
- 1240px max-width
- 16px (h-16) height
- Logo + "Xác thực tài khoản" + nav

### 10. components/auth/AuthFooter.tsx
- Update to 1240px max-width
- Copyright + 3 links (Điều khoản dịch vụ, Chính sách bảo mật,
  Liên hệ)
- bullet separator between links

### 11. globals.css + tailwind.config.ts
- Add Material Symbols Outlined font CDN (or import via
  next/font — may need extra setup)
- OR use inline SVG for icons (avoid extra lib per
  no-overengineering.mdc)

## Test strategy
- 4 new visual tests (snapshot) for the page → out of scope
  (rule no-overengineering). Manual smoke via npm run dev instead.
- 1 regression test: existing LoginForm.test.tsx + page.test.tsx
  still pass after refactor

## Risks
1. Docs sync to Material 3 = breaking change for ALL pages
   using brand/sale tokens. We have only 1 page (login) so risk
   is contained to this commit.
2. Inline SVG icons = more code but avoids Material Symbols
   dependency. Chosen approach: inline SVG via shadcn primitives
   + new IconBox component.
3. Layout 2-column might break on small mobile. Verified md:flex-row
   pattern (≥768px stacks 1 col, 2 col on md+).
