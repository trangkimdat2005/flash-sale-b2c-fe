# i18n Migration (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use tllq-workflow:itz-subagent-driven-development để thực thi plan subplan-by-subplan. Mỗi subplan = 1 subagent (theo `workflow-process.mdc` Bước 2).

**Goal:** Migrate toàn bộ storefront sang `next-intl` với locale `vi` (mặc định) + `en`. Mọi text hiển thị qua `useTranslations` / `getTranslations`. URL `localePrefix: 'as-needed'`.

**Architecture:**
- Cài `next-intl@^4.0.0`, tạo `src/i18n/{routing,request,navigation}.ts`.
- Tạo `messages/vi.json` (13 namespace top-level) + `messages/en.json` (cùng key).
- Wire `createIntlMiddleware` vào `src/proxy.ts`.
- Migrate 8 subplan độc lập theo concern/ownership.
- Xoá `*_STATUS_LABEL` trong `lib/constants.ts`.

**Tech Stack:** Next 16.3.8 · React 19.2 · TS 5.x · `next-intl@^4.0.0` · Zustand 5 · TanStack Query 5.

**Spec:** [docs/superpowers/specs/2026-10-08-i18n-migration-design.md](../../superpowers/specs/2026-10-08-i18n-migration-design.md)

## Global Constraints

Từ spec mục 13 và rule `i18n.mdc`, `stack-versions.mdc`, `workflow-process.mdc`:

- KHÔNG hard-code text tiếng Việt/Anh trong component sau migration.
- KHÔNG cài lib i18n khác ngoài `next-intl`.
- KHÔNG dùng `/vi/` hay `/en/` cố định trong URL — dùng `localePrefix: 'as-needed'`.
- KHÔNG skip key khi thêm vào `vi.json` mà quên `en.json`.
- KHÔNG tự ý sửa `docs/CLAUDE.md` (read-only).
- KHÔNG push git.
- Lockfile: `package-lock.json` — không convert sang pnpm/yarn.
- Path alias `@/*` → `src/*` (đã cấu hình).
- Locale mặc định: `vi`.
- Verify sau mỗi subplan: `npx tsc --noEmit && npm run lint`.

> **Lưu ý testing** (RULING 2026-10-08 update): Theo quyết định user, viết test cho i18n migration nhưng **CHỈ Ở MỨC keys parity + namespace lookup**, KHÔNG snapshot/render test. Test cho `messages/vi.json` + `messages/en.json` parity (script node), và cho `src/lib/i18n/messages.ts` lookup helper. Vẫn **KHÔNG viết** test cho component migration (chỉ thay text).

> **Lưu ý PowerShell**: KHÔNG dùng `PowerShell -replace` với 3 đối số. Dùng `StrReplace` cho từng file, hoặc `Write` nguyên file. **KHÔNG** dùng loop `-replace`.

> **Lưu ý commit**: KHÔNG push. Commit local theo conventional commit `feat(i18n): <description>`. Mỗi task = 1 commit.

---

## Cấu trúc Plan → Subplan → Task

| # | Subplan | Concern | Dispatch đợt | Phụ thuộc |
|---|---|---|---|---|
| SP1 | **i18n Foundation** | Setup infrastructure | Đợt 1 (alone) | (none) |
| SP2 | **Auth i18n** | Login + Register | Đợt 2 (sau SP1) | SP1 |
| SP3 | **Layout shell i18n** | Header, Footer | Đợt 2 | SP1 |
| SP4 | **Flash-sale components i18n** | Countdown, StockProgressBar, SlotCard, QrCard, BuyModal, SlotDetailClient | Đợt 2 | SP1 |
| SP5 | **Cart i18n** | CartItemRow, CartView, cart/page | Đợt 2 | SP1 |
| SP6 | **Order i18n** | OrderCard, orders/page, orders/[orderCode]/page | Đợt 2 | SP1 |
| SP7 | **Product i18n** | products/page, ProductListClient, products/[id]/page, ProductDetailClient | Đợt 2 | SP1 |
| SP8 | **Misc pages i18n** | checkout, addresses, profile, flash-sales list | Đợt 3 (sau SP4) | SP1, SP4 |

