# Design — i18n Migration (Phase 1 of full source migration)

> **Spec cho Phase 1 trong dự án "sửa lại source theo rule"** đã chốt với user.
> Các phase sau (design tokens + shadcn, layer → features, ...) sẽ có spec riêng.
>
> Last reviewed: 2026-10-08 · Stack: Next 16.3.8 · React 19.2 · TS 5.x · Tailwind 4.x

## 1. Mục tiêu

Migrate toàn bộ storefront hiện tại sang dùng `next-intl` với locale `vi` (mặc định) + `en`. Mọi text hiển thị phải qua `useTranslations` / `getTranslations`. Hard-code text tiếng Việt/Anh trong component **bị cấm** sau phase này.

**Phạm vi (đã chốt với user)**:
- Locale bắt buộc: `vi` (mặc định) + `en`.
- URL: `localePrefix: 'as-needed'` → `vi` mặc định KHÔNG prefix (`/login`), `en` có prefix (`/en/login`).
- Scope file: tất cả page trong `src/app/` (storefront) + `src/components/layout/` + `src/components/flash-sale/` + `src/components/cart/` + `src/components/order/`.
- Cài `next-intl` vào `package.json`.
- Bổ sung locale switcher đơn giản (link chuyển `/en/...` ↔ `/...`).

## 2. Lý do & Bối cảnh