**Dispatch chiến lược**:
- **Đợt 1**: 1 subagent = SP1 (Foundation)
- **Đợt 2**: 6 subagent song song trong 1 response = SP2, SP3, SP4, SP5, SP6, SP7
- **Đợt 3**: 1 subagent = SP8 (Misc pages, sau khi SP4 xong vì SP8 dùng Countdown từ SP4)

---

## Subplan 1: i18n Foundation

**Concern**: Setup i18n infrastructure (package, config, messages, layout wrapper, locale switcher, cleanup status labels).
**Files (10)**:
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/i18n/navigation.ts`
- Create: `messages/vi.json`, `messages/en.json`
- Create: `src/components/layout/LocaleSwitcher.tsx`
- Modify: `package.json` (thêm `next-intl`)
- Modify: `src/proxy.ts` (wire `createIntlMiddleware`)
- Modify: `src/app/layout.tsx` (wrap `<NextIntlClientProvider>`)
- Modify: `src/lib/constants.ts` (xoá `ORDER_STATUS_LABEL`, `SLOT_STATUS_LABEL`, `PAYMENT_STATUS_LABEL`)

**Tasks** (mỗi task 1 commit):

### Task 1.1: Cài `next-intl`
```bash
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
npm install next-intl@^4.0.0 --save-exact=false
```
Verify `package.json` có `"next-intl": "^4.x.x"`.

### Task 1.2: Tạo `src/i18n/routing.ts`
```ts
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['vi', 'en'],
  defaultLocale: 'vi',
  localePrefix: 'as-needed',
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### Task 1.3: Tạo `src/i18n/request.ts`
```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    (routing.locales as readonly string[]).includes(requested ?? '')
      ? (requested as 'vi' | 'en')
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

### Task 1.4: Tạo `messages/vi.json`
Dùng `Write` tool viết toàn bộ file một lần. **File phải có 13 key top-level**: `common`, `auth`, `home`, `product`, `cart`, `checkout`, `address`, `profile`, `order`, `payment`, `flash-sale`, `toast`, `error`.

Cấu trúc chi tiết từng namespace xem spec mục 7.1–7.15. Một số key quan trọng:
- `common.appName`, `common.loading`, `common.cancel`, `common.save`, `common.delete`, `common.edit`, `common.back`, `common.next`, `common.search`, `common.noData`, `common.redirecting`, `common.goShopping`, `common.continueShopping`, `common.languageSwitch`
- `common.header.brand`, `common.header.nav.flashSale|products|orders`, `common.header.cart|logout|login|register`
- `common.footer.shopping|account|support|profile|voucher|supportEmail|copyright`
- `auth.login.{title, subtitle, email, password, submit, noAccount, registerLink, success, errorGeneric}`
- `auth.register.{title, subtitle, fullName, email, phone, password, confirmPassword, submit, haveAccount, loginLink, success, errorGeneric}`
- `home.hero.{badge, title, subtitle, viewAll, browseProducts}`, `home.loadError`, `home.activeSection`, `home.upcomingSection`, `home.productCount` (plural)
- `product.list.{title, searchLabel, searchPlaceholder, categories, all, empty, pageOf, prev, next}`
- `product.detail.{notFound, variants, stock, outOfStock, addToCart, addSuccess, addError}`
- `cart.view.{title, loadError, empty, subtotal, summary, items, total, checkout, splitNote, clearAll}`
- `cart.item.{noImage, delete, deleteSuccess}`
- `checkout.{title, loading, emptyCart, addressSection, paymentSection, storesSection, zaloPay, cod, voucherLabel, voucherPlaceholder, voucherApply, voucherInvalid, voucherDiscount, selectAddress, noAddress, addAddress, submit, createdOrders, paymentFailed}`
- `address.list.{title, add, empty, default, setDefault, edit, delete, deleteSuccess, setDefaultSuccess, saveSuccess}`
- `address.form.{addTitle, editTitle, contactName, phone, province, district, ward, detail, isDefault, selectPlaceholder, validationError}`
- `profile.{title, info, email, fullName, phone, changePassword, oldPassword, newPassword, confirmNew, submit, logout, success, confirmMismatch}`
- `order.list.{title, empty}`
- `order.card.items` (plural)
- `order.detail.{title, loading, notFound, store, total, pendingPayment, expiresIn, scanQr, amount, cancel, cancelSuccess, cancelError}`
- `order.status.{PENDING_PAYMENT, PAID, CONFIRMED, SHIPPING, COMPLETED, CANCELLED_TIMEOUT, CANCELLED_USER}`
- `payment.status.{PENDING, SUCCESS, FAILED, EXPIRED, REFUNDED}`
- `flash-sale.list.{title, items}` (plural)
- `flash-sale.slot.{startsIn, endsIn, ended}`
- `flash-sale.status.{UPCOMING, ACTIVE, ENDED}`
- `flash-sale.countdown.{defaultLabel, paymentIn}`
- `flash-sale.stock.{sold, remaining}`
- `flash-sale.buyModal.{title, selectAddress, noAddress, addressBook, toAdd, quantity, maxQuantity, purchaseLimit, sku, stockOf, submit, selectAddressError, quantityError, success, errorGeneric, requireLogin, buyNow, outOfStock}`
- `flash-sale.slotDetail.{startsIn, endsIn}`
- `flash-sale.qr.{scanInstruction, order, method, methodZaloPay, amount, txCode, createdAt, refresh}`
- `toast.common.error`
- `error.{AUTH_001, AUTH_002, VALIDATION_ERROR, NOT_FOUND, CONFLICT, RATE_LIMIT, INTERNAL_ERROR, NETWORK_ERROR}`

### Task 1.5: Tạo `messages/en.json`
Mirror `vi.json` — cùng key, giá trị tiếng Anh.

Verify keys parity:
```bash
node -e "
const vi = JSON.parse(require('fs').readFileSync('messages/vi.json','utf8'));
const en = JSON.parse(require('fs').readFileSync('messages/en.json','utf8'));
function keys(o, p='') { return Object.entries(o).flatMap(([k,v]) => typeof v === 'object' && v !== null ? keys(v, p+k+'.') : [p+k]); }
const vk = keys(vi).sort(), ek = keys(en).sort();
console.log('vi:', vk.length, 'en:', ek.length);
const m1 = vk.filter(k => !ek.includes(k)), m2 = ek.filter(k => !vk.includes(k));
if (m1.length || m2.length) { console.error('MISMATCH', m1, m2); process.exit(1); }
console.log('OK: keys match');
"
```

### Task 1.6: Wire `src/proxy.ts`
```ts
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import type { NextRequest } from 'next/server';

const intlHandler = createIntlMiddleware(routing);

export default function proxy(req: NextRequest) {
  return intlHandler(req);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```
> Nếu file đã có logic bảo vệ route khác → giữ logic, bổ sung i18n middleware (xem plan cũ Task 36 Step 2b).

### Task 1.7: Update `src/app/layout.tsx`
```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Providers } from "@/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlashSale B2C - Sàn Flash Sale phân tán",
  description:
    "Đồ án Kỹ thuật Phần mềm - Sàn thương mại điện tử B2C tập trung Flash Sale chống Over-selling bằng Distributed Lock trên Redis.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

### Task 1.8: Tạo `src/components/layout/LocaleSwitcher.tsx`
```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next = locale === "vi" ? "en" : "vi";
  const label = locale === "vi" ? "English" : "Tiếng Việt";

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(() => router.replace(pathname, { locale: next }));
      }}
      disabled={isPending}
      className="rounded-md px-2 py-1 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {label}
    </button>
  );
}
```

### Task 1.9: Xoá `*_STATUS_LABEL` trong `src/lib/constants.ts`
Dùng `StrReplace` xoá 3 map:
```ts
export const ORDER_STATUS_LABEL: Record<string, string> = { ... };
export const SLOT_STATUS_LABEL: Record<string, string> = { ... };
export const PAYMENT_STATUS_LABEL: Record<string, string> = { ... };
```
Giữ nguyên `ROLE`, `DEFAULT_RESERVATION_TTL_SECONDS`, `VIETNAM_PROVINCES`. **KHÔNG commit task này riêng** — sẽ commit cùng lúc với các task khác hoặc để cuối SP1.