- Repo hiện có ~25 file JSX với text tiếng Việt hard-code trong component (xem audit ở mục 5).
- Rule `i18n.mdc` (Source of Truth #1 cho concern i18n) **đã rõ** từ trước nhưng chưa được áp dụng — đây là vi phạm lớn nhất.
- Backend **KHÔNG cần sửa** — i18n là concern frontend thuần (text UI, không phải data DTO).
- 3 phase tiếp theo (design tokens, layer, testing) sẽ dựa trên nền i18n ổn định.

## 3. Stack & Cài đặt

### 3.1. Package mới

| Package | Version | Lý do |
|---|---|---|
| `next-intl` | `^4.x` (hoặc latest 4+) | Rule `stack-versions.mdc` đã chốt |

### 3.2. Thêm vào `package.json`

```json
"dependencies": {
  "next-intl": "^4.0.0"
}
```

### 3.3. KHÔNG cài thêm

- KHÔNG `react-i18next`, `lingui`, `formatjs` (rule `i18n.mdc` mục 10).
- KHÔNG thêm lib quản lý locale storage (giữ cookie mặc định của next-intl).

## 4. Cấu trúc file mới

```
src/i18n/
├── request.ts          # getRequestConfig — load messages theo locale
├── routing.ts          # defineRouting({ locales, defaultLocale, localePrefix })
└── navigation.ts       # createNavigation() — Link, useRouter, usePathname, redirect

messages/
├── vi.json             # toàn bộ text Việt hiện tại + thêm key ENUM/error
└── en.json             # bản dịch Anh tương ứng

# next-intl middleware hook vào proxy hiện tại
src/proxy.ts            # wire createMiddleware(next-intl) vào Next 16 proxy
```

> Lưu ý: repo hiện có `src/proxy.ts` (Next 16 đổi tên từ `middleware.ts` → `proxy.ts`).
> `createMiddleware` từ `next-intl` export default → alias trong `src/proxy.ts`.

## 5. Cấu hình

### 5.1. `src/i18n/routing.ts`

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

### 5.2. `src/i18n/request.ts`

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

### 5.3. `src/proxy.ts` (Next 16 thay cho middleware.ts)

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

### 5.4. `next.config.ts` (alias `@/i18n/...` đã có sẵn qua tsconfig path alias)

Không cần sửa — `@/*` đã trỏ về `src/*`.

## 6. Namespace Convention

Theo `docs/i18n-convention.md` mục 1, mở rộng cho scope all_pages:

| Component / Feature | Namespace | Owner |
|---|---|---|
| App-wide (loading, retry, cancel...) | `common` | mọi component |
| App name, footer text | `common.app`, `common.footer` | Footer, metadata |
| Header | `common.header` | Header |
| LoginForm | `auth.login` | LoginForm |
| RegisterForm | `auth.register` | RegisterForm |
| Home (hero, section) | `home` | `app/page.tsx` |
| ProductListClient, ProductDetailClient | `product.list`, `product.detail` | product pages |
| ProductCard | `product.card` | ProductListClient |
| CartView, CartItemRow | `cart.view`, `cart.item` | cart pages |
| Checkout | `checkout` | checkout page |
| AddressBook, AddressForm | `address.list`, `address.form` | addresses page |
| Profile | `profile` | profile page |
| OrdersPage, OrderCard, OrderDetailPage | `order.list`, `order.card`, `order.detail` | orders pages |
| FlashSaleSlot, FlashSalesPage | `flash-sale.list`, `flash-sale.slot` | flash-sales pages |
| SlotDetailClient, ItemCard | `flash-sale.slotDetail` | slot detail page |
| BuyModal | `flash-sale.buyModal` | BuyModal |
| Countdown | `flash-sale.countdown` | Countdown (label) |
| StockProgressBar | `flash-sale.stock` | StockProgressBar |
| QrCard | `flash-sale.qr` | QrCard |
| Toast (variants) | `toast` | toast hook + viewport |
| Order status enum | `order.status` | StatusBadge |
| Payment status enum | `payment.status` | StatusBadge |
| Slot status enum | `flash-sale.status` | StatusBadge |
| Error codes | `error` | ApiError handler |

## 7. Messages — Cấu trúc `messages/vi.json` & `en.json`

### 7.1. Section `common`

```json
{
  "common": {
    "appName": "Flash Sale B2C",
    "appTagline": "Sàn Flash Sale B2C chống Over-selling",
    "loading": "Đang tải...",
    "retry": "Thử lại",
    "cancel": "Huỷ",
    "confirm": "Xác nhận",
    "save": "Lưu",
    "delete": "Xoá",
    "edit": "Sửa",
    "back": "Quay lại",
    "next": "Tiếp theo",
    "search": "Tìm kiếm",
    "noData": "Không có dữ liệu",
    "redirecting": "Đang chuyển hướng...",
    "goShopping": "Mua sắm ngay",
    "continueShopping": "Tiếp tục mua sắm →",
    "languageSwitch": "English"
  }
}
```

(`en.json` tương ứng: `"appName": "Flash Sale B2C"`, `"loading": "Loading..."`, ...)

### 7.2. Section `common.header`

```json
{
  "common": {
    "header": {
      "brand": "FlashSale",
      "nav": {
        "flashSale": "Flash Sale",
        "products": "Sản phẩm",
        "orders": "Đơn hàng"
      },
      "cart": "Giỏ hàng",
      "logout": "Đăng xuất",
      "login": "Đăng nhập",
      "register": "Đăng ký"
    }
  }
}
```

### 7.3. Section `common.footer`

```json
{
  "common": {
    "footer": {
      "shopping": "Mua sắm",
      "account": "Tài khoản",
      "support": "Hỗ trợ",
      "profile": "Hồ sơ",
      "voucher": "Kho voucher",
      "supportEmail": "Liên hệ: support@flashsale.utc2",
      "copyright": "© 2026 UTC2"
    }
  }
}
```

### 7.4. Section `auth.login` & `auth.register`

```json
{
  "auth": {
    "login": {
      "title": "Đăng nhập",
      "subtitle": "Chào mừng bạn quay lại với FlashSale B2C",
      "email": "Email",
      "password": "Mật khẩu",
      "submit": "Đăng nhập",
      "noAccount": "Chưa có tài khoản?",
      "registerLink": "Đăng ký ngay",
      "success": "Đăng nhập thành công!",
      "errorGeneric": "Có lỗi xảy ra"
    },
    "register": {
      "title": "Tạo tài khoản",
      "subtitle": "Đăng ký để tham gia Flash Sale trong vài giây",
      "fullName": "Họ tên",
      "email": "Email",
      "phone": "Số điện thoại",
      "password": "Mật khẩu",
      "confirmPassword": "Xác nhận mật khẩu",
      "submit": "Đăng ký",
      "haveAccount": "Đã có tài khoản?",
      "loginLink": "Đăng nhập",
      "success": "Đăng ký thành công!"
    }
  }
}
```

### 7.5. Section `home`

```json
{
  "home": {
    "hero": {
      "badge": "HOT",
      "title": "Flash Sale giờ vàng - giá sốc mỗi ngày",
      "subtitle": "Đặt chỗ kho trong 5 phút, thanh toán QR ZaloPay hoặc COD. Hàng nghìn người cùng lúc nhấn Mua ngay - không lo hết hàng.",
      "viewAll": "Xem tất cả Flash Sale",
      "browseProducts": "Sản phẩm thường"
    },
    "loadError": "Không tải được danh sách Flash Sale. Vui lòng kiểm tra kết nối tới backend.",
    "activeSection": "ĐANG DIỄN RA",
    "upcomingSection": "Sắp diễn ra",
    "productCount": "{count, plural, =0 {Không có sản phẩm} =1 {1 sản phẩm} other {# sản phẩm}}"
  }
}
```

### 7.6. Section `product.list` & `product.detail`

```json
{
  "product": {
    "list": {
      "title": "Khám phá sản phẩm",
      "searchLabel": "Tìm kiếm",
      "searchPlaceholder": "Nhập tên sản phẩm...",
      "categories": "Danh mục",
      "all": "Tất cả",
      "empty": "Không có sản phẩm phù hợp.",
      "pageOf": "Trang {page} / {total}",
      "prev": "Trước",
      "next": "Sau"
    },
    "detail": {
      "notFound": "Không tìm thấy sản phẩm.",
      "variants": "Phiên bản",
      "stock": "Kho: {count}",
      "outOfStock": "Hết hàng",
      "addToCart": "Thêm vào giỏ",
      "addSuccess": "Đã thêm vào giỏ hàng",
      "addError": "Thêm giỏ hàng thất bại"
    }
  }
}
```

### 7.7. Section `cart.*`

```json
{
  "cart": {
    "view": {
      "title": "Giỏ hàng của bạn",
      "loadError": "Không tải được giỏ hàng. Vui lòng thử lại.",
      "empty": "Giỏ hàng của bạn đang trống.",
      "subtotal": "Tạm tính",
      "summary": "Tổng giỏ hàng",
      "items": "Số lượng",
      "total": "Tổng cộng",
      "checkout": "Tiến hành thanh toán",
      "splitNote": "Đơn hàng sẽ được tách theo từng gian hàng khi thanh toán.",
      "clearAll": "Xóa toàn bộ giỏ hàng"
    },
    "item": {
      "noImage": "No image",
      "delete": "Xóa",
      "deleteSuccess": "Đã xóa sản phẩm khỏi giỏ"
    }
  }
}
```

### 7.8. Section `checkout`

```json
{
  "checkout": {
    "title": "Thanh toán",
    "loading": "Đang tải...",
    "emptyCart": "Giỏ hàng trống.",
    "addressSection": "Địa chỉ giao hàng",
    "paymentSection": "Phương thức thanh toán",
    "storesSection": "Đơn hàng theo cửa hàng",
    "zaloPay": "ZaloPay QR",
    "cod": "Thanh toán khi nhận (COD)",
    "voucherLabel": "Mã giảm giá",
    "voucherPlaceholder": "VD: SALE10",
    "voucherApply": "Áp dụng",
    "voucherInvalid": "Mã không hợp lệ",
    "voucherDiscount": "Đã giảm: -{amount}",
    "selectAddress": "Vui lòng chọn địa chỉ giao hàng",
    "noAddress": "Bạn chưa có địa chỉ.",
    "addAddress": "Thêm địa chỉ",
    "submit": "Đặt hàng",
    "createdOrders": "Đã tạo {count} đơn hàng",
    "paymentFailed": "Thanh toán thất bại"
  }
}
```

### 7.9. Section `address.*`

```json
{
  "address": {
    "list": {
      "title": "Sổ địa chỉ",
      "add": "+ Thêm địa chỉ",
      "empty": "Bạn chưa có địa chỉ nào.",
      "default": "Mặc định",
      "setDefault": "Đặt mặc định",
      "edit": "Sửa",
      "delete": "Xóa",
      "deleteSuccess": "Đã xóa địa chỉ",
      "setDefaultSuccess": "Đã đặt làm mặc định",
      "saveSuccess": "Đã lưu địa chỉ"
    },
    "form": {
      "addTitle": "Thêm địa chỉ mới",
      "editTitle": "Sửa địa chỉ",
      "contactName": "Người nhận",
      "phone": "Số điện thoại",
      "province": "Tỉnh/Thành",
      "district": "Quận/Huyện",
      "ward": "Phường/Xã",
      "detail": "Địa chỉ chi tiết (số nhà, đường)",
      "isDefault": "Đặt làm mặc định",
      "selectPlaceholder": "-- Chọn --",
      "validationError": "Vui lòng kiểm tra thông tin"
    }
  }
}
```

### 7.10. Section `profile`

```json
{
  "profile": {
    "title": "Tài khoản của tôi",
    "info": "Thông tin cá nhân",
    "email": "Email",
    "fullName": "Họ tên",
    "phone": "Số điện thoại",
    "changePassword": "Đổi mật khẩu",
    "oldPassword": "Mật khẩu hiện tại",
    "newPassword": "Mật khẩu mới",
    "confirmNew": "Xác nhận mật khẩu mới",
    "submit": "Đổi mật khẩu",
    "logout": "Đăng xuất",
    "success": "Đổi mật khẩu thành công",
    "confirmMismatch": "Mật khẩu xác nhận không khớp"
  }
}
```

### 7.11. Section `order.*`

```json
{
  "order": {
    "list": {
      "title": "Đơn hàng của tôi",
      "empty": "Bạn chưa có đơn hàng nào."
    },
    "card": {
      "items": "{count, plural, =0 {Không có sản phẩm} =1 {1 sản phẩm} other {# sản phẩm}}"
    },
    "detail": {
      "title": "Đơn #{orderCode}",
      "loading": "Đang tải đơn hàng...",
      "notFound": "Không tìm thấy đơn hàng.",
      "store": "Cửa hàng",
      "total": "Tổng",
      "pendingPayment": "Chờ thanh toán",
      "expiresIn": "Hết hạn sau",
      "scanQr": "Quét QR ZaloPay để hoàn tất",
      "amount": "Số tiền",
      "cancel": "Hủy đơn",
      "cancelSuccess": "Đã hủy đơn",
      "cancelError": "Hủy thất bại"
    },
    "status": {
      "PENDING_PAYMENT": "Chờ thanh toán",
      "PAID": "Đã thanh toán",
      "CONFIRMED": "Đã xác nhận",
      "SHIPPING": "Đang giao",
      "COMPLETED": "Hoàn thành",
      "CANCELLED_TIMEOUT": "Đã huỷ – quá hạn thanh toán",
      "CANCELLED_USER": "Đã huỷ"
    }
  }
}
```

### 7.12. Section `payment.status`

```json
{
  "payment": {
    "status": {
      "PENDING": "Đang chờ",
      "SUCCESS": "Thành công",
      "FAILED": "Thất bại",
      "EXPIRED": "Hết hạn",
      "REFUNDED": "Đã hoàn tiền"
    }
  }
}
```

### 7.13. Section `flash-sale.*`

```json
{
  "flash-sale": {
    "list": {
      "title": "Tất cả Flash Sale",
      "items": "{count, plural, =0 {0 sản phẩm} =1 {1 sản phẩm} other {# sản phẩm}}"
    },
    "slot": {
      "startsIn": "Bắt đầu sau",
      "endsIn": "Kết thúc sau",
      "ended": "Đã kết thúc"
    },
    "status": {
      "UPCOMING": "Sắp diễn ra",
      "ACTIVE": "Đang diễn ra",
      "ENDED": "Đã kết thúc"
    },
    "countdown": {
      "defaultLabel": "Còn",
      "paymentIn": "Thanh toán trong"
    },
    "stock": {
      "sold": "Đã bán {percent}",
      "remaining": "Còn {remaining}/{allocated}"
    },
    "buyModal": {
      "title": "Mua ngay Flash Sale",
      "selectAddress": "-- Chọn địa chỉ --",
      "noAddress": "Bạn chưa có địa chỉ. Vui lòng vào",
      "addressBook": "Sổ địa chỉ",
      "toAdd": "để thêm.",
      "quantity": "Số lượng",
      "maxQuantity": "Tối đa {max} sản phẩm",
      "purchaseLimit": "Giới hạn mua: {limit} sản phẩm/khách",
      "sku": "SKU",
      "stockOf": "Còn {available}/{allocated}",
      "submit": "Đặt giữ chỗ (5 phút)",
      "selectAddressError": "Vui lòng chọn địa chỉ nhận hàng",
      "quantityError": "Số lượng tối đa là {max}",
      "success": "Đặt hàng thành công! Chuyển sang trang thanh toán.",
      "errorGeneric": "Đặt hàng thất bại, thử lại sau",
      "requireLogin": "Vui lòng đăng nhập để mua",
      "buyNow": "Mua ngay",
      "outOfStock": "Hết hàng"
    },
    "slotDetail": {
      "startsIn": "Bắt đầu sau",
      "endsIn": "Kết thúc sau"
    },
    "qr": {
      "scanInstruction": "Quét mã ZaloPay",
      "order": "Đơn hàng",
      "method": "Phương thức",
      "methodZaloPay": "ZaloPay QR",
      "amount": "Số tiền",
      "txCode": "Mã GD",
      "createdAt": "Tạo lúc",
      "refresh": "Làm mới trạng thái"
    }
  }
}
```

### 7.14. Section `toast`

```json
{
  "toast": {
    "common": {
      "error": "Đã có lỗi xảy ra"
    }
  }
}
```

### 7.15. Section `error` (mapping `ApiError.code`)

Theo `docs/i18n-convention.md` mục 4 — giữ nguyên mapping hiện tại.

```json
{
  "error": {
    "AUTH_001": "Phiên đăng nhập đã hết hạn",
    "AUTH_002": "Vui lòng đăng nhập lại",
    "VALIDATION_ERROR": "Dữ liệu không hợp lệ",
    "NOT_FOUND": "Không tìm thấy",
    "CONFLICT": "Xung đột dữ liệu",
    "RATE_LIMIT": "Bạn thao tác quá nhanh",
    "INTERNAL_ERROR": "Lỗi hệ thống, vui lòng thử lại sau",
    "NETWORK_ERROR": "Lỗi mạng, kiểm tra kết nối"
  }
}
```

## 8. Thay đổi theo file

### 8.1. File MỚI (tạo)

| File | Mục đích |
|---|---|
| `src/i18n/routing.ts` | `defineRouting` + `createNavigation` |
| `src/i18n/request.ts` | `getRequestConfig` |
| `src/i18n/navigation.ts` | export Link/redirect/usePathname/useRouter |
| `messages/vi.json` | Toàn bộ key section 7.1–7.15 bằng Việt |
| `messages/en.json` | Toàn bộ key tương ứng bằng Anh |
| `src/components/layout/LocaleSwitcher.tsx` | Link "English"/"Tiếng Việt" chuyển locale |

### 8.2. File SỬA

| File | Thay đổi |
|---|---|
| `package.json` | Thêm `"next-intl": "^4.0.0"` |
| `src/proxy.ts` | Alias `createIntlMiddleware` thay vì (hoặc bổ sung) handler cũ. **Lưu ý**: cần giữ logic hiện có (nếu có) — kiểm tra khi code |
| `src/app/layout.tsx` | Bọc `<NextIntlClientProvider>` trong `<Providers>`; set `<html lang>` theo locale |
| `src/providers/Providers.tsx` | Bọc `<NextIntlClientProvider locale={locale} messages={messages}>` nếu cần |
| `src/app/(auth)/login/page.tsx` | metadata dùng `generateMetadata` async; title/subtitle → `t('auth.login.title')` |
| `src/app/(auth)/login/LoginForm.tsx` | Label, button, error → `useTranslations('auth.login')` |
| `src/app/(auth)/register/page.tsx` | Tương tự login page |
| `src/app/(auth)/register/RegisterForm.tsx` | Tương tự LoginForm |
| `src/app/page.tsx` | `getTranslations('home')` cho hero, sections, button |
| `src/app/products/page.tsx` | title qua `getTranslations('product.list')` |
| `src/app/products/ProductListClient.tsx` | search, categories, pagination, empty |
| `src/app/products/[id]/page.tsx` | wrap `getTranslations` (nếu cần) |
| `src/app/products/[id]/ProductDetailClient.tsx` | button, label, error |
| `src/app/cart/page.tsx` | title, redirect msg |
| `src/components/cart/CartView.tsx` | empty, summary, button, error |
| `src/components/cart/CartItemRow.tsx` | "Xóa", toast success, "No image" |
| `src/app/checkout/page.tsx` | title, sections, button, options, voucher, error |
| `src/app/addresses/page.tsx` | title, button, label, modal, success toast |
| `src/app/profile/page.tsx` | title, label, button, error |
| `src/app/orders/page.tsx` | title, empty |
| `src/app/orders/[orderCode]/page.tsx` | title, label, button, badge, success/error |
| `src/components/order/OrderCard.tsx` | item count plural |
| `src/app/flash-sales/page.tsx` | title, items count |
| `src/app/flash-sales/[slotId]/page.tsx` | (chủ yếu là layout shell — không cần đổi nhiều) |
| `src/app/flash-sales/[slotId]/SlotDetailClient.tsx` | countdown label, button, error |
| `src/components/flash-sale/Countdown.tsx` | prop `label` default → `t('flash-sale.countdown.defaultLabel')` (cần client) |
| `src/components/flash-sale/SlotCard.tsx` | countdownLabel switch, status label |
| `src/components/flash-sale/StockProgressBar.tsx` | "Đã bán X%", "Còn X/Y" |
| `src/components/flash-sale/BuyModal.tsx` | title, label, button, error toast |
| `src/components/flash-sale/QrCard.tsx` | row label, button |
| `src/components/layout/Header.tsx` | nav, button, aria-label, "Giỏ hàng" |
| `src/components/layout/Footer.tsx` | section, link, copyright, contact |
| `src/lib/constants.ts` | `ORDER_STATUS_LABEL`, `SLOT_STATUS_LABEL`, `PAYMENT_STATUS_LABEL` → **xoá**. Thay bằng `STATUS_VARIANT` map (variant → badge variant, không phải label). |
| `src/components/order/OrderCard.tsx` | dùng `t('order.status.XXX')` thay `ORDER_STATUS_LABEL` |
| `src/app/orders/[orderCode]/page.tsx` | tương tự |
| `src/components/flash-sale/SlotCard.tsx` | tương tự |
| `src/app/flash-sales/page.tsx` | tương tự |
| `src/app/page.tsx` | tương tự |
| `src/components/flash-sale/QrCard.tsx` | tương tự |

### 8.3. File KHÔNG đổi

- `src/hooks/useToast.ts`, `src/hooks/useToastFn.ts` — toast hook nhận `message: string` là OK. Caller truyền `t('...')` đã dịch.
- `src/components/ui/Toast.tsx` — nhận `message: string`, không cần đổi.
- `src/types/**`, `src/lib/api/**`, `src/stores/**` — pure data, không có text UI.

## 9. Locale Switcher (`LocaleSwitcher.tsx`)

Đặt ở Header (góc phải, cạnh login). Dùng cookie `NEXT_LOCALE` (next-intl tự set khi user truy cập `/en/...`).

```tsx
'use client';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const next = locale === 'vi' ? 'en' : 'vi';
  const label = locale === 'vi' ? 'English' : 'Tiếng Việt';

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

→ Component gắn vào `Header.tsx` cạnh nav desktop và mobile.

## 10. Mapping `*_STATUS_LABEL` → i18n

`src/lib/constants.ts` hiện có 3 map hard-code. Sau migration:

| Cũ | Mới |
|---|---|
| `ORDER_STATUS_LABEL[status]` | `t(\`order.status.${status}\`)` |
| `SLOT_STATUS_LABEL[status]` | `t(\`flash-sale.status.${status}\`)` |
| `PAYMENT_STATUS_LABEL[status]` | `t(\`payment.status.${status}\`)` |

→ **Xoá** 3 const map trong `constants.ts`. Giữ lại `ROLE`, `DEFAULT_RESERVATION_TTL_SECONDS`, `VIETNAM_PROVINCES` (không phải enum backend).

**Variant map** (status → Badge variant) giữ nguyên trong `constants.ts` hoặc chuyển sang từng component — quyết định giữ trong `constants.ts` vì map logic, không phải text.

## 11. Quy trình triển khai

### Phase A — Foundation (1 agent, tuần tự)

1. `npm install next-intl@latest`
2. Tạo `src/i18n/{routing,request,navigation}.ts`
4. Tạo `messages/vi.json` (đầy đủ 15 section)
5. Tạo `messages/en.json` (đầy đủ 15 section, key giống `vi.json`)
6. Cập nhật `src/proxy.ts` để wire `createIntlMiddleware`
7. Cập nhật `src/app/layout.tsx` (thêm `<NextIntlClientProvider>`, `<html lang={locale}>`)
8. Cập nhật `src/providers/Providers.tsx` nếu cần
9. Xoá `ORDER_STATUS_LABEL`, `SLOT_STATUS_LABEL`, `PAYMENT_STATUS_LABEL` trong `lib/constants.ts`

### Phase B — Component migration

Đánh giá song song (xem workflow-process.mdc bước 2). Nhóm file theo dependency:

**Group 1 — Independent** (không import nhau, có thể song song):
- `Header.tsx` + `Footer.tsx` → layout shell
- `Countdown.tsx` + `StockProgressBar.tsx` → primitive flash-sale
- `CartItemRow.tsx` + `OrderCard.tsx` → list row primitive
- `LoginForm.tsx` + `RegisterForm.tsx` → auth forms
- `LocaleSwitcher.tsx` (mới)

**Group 2 — Phụ thuộc Group 1** (sau khi Group 1 xong):
- `CartView.tsx` (dùng CartItemRow đã i18n)
- `BuyModal.tsx` + `QrCard.tsx` + `SlotCard.tsx` (dùng Countdown, StockProgressBar)
- `SlotDetailClient.tsx` (dùng Countdown, StockProgressBar, BuyModal)

**Group 3 — Page** (sau khi Group 1 + 2 xong):
- `page.tsx` (home), `login/page.tsx`, `register/page.tsx`, `products/page.tsx`, `products/ProductListClient.tsx`, `products/[id]/ProductDetailClient.tsx`, `products/[id]/page.tsx`
- `cart/page.tsx`, `checkout/page.tsx`, `addresses/page.tsx`, `profile/page.tsx`
- `orders/page.tsx`, `orders/[orderCode]/page.tsx`
- `flash-sales/page.tsx`, `flash-sales/[slotId]/page.tsx`

### Phase C — Verify

- `npx tsc --noEmit` — không lỗi
- `npm run lint` — không lỗi
- `npm run build` — pass
- Manual test 3 locale: `/`, `/en`, `/login`, `/en/login`, chuyển locale từ switcher

## 12. Testing (theo `testing-required.mdc`)

**KHÔNG viết test cho phase này** vì:
- i18n migration là thay đổi text thuần (mapping key → value), không thêm logic.
- Component đã có test (nếu có trong repo). Nếu có, cần update mock `useTranslations` / `next-intl`.
- Theo rule mục "Khi nào KHÔNG cần test": file config không chứa logic chỉ export constant.

> Lưu ý: nếu repo CÓ test hiện tại cho các component này → cần update mock trước, không tự ý skip.

## 13. KHÔNG (theo rule i18n.mdc)

- KHÔNG hard-code text trong component sau khi migration xong.
- KHÔNG cài lib i18n khác.
- KHÔNG để placeholder text tiếng Anh nếu locale là `vi`.
- KHÔNG skip key khi thêm vào `vi.json` mà quên `en.json`.
- KHÔNG tự ý sửa `docs/CLAUDE.md` (read-only).
- KHÔNG push git.

## 14. Rủi ro & Đối phó

| Rủi ro | Đối phó |
|---|---|
| `next-intl` chưa support Next 16 proxy.ts | Đã verify: `next-intl` v4 hỗ trợ Next 13+. Với Next 16 dùng `src/proxy.ts` (Next 16 đổi tên) → wrap `createMiddleware` trong default export. |
| Hydration mismatch khi dùng locale trong metadata | Dùng `generateMetadata` async + `getTranslations`. |
| Component server vs client | Rule đã chốt: server component → `getTranslations`, client → `useTranslations`. |
| Metadata title i18n | `generateMetadata` async + `getTranslations` (xem i18n.mdc). |
| `SlotCard`, `OrderCard` render ở cả server và client | Status badge render ở cả 2 → dùng `useTranslations` (client) hoặc `getTranslations` (server). Mix OK nếu label là data-driven. |

## 15. Definition of Done

- [ ] `next-intl` đã cài và `package.json` updated.
- [ ] `src/i18n/{routing,request,navigation}.ts` tồn tại.
- [ ] `messages/vi.json` + `messages/en.json` có **đầy đủ 15 section**, key giống nhau 100%.
- [ ] `src/proxy.ts` wire `createIntlMiddleware`.
- [ ] `src/app/layout.tsx` có `<NextIntlClientProvider>`, `<html lang>` theo locale.
- [ ] **0 file** trong scope còn text tiếng Việt/Anh hard-code (kiểm bằng grep `[\p{L}]{4,}` trong JSX text node — nhưng cách tốt nhất là grep cụm tiếng Việt đặc trưng).
- [ ] `ORDER_STATUS_LABEL`, `SLOT_STATUS_LABEL`, `PAYMENT_STATUS_LABEL` đã xoá khỏi `constants.ts`.
- [ ] `npx tsc --noEmit` pass.
- [ ] `npm run lint` pass.
- [ ] `npm run build` pass.
- [ ] Smoke test: `/` → tiếng Việt. `/en/` → tiếng Anh. Switcher hoạt động. URL `/login` (vi) không redirect. URL `/en/login` hiển thị EN.

## 16. Ngoài scope (chuyển phase sau)

- Seller portal i18n (`/seller/**` — chưa có code).
- Admin portal i18n (`/admin/**` — chưa có code).
- Design tokens (Tailwind config + globals.css).
- shadcn/ui primitives refactor.
- Layer convention: `lib/validators` → `features/<x>/schemas.ts`.
- Testing setup (Vitest + RTL).
- Server-side locale detection (qua `Accept-Language` header) — hiện dùng cookie qua switcher.