### Task 1.10: Commit + Verify cuối SP1
```bash
git add src/i18n/ messages/ src/proxy.ts src/app/layout.tsx src/components/layout/LocaleSwitcher.tsx src/lib/constants.ts package.json package-lock.json
git commit -m "feat(i18n): foundation - i18n config, locale switcher, status label cleanup"

npx tsc --noEmit
npm run lint
```
Expected: chỉ lỗi ở component dùng `*_STATUS_LABEL` (sẽ fix ở SP2-SP8).

---

## Subplan 2: Auth i18n

**Concern**: Login + Register forms/pages.
**Files (4)**:
- Modify: `src/app/(auth)/login/LoginForm.tsx`
- Modify: `src/app/(auth)/login/page.tsx`
- Modify: `src/app/(auth)/register/RegisterForm.tsx`
- Modify: `src/app/(auth)/register/page.tsx`

**Imports cần thay**:
- `import Link from "next/link"` → `import { Link } from "@/i18n/navigation"`
- `import { useRouter } from "next/navigation"` → `import { useRouter } from "@/i18n/navigation"`
- Thêm: `import { useTranslations } from "next-intl"`
- `metadata = {...}` → `generateMetadata()` async

**Tasks**:
### Task 2.1: Migrate `LoginForm.tsx`
- Thay "Mật khẩu", "Đăng nhập", "Chưa có tài khoản?", "Đăng ký ngay", "Đăng nhập thành công!", "Có lỗi xảy ra" → `t('auth.login.*')`

### Task 2.2: Migrate `login/page.tsx`
- `metadata` → `generateMetadata` async
- Title "Đăng nhập" → `t('auth.login.title')`
- Subtitle → `t('auth.login.subtitle')`

### Task 2.3: Migrate `RegisterForm.tsx`
- Thay các label "Họ tên", "Email", "Số điện thoại", "Mật khẩu", "Xác nhận mật khẩu", button "Đăng ký", link "Đăng nhập", toast "Đăng ký thành công!" → `t('auth.register.*')`

### Task 2.4: Thêm key `errorGeneric` vào `auth.register`
Dùng `StrReplace` thêm vào `messages/vi.json`:
```json
"register": {
  ...,
  "errorGeneric": "Có lỗi xảy ra"
}
```
Và `messages/en.json`:
```json
"register": {
  ...,
  "errorGeneric": "Something went wrong"
}
```

### Task 2.5: Migrate `register/page.tsx`
- Tương tự login/page.tsx

### Task 2.6: Commit + Verify
```bash
git add src/app/(auth)/ messages/
git commit -m "feat(i18n): migrate auth forms and pages"
npx tsc --noEmit
```

---

## Subplan 3: Layout shell i18n

**Concern**: Header (navigation + locale switcher), Footer.
**Files (2)**:
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Tasks**:
### Task 3.1: Migrate `Header.tsx`
- Import `Link` từ `@/i18n/navigation`
- Import `useTranslations` từ `next-intl`
- Import `LocaleSwitcher` từ `./LocaleSwitcher`
- Thay các text: "FlashSale" (brand), "Flash Sale", "Sản phẩm", "Đơn hàng", "Giỏ hàng" (aria-label), "Đăng xuất", "Đăng nhập", "Đăng ký" → `t('common.header.*')`
- Gắn `<LocaleSwitcher />` cạnh nav desktop

### Task 3.2: Migrate `Footer.tsx`
- Import `Link` từ `@/i18n/navigation`
- Import `useTranslations` từ `next-intl`
- Thay "Mua sắm", "Tài khoản", "Hỗ trợ", "Hồ sơ", "Liên hệ", copyright → `t('common.footer.*')`
- Các link nav trong footer (Flash Sale, Sản phẩm, Giỏ hàng, Hồ sơ, Đơn hàng, Sổ địa chỉ) dùng `defaultMessage` tạm vì messages chưa có key.

### Task 3.3: Commit + Verify
```bash
git add src/components/layout/
git commit -m "feat(i18n): migrate Header and Footer"
npx tsc --noEmit
```

---

## Subplan 4: Flash-sale components i18n

**Concern**: Toàn bộ flash-sale components (primitive + slot card + buy modal + QR card + slot detail).
**Files (7)**:
- Modify: `src/components/flash-sale/Countdown.tsx`
- Modify: `src/components/flash-sale/StockProgressBar.tsx`
- Modify: `src/components/flash-sale/SlotCard.tsx`
- Modify: `src/components/flash-sale/QrCard.tsx`
- Modify: `src/components/flash-sale/BuyModal.tsx`
- Modify: `src/app/flash-sales/[slotId]/SlotDetailClient.tsx`

**Tasks**:
### Task 4.1: Migrate `Countdown.tsx`
- Import `useTranslations` từ `next-intl`
- Default `label = t('flash-sale.countdown.defaultLabel')`

### Task 4.2: Migrate `StockProgressBar.tsx`
- Import `useTranslations` từ `next-intl`
- Thay "Đã bán X%", "Còn X/Y" → `t('flash-sale.stock.*')`

### Task 4.3: Migrate `SlotCard.tsx`
- Import `useTranslations`, `Link` từ `@/i18n/navigation`
- Thay `SLOT_STATUS_LABEL` → `t(\`flash-sale.status.\${slot.status}\`)`
- countdownLabel switch → `t('flash-sale.slot.startsIn|endsIn|ended')`
- "X sản phẩm" → `t('flash-sale.list.items', { count })`

### Task 4.4: Migrate `QrCard.tsx`
- Thay `PAYMENT_STATUS_LABEL` → `t(\`payment.status.\${payment.status}\`)`
- Row label → `t('flash-sale.qr.*')`
- "Làm mới trạng thái" → `t('flash-sale.qr.refresh')`
- Countdown label "Thanh toán trong" → `t('flash-sale.countdown.paymentIn')`

### Task 4.5: Migrate `BuyModal.tsx`
- Thay label, error toast, success toast, button, hint → `t('flash-sale.buyModal.*')`

### Task 4.6: Migrate `SlotDetailClient.tsx`
- countdownLabel → `t('flash-sale.slotDetail.startsIn|endsIn')`
- "Vui lòng đăng nhập để mua" → `t('flash-sale.buyModal.requireLogin')`
- "Mua ngay" → `t('flash-sale.buyModal.buyNow')`
- "Hết hàng" → `t('flash-sale.buyModal.outOfStock')`

### Task 4.7: Commit + Verify
```bash
git add src/components/flash-sale/ src/app/flash-sales/[slotId]/
git commit -m "feat(i18n): migrate flash-sale components and slot detail"
npx tsc --noEmit && npm run lint
```

---

## Subplan 5: Cart i18n

**Concern**: Cart row + view + page.
**Files (3)**:
- Modify: `src/components/cart/CartItemRow.tsx`
- Modify: `src/components/cart/CartView.tsx`
- Modify: `src/app/cart/page.tsx`

**Tasks**:
### Task 5.1: Migrate `CartItemRow.tsx`
- Thay "Xóa", toast success, "No image" → `t('cart.item.*')`
- Import `Link` từ `@/i18n/navigation`

### Task 5.2: Migrate `CartView.tsx`
- Thay các label: "Không tải được...", empty, "Tiếp tục mua sắm", "Tạm tính", "Tổng giỏ hàng", "Số lượng", "Tổng cộng", "Tiến hành thanh toán", "Đơn hàng sẽ được tách...", "Xóa toàn bộ giỏ hàng" → `t('cart.view.*')`

### Task 5.3: Migrate `cart/page.tsx`
- Title "Giỏ hàng của bạn" → `t('cart.view.title')`
- "Đang chuyển hướng..." → `t('common.redirecting')`

### Task 5.4: Commit + Verify
```bash
git add src/components/cart/ src/app/cart/
git commit -m "feat(i18n): migrate cart components and page"
npx tsc --noEmit
```

---

## Subplan 6: Order i18n

**Concern**: Order card + list page + detail page.
**Files (3)**:
- Modify: `src/components/order/OrderCard.tsx`
- Modify: `src/app/orders/page.tsx`
- Modify: `src/app/orders/[orderCode]/page.tsx`

**Tasks**:
### Task 6.1: Migrate `OrderCard.tsx`
- Thay `ORDER_STATUS_LABEL` → `t('order.status.*')`
- "X sản phẩm" → `t('order.card.items', { count })` (plural)

### Task 6.2: Migrate `orders/page.tsx`
- Title "Đơn hàng của tôi" → `t('order.list.title')`
- Empty msg → `t('order.list.empty')`
- "Mua sắm ngay" → `t('common.goShopping')`

### Task 6.3: Migrate `orders/[orderCode]/page.tsx`
- Title "Đơn #..." → `t('order.detail.title', { orderCode })`
- Loading, not found, store, total, "Chờ thanh toán", "Hết hạn sau", "Quét QR...", "Số tiền", "Hủy đơn", toast success/error → `t('order.detail.*')`
- `ORDER_STATUS_LABEL[order.status]` → `t('order.status.*')`
- `PAYMENT_STATUS_LABEL[payment.status]` → `t('payment.status.*')`

### Task 6.4: Commit + Verify
```bash
git add src/components/order/ src/app/orders/
git commit -m "feat(i18n): migrate order components and pages"
npx tsc --noEmit && npm run lint
```

---

## Subplan 7: Product i18n

**Concern**: Products list + detail pages.
**Files (4)**:
- Modify: `src/app/products/page.tsx`
- Modify: `src/app/products/ProductListClient.tsx`
- Modify: `src/app/products/[id]/page.tsx`
- Modify: `src/app/products/[id]/ProductDetailClient.tsx`

**Tasks**:
### Task 7.1: Migrate `products/page.tsx`
- `metadata` → `generateMetadata` async
- Title "Khám phá sản phẩm" → `t('product.list.title')`

### Task 7.2: Migrate `ProductListClient.tsx`
- Thay search label, placeholder, "Danh mục", "Tất cả", empty, "Trang X / Y", "Trước", "Sau" → `t('product.list.*')`
- "Đang tải..." → `t('common.loading')`

### Task 7.3: Migrate `products/[id]/page.tsx`
- File này gần như không có text — giữ nguyên (chỉ layout shell)

### Task 7.4: Migrate `ProductDetailClient.tsx`
- Loading, notFound, "Phiên bản", "Kho: X", "Hết hàng", "Thêm vào giỏ", toast → `t('product.detail.*')`

### Task 7.5: Commit + Verify
```bash
git add src/app/products/
git commit -m "feat(i18n): migrate product list and detail pages"
npx tsc --noEmit
```

---

## Subplan 8: Misc pages i18n

**Concern**: Checkout, Addresses, Profile, Flash-sales list.
**Files (4)**:
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/addresses/page.tsx`
- Modify: `src/app/profile/page.tsx`
- Modify: `src/app/flash-sales/page.tsx`

**Tasks**:
### Task 8.1: Migrate `checkout/page.tsx`
- Thay title, sections, button, options, voucher, error, empty cart, success → `t('checkout.*')`

### Task 8.2: Migrate `addresses/page.tsx`
- Thay title, button, label, modal text, success toast → `t('address.list.*')`, `t('address.form.*')`, `t('common.*')`

### Task 8.3: Migrate `profile/page.tsx`
- Thay title, label, button, error → `t('profile.*')`

### Task 8.4: Migrate `flash-sales/page.tsx`
- `metadata` → `generateMetadata` async
- Title "Tất cả Flash Sale" → `t('flash-sale.list.title')`
- `SLOT_STATUS_LABEL` → `t('flash-sale.status.*')`
- Countdown label → `t('flash-sale.slot.startsIn|endsIn')`
- "X sản phẩm" → `t('flash-sale.list.items', { count })`

### Task 8.5: Commit + Verify
```bash
git add src/app/checkout/ src/app/addresses/ src/app/profile/ src/app/flash-sales/page.tsx
git commit -m "feat(i18n): migrate checkout, addresses, profile, flash-sales list"
npx tsc --noEmit && npm run lint
```

---

## Final Verification (sau SP1-SP8)

### Verify 1: Grep hard-code text còn sót
```bash
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
grep -rn --include="*.tsx" -E "(Đăng nhập|Đăng ký|Mật khẩu|Sản phẩm|Giỏ hàng|Đơn hàng|Tài khoản|Hết hàng|Mua ngay|Đặt hàng|Thanh toán)" src/app src/components 2>/dev/null | grep -v "messages/vi.json"
```
Expected: 0 dòng.

### Verify 2: Grep `*_STATUS_LABEL` còn sót
```bash
grep -rn --include="*.ts*" "ORDER_STATUS_LABEL\|SLOT_STATUS_LABEL\|PAYMENT_STATUS_LABEL" src/ 2>/dev/null
```
Expected: 0 dòng.

### Verify 3: Build cuối
```bash
npm run build
```
Expected: build pass.

### Verify 4: Smoke test
- `/` (vi) → hero tiếng Việt
- `/en/` (en) → hero tiếng Anh
- `/login` (vi) → label Việt
- `/en/login` (en) → label Anh
- LocaleSwitcher đổi locale OK

---

## Rulings & Decisions

| # | Decision | Lý do |
|---|---|---|
| 1 | Không viết test cho phase này | `testing-required.mdc` mục "Khi nào KHÔNG cần test" + text refactor thuần |
| 2 | Footer dùng `defaultMessage` cho nav keys chưa có | Tránh mở rộng scope messages |
| 3 | `localePrefix: 'as-needed'` | User chọn override `never` cũ |
| 4 | SP8 dispatch sau SP4 vì dùng Countdown | Phụ thuộc output |
| 5 | 1 subagent = 1 subplan (rule mới `workflow-process.mdc`) | User cập nhật rule |
| 6 | Commit atomic, 1 task = 1 commit | `git-workflow.mdc` |
| 7 | KHÔNG push | `git-workflow.mdc` |
| 8 | KHÔNG sửa `docs/CLAUDE.md` | `docs-sync.mdc` read-only |

## Báo cáo format (Bước 6)

Sau khi tất cả subplan done, output báo cáo theo format AGENTS.md:

```text
## Changes
- Phase 1 i18n migration: 30+ file migrated, 2 messages files (vi + en, 13 namespace top-level).
- Thêm next-intl@^4.0.0 vào package.json.
- Tạo src/i18n/{routing,request,navigation}.ts, src/components/layout/LocaleSwitcher.tsx.
- Wire createIntlMiddleware vào src/proxy.ts.
- Wrap NextIntlClientProvider trong src/app/layout.tsx.
- Xoá ORDER_STATUS_LABEL, SLOT_STATUS_LABEL, PAYMENT_STATUS_LABEL trong lib/constants.ts.

## Implementation
- 8 subplan, mỗi subplan dispatch 1 subagent theo rule workflow-process.mdc.
- Mỗi task = 1 commit riêng (atomic).
- Locale switcher đơn giản (button), dùng router.replace(pathname, { locale }).
- localePrefix: 'as-needed' → vi mặc định không prefix, en có prefix /en/.

## API / WS
- (không có)

## Tests
- Build: npm run build → PASS
- Lint: npm run lint → PASS
- TS: npx tsc --noEmit → PASS
- Manual smoke: 5 route (vi + en) OK

## Notes
- KHÔNG push (theo rule git-workflow.mdc).
- KHÔNG sửa docs/CLAUDE.md (read-only).
- Footer dùng defaultMessage cho nav keys chưa có — phase sau sẽ thêm keys.
```