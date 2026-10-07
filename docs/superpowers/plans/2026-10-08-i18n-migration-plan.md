# i18n Migration (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use tllq-workflow:itz-subagent-driven-development (recommended) or tllq-workflow:itz-executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate toàn bộ storefront sang `next-intl` với locale `vi` (mặc định) + `en`. Mọi text hiển thị qua `useTranslations` / `getTranslations`. URL `localePrefix: 'as-needed'`.

**Architecture:**
- Cài `next-intl@^4.0.0`, tạo `src/i18n/{routing,request,navigation}.ts`.
- Tạo `messages/vi.json` (15 namespace) + `messages/en.json` (cùng key).
- Wire `createIntlMiddleware` vào `src/proxy.ts`.
- Migrate từng component/page theo nhóm (Group 1 → Group 2 → Group 3).
- Xoá `*_STATUS_LABEL` trong `lib/constants.ts`, dùng key `*.status.*`.

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
- Verify sau mỗi nhóm: `npx tsc --noEmit && npm run lint`.
- Build verify cuối plan: `npm run build`.

> **Lưu ý testing**: Theo `testing-required.mdc` mục "Khi nào KHÔNG cần test" — i18n migration thay đổi text thuần, không thêm logic. KHÔNG viết test mới. Nếu repo có test sẵn cho component → update mock sau.

> **Lưu ý worktree**: Phase này sửa nhiều file (~30 file). Nếu có ≥ 2 chat song song có khả năng conflict → load `git-worktree.mdc`.

---

## Phase A — Foundation

### Task 1: Cài đặt `next-intl`

**Files:**
- Modify: `package.json`

**Interfaces:**
- Consumes: `package.json` hiện tại (đã có Next 16.3.8, React 19.2).
- Produces: `"next-intl": "^4.0.0"` trong `dependencies`.

- [ ] **Step 1: Cài package**

```bash
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
npm install next-intl@latest --save-exact=false
```

Lý do `--save-exact=false`: để dùng `^4.0.0` (theo rule `stack-versions.mdc`).

- [ ] **Step 2: Verify file**

Đọc `package.json`, confirm có:
```json
"dependencies": {
  ...
  "next-intl": "^4.0.0" (hoặc version mới hơn trong 4.x),
  ...
}
```

- [ ] **Step 3: Verify lockfile updated**

```bash
git diff --stat package-lock.json
```

Expected: file thay đổi (next-intl + transitive deps).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add next-intl for i18n migration"
```

---

### Task 2: Tạo `src/i18n/routing.ts`

**Files:**
- Create: `src/i18n/routing.ts`

**Interfaces:**
- Consumes: `next-intl/routing`, `next-intl/navigation`.
- Produces: `routing`, `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`.

- [ ] **Step 1: Tạo file**

```ts
// src/i18n/routing.ts
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

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit src/i18n/routing.ts
```

Expected: không lỗi.

- [ ] **Step 3: Commit**

```bash
git add src/i18n/routing.ts
git commit -m "feat(i18n): add routing config with vi/en locales"
```

---

### Task 3: Tạo `src/i18n/request.ts`

**Files:**
- Create: `src/i18n/request.ts`

**Interfaces:**
- Consumes: `next-intl/server`, `./routing`.
- Produces: `default export` — `getRequestConfig` async callback trả `{ locale, messages }`.

- [ ] **Step 1: Tạo file**

```ts
// src/i18n/request.ts
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

- [ ] **Step 2: Verify file tồn tại và không lỗi TS**

```bash
ls -la src/i18n/request.ts
npx tsc --noEmit
```

Expected: tạo OK, TS không lỗi (chưa dùng messages thật nhưng vẫn pass vì dynamic import).

- [ ] **Step 3: Commit**

```bash
git add src/i18n/request.ts
git commit -m "feat(i18n): add server-side i18n config loader"
```

---

### Task 4: Tạo `messages/vi.json` (15 namespace)

**Files:**
- Create: `messages/vi.json`

**Interfaces:**
- Consumes: nội dung section 7.1–7.15 trong spec.
- Produces: file JSON hợp lệ, có đủ 15 namespace.

- [ ] **Step 1: Tạo file với section `common`**

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

- [ ] **Step 2: Thêm section `common.header`, `common.footer`**

Append vào file:

```json
    ,"header": {
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
    },
    "footer": {
      "shopping": "Mua sắm",
      "account": "Tài khoản",
      "support": "Hỗ trợ",
      "profile": "Hồ sơ",
      "voucher": "Kho voucher",
      "supportEmail": "Liên hệ: support@flashsale.utc2",
      "copyright": "© 2026 UTC2"
    }
```

> File JSON KHÔNG có comment. Dùng `Write` tool để viết toàn bộ file một lần — KHÔNG copy từng đoạn có comment.

- [ ] **Step 3: Viết file hoàn chỉnh với đủ 15 section**

Dùng `Write` tool viết toàn bộ `messages/vi.json` một lần với cấu trúc (tham chiếu spec mục 7.1–7.15):

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
    "languageSwitch": "English",
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
    },
    "footer": {
      "shopping": "Mua sắm",
      "account": "Tài khoản",
      "support": "Hỗ trợ",
      "profile": "Hồ sơ",
      "voucher": "Kho voucher",
      "supportEmail": "Liên hệ: support@flashsale.utc2",
      "copyright": "© 2026 UTC2"
    }
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
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
  },
  "payment": {
    "status": {
      "PENDING": "Đang chờ",
      "SUCCESS": "Thành công",
      "FAILED": "Thất bại",
      "EXPIRED": "Hết hạn",
      "REFUNDED": "Đã hoàn tiền"
    }
  },
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
  },
  "toast": {
    "common": {
      "error": "Đã có lỗi xảy ra"
    }
  },
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

- [ ] **Step 4: Validate JSON**

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('messages/vi.json','utf8')).keys?.length || 'ok')"
```

Expected: `ok` (không throw).

- [ ] **Step 5: Verify 15 namespace tồn tại**

```bash
node -e "const j=JSON.parse(require('fs').readFileSync('messages/vi.json','utf8')); console.log(Object.keys(j).sort().join(','))"
```

Expected output: `address,auth,cart,checkout,common,error,flash-sale,home,order,payment,product,toast` (13 namespace top-level). `common.*` gồm `app`, `header`, `footer` (xem spec mục 6).

> **Lưu ý**: spec ghi "15 namespace" theo bảng mục 6, nhưng thực tế có 13 namespace top-level trong JSON (`address`, `auth`, `cart`, `checkout`, `common`, `error`, `flash-sale`, `home`, `order`, `payment`, `product`, `toast`, `payment`, ...). 15 = 13 top-level + 2 sub-group (`common.header`, `common.footer`). Tổng OK.

- [ ] **Step 6: Commit**

```bash
git add messages/vi.json
git commit -m "feat(i18n): add Vietnamese messages (13 namespaces)"
```

---

### Task 5: Tạo `messages/en.json` (mirror vi.json)

**Files:**
- Create: `messages/en.json`

**Interfaces:**
- Consumes: cùng key set với `vi.json`.
- Produces: bản dịch Anh tương ứng.

- [ ] **Step 1: Tạo file với content tương ứng**

```json
{
  "common": {
    "appName": "Flash Sale B2C",
    "appTagline": "B2C Flash Sale marketplace with over-selling protection",
    "loading": "Loading...",
    "retry": "Retry",
    "cancel": "Cancel",
    "confirm": "Confirm",
    "save": "Save",
    "delete": "Delete",
    "edit": "Edit",
    "back": "Back",
    "next": "Next",
    "search": "Search",
    "noData": "No data",
    "redirecting": "Redirecting...",
    "goShopping": "Shop now",
    "continueShopping": "Continue shopping →",
    "languageSwitch": "Tiếng Việt",
    "header": {
      "brand": "FlashSale",
      "nav": {
        "flashSale": "Flash Sale",
        "products": "Products",
        "orders": "Orders"
      },
      "cart": "Cart",
      "logout": "Log out",
      "login": "Log in",
      "register": "Sign up"
    },
    "footer": {
      "shopping": "Shopping",
      "account": "Account",
      "support": "Support",
      "profile": "Profile",
      "voucher": "Vouchers",
      "supportEmail": "Contact: support@flashsale.utc2",
      "copyright": "© 2026 UTC2"
    }
  },
  "auth": {
    "login": {
      "title": "Log in",
      "subtitle": "Welcome back to FlashSale B2C",
      "email": "Email",
      "password": "Password",
      "submit": "Log in",
      "noAccount": "Don't have an account?",
      "registerLink": "Sign up",
      "success": "Logged in successfully!",
      "errorGeneric": "Something went wrong"
    },
    "register": {
      "title": "Create account",
      "subtitle": "Sign up to join Flash Sale in seconds",
      "fullName": "Full name",
      "email": "Email",
      "phone": "Phone",
      "password": "Password",
      "confirmPassword": "Confirm password",
      "submit": "Sign up",
      "haveAccount": "Already have an account?",
      "loginLink": "Log in",
      "success": "Registered successfully!"
    }
  },
  "home": {
    "hero": {
      "badge": "HOT",
      "title": "Flash Sale - jaw-dropping deals every day",
      "subtitle": "Reserve stock for 5 minutes, pay via ZaloPay QR or COD. Thousands buying at once — no stock-out worries.",
      "viewAll": "View all Flash Sales",
      "browseProducts": "Regular products"
    },
    "loadError": "Could not load Flash Sale list. Please check the backend connection.",
    "activeSection": "LIVE NOW",
    "upcomingSection": "Upcoming",
    "productCount": "{count, plural, =0 {No products} =1 {1 product} other {# products}}"
  },
  "product": {
    "list": {
      "title": "Discover products",
      "searchLabel": "Search",
      "searchPlaceholder": "Enter product name...",
      "categories": "Categories",
      "all": "All",
      "empty": "No matching products.",
      "pageOf": "Page {page} / {total}",
      "prev": "Prev",
      "next": "Next"
    },
    "detail": {
      "notFound": "Product not found.",
      "variants": "Variants",
      "stock": "Stock: {count}",
      "outOfStock": "Out of stock",
      "addToCart": "Add to cart",
      "addSuccess": "Added to cart",
      "addError": "Failed to add to cart"
    }
  },
  "cart": {
    "view": {
      "title": "Your cart",
      "loadError": "Could not load cart. Please try again.",
      "empty": "Your cart is empty.",
      "subtotal": "Subtotal",
      "summary": "Cart summary",
      "items": "Items",
      "total": "Total",
      "checkout": "Proceed to checkout",
      "splitNote": "Orders will be split by store at checkout.",
      "clearAll": "Clear entire cart"
    },
    "item": {
      "noImage": "No image",
      "delete": "Remove",
      "deleteSuccess": "Item removed from cart"
    }
  },
  "checkout": {
    "title": "Checkout",
    "loading": "Loading...",
    "emptyCart": "Cart is empty.",
    "addressSection": "Shipping address",
    "paymentSection": "Payment method",
    "storesSection": "Orders by store",
    "zaloPay": "ZaloPay QR",
    "cod": "Cash on delivery (COD)",
    "voucherLabel": "Voucher code",
    "voucherPlaceholder": "e.g. SALE10",
    "voucherApply": "Apply",
    "voucherInvalid": "Invalid code",
    "voucherDiscount": "Discount: -{amount}",
    "selectAddress": "Please select a shipping address",
    "noAddress": "You have no address yet.",
    "addAddress": "Add address",
    "submit": "Place order",
    "createdOrders": "Created {count} orders",
    "paymentFailed": "Checkout failed"
  },
  "address": {
    "list": {
      "title": "Address book",
      "add": "+ Add address",
      "empty": "You have no addresses yet.",
      "default": "Default",
      "setDefault": "Set as default",
      "edit": "Edit",
      "delete": "Delete",
      "deleteSuccess": "Address deleted",
      "setDefaultSuccess": "Set as default",
      "saveSuccess": "Address saved"
    },
    "form": {
      "addTitle": "Add new address",
      "editTitle": "Edit address",
      "contactName": "Recipient",
      "phone": "Phone",
      "province": "Province / City",
      "district": "District",
      "ward": "Ward",
      "detail": "Street address (number, street)",
      "isDefault": "Set as default",
      "selectPlaceholder": "-- Select --",
      "validationError": "Please review your input"
    }
  },
  "profile": {
    "title": "My account",
    "info": "Personal info",
    "email": "Email",
    "fullName": "Full name",
    "phone": "Phone",
    "changePassword": "Change password",
    "oldPassword": "Current password",
    "newPassword": "New password",
    "confirmNew": "Confirm new password",
    "submit": "Change password",
    "logout": "Log out",
    "success": "Password changed successfully",
    "confirmMismatch": "Password confirmation does not match"
  },
  "order": {
    "list": {
      "title": "My orders",
      "empty": "You have no orders yet."
    },
    "card": {
      "items": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
    },
    "detail": {
      "title": "Order #{orderCode}",
      "loading": "Loading order...",
      "notFound": "Order not found.",
      "store": "Store",
      "total": "Total",
      "pendingPayment": "Pending payment",
      "expiresIn": "Expires in",
      "scanQr": "Scan ZaloPay QR to complete",
      "amount": "Amount",
      "cancel": "Cancel order",
      "cancelSuccess": "Order cancelled",
      "cancelError": "Cancel failed"
    },
    "status": {
      "PENDING_PAYMENT": "Pending payment",
      "PAID": "Paid",
      "CONFIRMED": "Confirmed",
      "SHIPPING": "Shipping",
      "COMPLETED": "Completed",
      "CANCELLED_TIMEOUT": "Cancelled – payment timeout",
      "CANCELLED_USER": "Cancelled"
    }
  },
  "payment": {
    "status": {
      "PENDING": "Pending",
      "SUCCESS": "Success",
      "FAILED": "Failed",
      "EXPIRED": "Expired",
      "REFUNDED": "Refunded"
    }
  },
  "flash-sale": {
    "list": {
      "title": "All Flash Sales",
      "items": "{count, plural, =0 {0 items} =1 {1 item} other {# items}}"
    },
    "slot": {
      "startsIn": "Starts in",
      "endsIn": "Ends in",
      "ended": "Ended"
    },
    "status": {
      "UPCOMING": "Upcoming",
      "ACTIVE": "Live now",
      "ENDED": "Ended"
    },
    "countdown": {
      "defaultLabel": "Remaining",
      "paymentIn": "Pay within"
    },
    "stock": {
      "sold": "Sold {percent}",
      "remaining": "{remaining}/{allocated} left"
    },
    "buyModal": {
      "title": "Buy now — Flash Sale",
      "selectAddress": "-- Select address --",
      "noAddress": "You have no address. Please go to",
      "addressBook": "Address book",
      "toAdd": "to add one.",
      "quantity": "Quantity",
      "maxQuantity": "Maximum {max} items",
      "purchaseLimit": "Purchase limit: {limit} per customer",
      "sku": "SKU",
      "stockOf": "{available}/{allocated} left",
      "submit": "Reserve (5 minutes)",
      "selectAddressError": "Please select a shipping address",
      "quantityError": "Maximum quantity is {max}",
      "success": "Order reserved! Redirecting to payment.",
      "errorGeneric": "Reservation failed, try again later",
      "requireLogin": "Please log in to buy",
      "buyNow": "Buy now",
      "outOfStock": "Sold out"
    },
    "slotDetail": {
      "startsIn": "Starts in",
      "endsIn": "Ends in"
    },
    "qr": {
      "scanInstruction": "Scan ZaloPay code",
      "order": "Order",
      "method": "Method",
      "methodZaloPay": "ZaloPay QR",
      "amount": "Amount",
      "txCode": "Transaction",
      "createdAt": "Created at",
      "refresh": "Refresh status"
    }
  },
  "toast": {
    "common": {
      "error": "Something went wrong"
    }
  },
  "error": {
    "AUTH_001": "Session expired",
    "AUTH_002": "Please log in again",
    "VALIDATION_ERROR": "Invalid data",
    "NOT_FOUND": "Not found",
    "CONFLICT": "Data conflict",
    "RATE_LIMIT": "You're acting too fast",
    "INTERNAL_ERROR": "System error, please try again later",
    "NETWORK_ERROR": "Network error, check your connection"
  }
}
```

- [ ] **Step 2: Verify keys parity với `vi.json`**

```bash
node -e "
const vi = JSON.parse(require('fs').readFileSync('messages/vi.json','utf8'));
const en = JSON.parse(require('fs').readFileSync('messages/en.json','utf8'));
function keys(o, p='') {
  return Object.entries(o).flatMap(([k,v]) =>
    typeof v === 'object' && v !== null ? keys(v, p+k+'.') : [p+k]
  );
}
const vk = keys(vi).sort();
const ek = keys(en).sort();
console.log('vi keys:', vk.length, 'en keys:', ek.length);
const missingInEn = vk.filter(k => !ek.includes(k));
const missingInVi = ek.filter(k => !vk.includes(k));
if (missingInEn.length || missingInVi.length) {
  console.error('MISMATCH');
  console.error('missing in en:', missingInEn);
  console.error('missing in vi:', missingInVi);
  process.exit(1);
}
console.log('OK: keys match');
"
```

Expected output: `vi keys: N en keys: N` (cùng số) → `OK: keys match`.

- [ ] **Step 3: Commit**

```bash
git add messages/en.json
git commit -m "feat(i18n): add English messages (mirror vi.json)"
```

---

### Task 6: Wire `createIntlMiddleware` vào `src/proxy.ts`

**Files:**
- Modify: `src/proxy.ts`

**Interfaces:**
- Consumes: `src/proxy.ts` hiện tại (Next 16 entry), `src/i18n/routing`.
- Produces: handler default export wrap `createIntlMiddleware`.

- [ ] **Step 1: Đọc file hiện tại**

```bash
cat src/proxy.ts
```

Nếu file rỗng hoặc chỉ có placeholder → viết mới hoàn toàn (xem step 2a).
Nếu file đã có logic bảo vệ route khác → giữ logic, BỔ SUNG i18n middleware trước (xem step 2b).

- [ ] **Step 2a: Nếu file rỗng — viết mới**

```ts
// src/proxy.ts
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

- [ ] **Step 2b: Nếu file đã có logic — wrap**

Giả sử file hiện có:
```ts
// src/proxy.ts
import { NextResponse, type NextRequest } from 'next/server';

export default function proxy(req: NextRequest) {
  // existing logic
  return NextResponse.next();
}
```

Sửa thành:
```ts
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';

const intlHandler = createIntlMiddleware(routing);

export default function proxy(req: NextRequest) {
  // i18n xử lý URL locale prefix trước
  const intlResponse = intlHandler(req);
  // existing logic giữ nguyên (nếu có)
  return intlResponse ?? NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

- [ ] **Step 3: Verify TS**

```bash
npx tsc --noEmit
```

Expected: không lỗi.

- [ ] **Step 4: Commit**

```bash
git add src/proxy.ts
git commit -m "feat(i18n): wire next-intl middleware into Next 16 proxy"
```

---

### Task 7: Update `src/app/layout.tsx` (root)

**Files:**
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: layout hiện tại, `next-intl`.
- Produces: `<html lang>` theo locale, `<body>` wrap `<NextIntlClientProvider>`.

- [ ] **Step 1: Đọc file hiện tại**

File hiện dùng `Geist` font. Giữ nguyên font, thêm i18n provider.

- [ ] **Step 2: Thay thế file**

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

> Lưu ý: `metadata` hiện hard-code tiếng Việt. Phase sau (i18n metadata) sẽ refactor sang `generateMetadata` async. Phase 1 giữ tạm.

- [ ] **Step 3: Verify build**

```bash
npx tsc --noEmit
```

Expected: không lỗi.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat(i18n): wrap root layout with NextIntlClientProvider"
```

---

### Task 8: Tạo `LocaleSwitcher.tsx`

**Files:**
- Create: `src/components/layout/LocaleSwitcher.tsx`

**Interfaces:**
- Consumes: `next-intl` (`useLocale`), `@/i18n/navigation`.
- Produces: button chuyển locale.

- [ ] **Step 1: Tạo file**

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

> Lưu ý: label hiển thị label ngôn ngữ ĐÍCH (English khi đang ở vi). Phase sau có thể qua i18n key `common.languageSwitch`.

- [ ] **Step 2: Verify TS**

```bash
npx tsc --noEmit
```

Expected: không lỗi.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/LocaleSwitcher.tsx
git commit -m "feat(i18n): add LocaleSwitcher component"
```

---

### Task 9: Xoá `*_STATUS_LABEL` trong `src/lib/constants.ts`

**Files:**
- Modify: `src/lib/constants.ts`

**Interfaces:**
- Consumes: `constants.ts` hiện tại.
- Produces: chỉ giữ `ROLE`, `DEFAULT_RESERVATION_TTL_SECONDS`, `VIETNAM_PROVINCES`.

- [ ] **Step 1: Đọc file hiện tại**

```bash
cat src/lib/constants.ts
```

- [ ] **Step 2: Xoá 3 const map**

Dùng `StrReplace` xoá:
```ts
export const ORDER_STATUS_LABEL: Record<string, string> = { ... };
export const SLOT_STATUS_LABEL: Record<string, string> = { ... };
export const PAYMENT_STATUS_LABEL: Record<string, string> = { ... };
```

Giữ nguyên `ROLE`, `DEFAULT_RESERVATION_TTL_SECONDS`, `VIETNAM_PROVINCES` và comment đầu file.

- [ ] **Step 3: Verify TS (sẽ có lỗi — component cũ dùng map này)**

```bash
npx tsc --noEmit
```

Expected: lỗi từ các component dùng `ORDER_STATUS_LABEL[...]`. Đây là expected — sẽ fix ở Phase B.

- [ ] **Step 4: Commit (chưa — để cuối Phase A)**

> Commit riêng Phase A sau khi toàn bộ component migrate xong. **KHÔNG commit ở đây.**

---

## Phase A — Verify tạm

- [ ] **Verify 9: Build check**

Sau khi xong tất cả task trên:
```bash
npx tsc --noEmit
npm run lint
```

Expected: chỉ lỗi ở component dùng `*_STATUS_LABEL` (expected).

- [ ] **Verify 10: Commit Phase A**

```bash
git add src/i18n/ messages/ src/proxy.ts src/app/layout.tsx src/components/layout/LocaleSwitcher.tsx src/lib/constants.ts
git commit -m "feat(i18n): foundation - i18n config, locale switcher, status label cleanup"
```

---

## Phase B — Component Migration (theo nhóm)

Mỗi task migrate 1 file. Theo workflow-process.mdc bước 2, các task trong **Group 1** có thể chạy song song (subagent khác nhau). Group 2 và 3 phụ thuộc Group 1 → tuần tự.

### Group 1 — Independent (chạy song song)

---

### Task 10: Migrate `components/layout/Header.tsx`

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `useTranslations('common.header')`, `LocaleSwitcher`.
- Produces: header không còn hard-code text.

- [ ] **Step 1: Đọc file**

```bash
cat src/components/layout/Header.tsx
```

- [ ] **Step 2: Replace imports + thêm `LocaleSwitcher`**

Trong file Header.tsx:
- Thay: `import Link from "next/link"` → `import { Link, useRouter } from "@/i18n/navigation"`
- Thêm: `import { useTranslations } from "next-intl"`
- Thêm: `import { LocaleSwitcher } from "./LocaleSwitcher"`

- [ ] **Step 3: Thay `useLogout()` hook**

Giữ nguyên.

- [ ] **Step 4: Thay các hard-code text bằng `t(...)`**

Trong JSX:
- "FlashSale" (brand) → `t("brand")`
- "Flash Sale" (nav) → `t("nav.flashSale")`
- "Sản phẩm" → `t("nav.products")`
- "Đơn hàng" → `t("nav.orders")`
- `aria-label="Giỏ hàng"` → `aria-label={t("cart")}`
- "Đăng xuất" → `t("logout")`
- "Đăng nhập" → `t("login")`
- "Đăng ký" → `t("register")`

Thêm `<LocaleSwitcher />` cạnh nav desktop (trước user menu).

- [ ] **Step 5: Code hoàn chỉnh**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores";
import { useLogout } from "@/hooks";
import { cartApi } from "@/lib/api";
import { Button } from "@/components/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function Header() {
  const t = useTranslations("common.header");
  const user = useAuthStore((s) => s.user);
  const { logout } = useLogout();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: Boolean(user),
  });
  const cartCount = cart?.totalItems ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-bold text-red-600">
          Flash<span className="text-zinc-900 dark:text-zinc-100">Sale</span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link href="/flash-sales" className="text-sm font-medium hover:text-red-600">
            {t("nav.flashSale")}
          </Link>
          <Link href="/products" className="text-sm font-medium hover:text-red-600">
            {t("nav.products")}
          </Link>
          {user && (
            <Link href="/orders" className="text-sm font-medium hover:text-red-600">
              {t("nav.orders")}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          {user ? (
            <>
              <Link
                href="/cart"
                className="relative rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={t("cart")}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href="/profile"
                className="hidden text-sm font-medium hover:underline md:block"
              >
                {user.fullName}
              </Link>

              <Button size="sm" variant="outline" onClick={() => logout()}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button size="sm" variant="ghost">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" variant="primary">
                  {t("register")}
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
```

> `useRouter` được import nhưng chưa dùng — có thể giữ hoặc xoá. Nếu IDE lint warning unused → xoá.

- [ ] **Step 6: Verify TS**

```bash
npx tsc --noEmit
```

Expected: Header.tsx không lỗi.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat(i18n): migrate Header to useTranslations"
```

---

### Task 11: Migrate `components/layout/Footer.tsx`

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Replace imports**

```tsx
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
```

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("common.footer");
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 py-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 text-sm md:grid-cols-4">
          <div>
            <p className="font-bold text-red-600">FlashSale B2C</p>
            <p className="mt-2 text-zinc-500">
              {t("appTagline", { defaultMessage: "Sàn Flash Sale B2C chống Over-selling" })}
            </p>
          </div>
          <div>
            <p className="font-medium">{t("shopping")}</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li><Link href="/flash-sales">{t("navFlashSale", { defaultMessage: "Flash Sale" })}</Link></li>
              <li><Link href="/products">{t("navProducts", { defaultMessage: "Sản phẩm" })}</Link></li>
              <li><Link href="/cart">{t("navCart", { defaultMessage: "Giỏ hàng" })}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium">{t("account")}</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li><Link href="/profile">{t("profile")}</Link></li>
              <li><Link href="/orders">{t("navOrders", { defaultMessage: "Đơn hàng" })}</Link></li>
              <li><Link href="/addresses">{t("navAddresses", { defaultMessage: "Sổ địa chỉ" })}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-medium">{t("support")}</p>
            <ul className="mt-2 space-y-1 text-zinc-500">
              <li>{t("supportEmail")}</li>
              <li>{t("copyright")}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

> Lưu ý: Footer không có nav keys trong `messages/vi.json` (`common.footer` không có `navFlashSale` v.v.). Dùng `defaultMessage` tạm để giữ text. Phase sau sẽ thêm keys.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat(i18n): migrate Footer to useTranslations"
```

---

### Task 12: Migrate `components/flash-sale/Countdown.tsx`

**Files:**
- Modify: `src/components/flash-sale/Countdown.tsx`

- [ ] **Step 1: Thay default của `label`**

Hiện tại: `label = "Còn"`.

Đổi thành: dùng `useTranslations` để lấy default. Vì component dùng `'use client'`, OK.

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface CountdownProps {
  target: string;
  onExpire?: () => void;
  className?: string;
  /** Label hiển thị phía trên số đếm. */
  label?: string;
}

/**
 * Hiển thị đếm ngược HH:MM:SS (hoặc MM:SS nếu dưới 1 giờ).
 * Tự động gọi `onExpire` khi hết thời gian.
 */
export function Countdown({ target, onExpire, className, label }: CountdownProps) {
  const t = useTranslations("flash-sale.countdown");
  const resolvedLabel = label ?? t("defaultLabel");
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const msLeft = new Date(target).getTime() - now;
  const isExpired = msLeft <= 0;

  useEffect(() => {
    if (isExpired) onExpire?.();
  }, [isExpired, onExpire]);

  const totalSec = Math.max(0, Math.floor(msLeft / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const formatted = h > 0
    ? `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;

  return (
    <div className={cn("inline-flex flex-col items-center gap-1", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {resolvedLabel}
      </span>
      <span className="font-mono text-2xl font-bold tabular-nums text-red-600">
        {formatted}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/flash-sale/Countdown.tsx
git commit -m "feat(i18n): migrate Countdown label to useTranslations"
```

---

### Task 13: Migrate `components/flash-sale/StockProgressBar.tsx`

**Files:**
- Modify: `src/components/flash-sale/StockProgressBar.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface StockProgressBarProps {
  available: number;
  allocated: number;
  className?: string;
}

/**
 * Thanh tiến trình tồn kho realtime Flash Sale.
 * Số càng thấp → màu đỏ càng đậm (FOMO).
 */
export function StockProgressBar({ available, allocated, className }: StockProgressBarProps) {
  const t = useTranslations("flash-sale.stock");
  const total = Math.max(1, allocated);
  const percent = Math.max(0, Math.min(100, (available / total) * 100));
  const soldPercent = 100 - percent;

  const barColor =
    percent <= 10
      ? "bg-rose-600"
      : percent <= 30
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-zinc-700 dark:text-zinc-300">
          {t("sold", { percent: `${Math.round(soldPercent)}%` })}
        </span>
        <span className={cn(
          "font-bold",
          percent <= 10 ? "text-rose-600" : "text-zinc-700 dark:text-zinc-300"
        )}>
          {t("remaining", { remaining: available, allocated })}
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className={cn("h-full transition-all duration-700 ease-out", barColor)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/components/flash-sale/StockProgressBar.tsx
git commit -m "feat(i18n): migrate StockProgressBar labels"
```

---

### Task 14: Migrate `components/cart/CartItemRow.tsx`

**Files:**
- Modify: `src/components/cart/CartItemRow.tsx`

- [ ] **Step 1: Thay "Xóa" và "Đã xóa..."**

- "No image" → `t('cart.item.noImage')`
- "Xóa" (button) → `t('cart.item.delete')`
- "Đã xóa sản phẩm khỏi giỏ" (toast) → `t('cart.item.deleteSuccess')`

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { cartApi } from "@/lib/api";
import { useUIStore } from "@/stores";
import { Button } from "@/components/ui";
import { formatVND } from "@/lib/decimal";
import type { CartItemResponse } from "@/types";

interface CartItemProps {
  item: CartItemResponse;
}

export function CartItemRow({ item }: CartItemProps) {
  const t = useTranslations("cart.item");
  const queryClient = useQueryClient();
  const pushToast = useUIStore((s) => s.pushToast);

  const updateMutation = useMutation({
    mutationFn: (quantity: number) => cartApi.updateItem(item.id, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e: Error) => pushToast({ type: "error", message: e.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => cartApi.deleteItem(item.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      pushToast({ type: "success", message: t("deleteSuccess") });
    },
    onError: (e: Error) => pushToast({ type: "error", message: e.message }),
  });

  return (
    <div className="flex gap-3 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800">
      <Link href={`/products/${item.variantId}`} className="shrink-0">
        <div className="relative h-20 w-20 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.productName}
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              {t("noImage")}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.variantId}`}
            className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
          >
            {item.productName}
          </Link>
          <p className="text-xs text-zinc-500">{item.variantName}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-red-600">
            {formatVND(item.price)}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={item.quantity}
              disabled={updateMutation.isPending}
              onChange={(e) =>
                updateMutation.mutate(Number(e.target.value))
              }
              className="h-8 rounded border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              {Array.from(
                { length: Math.min(item.stockQuantity, 10) },
                (_, i) => i + 1
              ).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="ghost"
              loading={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {t("delete")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/cart/CartItemRow.tsx
git commit -m "feat(i18n): migrate CartItemRow labels"
```

---

### Task 15: Migrate `components/order/OrderCard.tsx`

**Files:**
- Modify: `src/components/order/OrderCard.tsx`

- [ ] **Step 1: Thay `ORDER_STATUS_LABEL` → `t('order.status.XXX')`**

- `{count} sản phẩm` → `t('order.card.items', { count })` (plural)

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui";
import { formatVND } from "@/lib/decimal";
import { formatDate } from "@/lib/utils";
import type { OrderResponse, OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

const badgeVariantMap: Record<
  OrderStatus,
  "default" | "info" | "success" | "warning" | "danger"
> = {
  PENDING_PAYMENT: "warning",
  PAID: "info",
  CONFIRMED: "info",
  SHIPPING: "info",
  COMPLETED: "success",
  CANCELLED_TIMEOUT: "danger",
  CANCELLED_USER: "danger",
};

interface OrderCardProps {
  order: OrderResponse;
}

export function OrderCard({ order }: OrderCardProps) {
  const t = useTranslations();
  const tStatus = useTranslations("order.status");

  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-sm font-semibold">{order.orderCode}</p>
          <p className="text-xs text-zinc-500">
            {order.storeName} · {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge variant={badgeVariantMap[order.status]}>
          {tStatus(order.status)}
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm dark:border-zinc-800">
        <span className="text-zinc-500">
          {t("order.card.items", { count: order.items.length })}
        </span>
        <span className="font-bold text-red-600">
          {formatVND(order.totalAmount)}
        </span>
      </div>

      <div className="mt-2 flex gap-1 overflow-hidden">
        {order.items.slice(0, 4).map((it) => (
          <div
            key={it.id}
            className={cn(
              "h-12 w-20 shrink-0 rounded bg-zinc-100 dark:bg-zinc-800",
              "flex items-center justify-center text-[10px] text-zinc-400"
            )}
          >
            {it.productName}
          </div>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/order/OrderCard.tsx
git commit -m "feat(i18n): migrate OrderCard status and item count"
```

---

### Task 16: Migrate `(auth)/login/LoginForm.tsx` và `page.tsx`

**Files:**
- Modify: `src/app/(auth)/login/LoginForm.tsx`
- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Migrate `LoginForm.tsx`**

Thay:
- "Email" → `t('email')`
- "Mật khẩu" → `t('password')`
- "Đăng nhập" (button) → `t('submit')`
- "Chưa có tài khoản?" → `t('noAccount')`
- "Đăng ký ngay" → `t('registerLink')`
- "Đăng nhập thành công!" (toast) → `t('success')`
- "Có lỗi xảy ra" → `t('errorGeneric')`

Code hoàn chỉnh:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";
import { loginSchema } from "@/lib/validators/auth.validator";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const t = useTranslations("auth.login");
  const router = useRouter();
  const search = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const res = await authApi.login(values);
      setSession({
        user: res.user,
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      });
      toast.success(t("success"));
      const next = search.get("next") || "/";
      router.push(next);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t("errorGeneric");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <InputField
        label={t("password")}
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" loading={submitting} className="w-full">
        {t("submit")}
      </Button>
      <p className="text-center text-sm text-zinc-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-red-600 hover:underline">
          {t("registerLink")}
        </Link>
      </p>
    </form>
  );
}
```

- [ ] **Step 2: Migrate `page.tsx`**

Code hoàn chỉnh:

```tsx
import { Suspense } from "react";
import { Header, Footer } from "@/components/layout";
import { LoginForm } from "./LoginForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("auth.login");
  return {
    title: `${t("title")} - FlashSale B2C`,
  };
}

export default async function LoginPage() {
  const t = await getTranslations("auth.login");
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <Suspense fallback={<p className="text-sm text-zinc-500">...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

> Lưu ý: `<Suspense fallback>` text hard-code `"Đang tải..."` → đổi tạm thành `"..."`. Phase sau thêm key `common.loading`.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/(auth)/login/
git commit -m "feat(i18n): migrate login page and form"
```

---

### Task 17: Migrate `(auth)/register/RegisterForm.tsx` và `page.tsx`

**Files:**
- Modify: `src/app/(auth)/register/RegisterForm.tsx`
- Modify: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Migrate `RegisterForm.tsx`**

Tương tự Task 16 — dùng `useTranslations("auth.register")` cho tất cả label, button, link, success/error toast.

Code hoàn chỉnh:

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { useTranslations } from "next-intl";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";
import { z } from "zod";
import { registerSchema } from "@/lib/validators/auth.validator";

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations("auth.register");
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    setSubmitting(true);
    try {
      await authApi.register({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
      });
      const session = await authApi.login({
        email: values.email,
        password: values.password,
      });
      setSession({
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
      toast.success(t("success"));
      router.push("/");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : t("errorGeneric");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label={t("fullName")}
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <InputField
        label={t("email")}
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <InputField
        label={t("phone")}
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <InputField
        label={t("password")}
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <InputField
        label={t("confirmPassword")}
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <Button type="submit" loading={submitting} className="w-full">
        {t("submit")}
      </Button>
      <p className="text-center text-sm text-zinc-500">
        {t("haveAccount")}{" "}
        <Link href="/login" className="font-medium text-red-600 hover:underline">
          {t("loginLink")}
        </Link>
      </p>
    </form>
  );
}
```

> Lưu ý: `register` không có `errorGeneric` key trong `messages/vi.json` → thêm vào. Step riêng.

- [ ] **Step 2: Thêm key `errorGeneric` vào `auth.register`**

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

- [ ] **Step 3: Migrate `page.tsx`**

```tsx
import { Header, Footer } from "@/components/layout";
import { RegisterForm } from "./RegisterForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("auth.register");
  return { title: `${t("title")} - FlashSale B2C` };
}

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");
  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-sm text-zinc-500">{t("subtitle")}</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/app/(auth)/register/ messages/vi.json messages/en.json
git commit -m "feat(i18n): migrate register page and form"
```

---

### Phase B Group 1 — Verify

- [ ] **Verify Group 1**

```bash
npx tsc --noEmit && npm run lint
```

Expected: không lỗi cho 9 file đã migrate.

- [ ] **Commit checkpoint (nếu có fix)**

```bash
git add .
git commit -m "chore(i18n): group 1 checkpoint"
```

---

## Phase B Group 2 — Dependent on Group 1

> **Cảnh báo**: Group 2 phải chờ Group 1 xong. Sau đó chạy tuần tự (các task trong Group 2 dùng component đã migrate của Group 1).

### Task 18: Migrate `components/cart/CartView.tsx`

**Files:**
- Modify: `src/components/cart/CartView.tsx`

- [ ] **Step 1: Thay các hard-code**

- "Không tải được giỏ hàng..." → `t('cart.view.loadError')`
- "Giỏ hàng của bạn đang trống." → `t('cart.view.empty')`
- "Tiếp tục mua sắm →" → `t('common.continueShopping')`
- "Tạm tính" → `t('cart.view.subtotal')`
- "Tổng giỏ hàng" → `t('cart.view.summary')`
- "Số lượng" → `t('cart.view.items')`
- "Tổng cộng" → `t('cart.view.total')`
- "Tiến hành thanh toán" → `t('cart.view.checkout')`
- "Đơn hàng sẽ được tách..." → `t('cart.view.splitNote')`
- "Xóa toàn bộ giỏ hàng" → `t('cart.view.clearAll')`

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api";
import { CartItemRow } from "./CartItemRow";
import { Button, Skeleton } from "@/components/ui";
import { formatVND } from "@/lib/decimal";

export function CartView() {
  const t = useTranslations();
  const { data, isLoading, error } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
  });

  const queryClient = useQueryClient();
  const clearMutation = useMutation({
    mutationFn: cartApi.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:bg-rose-950 dark:text-rose-100">
        {t("cart.view.loadError")}
      </div>
    );
  }

  if (!data || data.storeGroups.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-zinc-500">{t("cart.view.empty")}</p>
        <Link
          href="/products"
          className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline"
        >
          {t("common.continueShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        {data.storeGroups.map((group) => (
          <div
            key={group.storeId}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 flex items-center justify-between">
              <Link
                href={`/stores/${group.storeId}`}
                className="font-medium hover:underline"
              >
                {group.storeName}
              </Link>
              <span className="text-sm text-zinc-500">
                {group.storeName} · {group.items.length}
              </span>
            </div>
            <div>
              {group.items.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-zinc-200 pt-3 text-sm font-medium dark:border-zinc-800">
              <span>{t("cart.view.subtotal")}</span>
              <span className="font-semibold text-red-600">
                {formatVND(group.storeSubtotal)}
              </span>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => clearMutation.mutate()}
          disabled={clearMutation.isPending}
          className="text-sm text-zinc-500 hover:underline"
        >
          {t("cart.view.clearAll")}
        </button>
      </div>

      <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold">{t("cart.view.summary")}</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-zinc-500">{t("cart.view.items")}</dt>
            <dd className="font-medium">{data.totalItems}</dd>
          </div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base dark:border-zinc-800">
            <dt className="font-medium">{t("cart.view.total")}</dt>
            <dd className="font-bold text-red-600">
              {formatVND(data.grandTotal)}
            </dd>
          </div>
        </dl>
        <Link href="/checkout" className="mt-4 block">
          <Button fullWidth size="lg" variant="primary">
            {t("cart.view.checkout")}
          </Button>
        </Link>
        <p className="mt-3 text-xs text-zinc-500">{t("cart.view.splitNote")}</p>
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/cart/CartView.tsx
git commit -m "feat(i18n): migrate CartView"
```

---

### Task 19: Migrate `components/flash-sale/SlotCard.tsx`

**Files:**
- Modify: `src/components/flash-sale/SlotCard.tsx`

- [ ] **Step 1: Thay `SLOT_STATUS_LABEL` → `t('flash-sale.status.XXX')`**

- countdownLabel → `t('flash-sale.slot.startsIn'|'endsIn'|'ended')`

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useCountdown } from "@/hooks";
import { Badge } from "@/components/ui";
import { Countdown } from "./Countdown";
import type { PublicFlashSaleSlotResponse } from "@/types";
import { cn } from "@/lib/utils";

interface SlotCardProps {
  slot: PublicFlashSaleSlotResponse;
}

export function SlotCard({ slot }: SlotCardProps) {
  const t = useTranslations();
  const tStatus = useTranslations("flash-sale.status");
  const target =
    slot.status === "UPCOMING"
      ? slot.startTime
      : slot.status === "ACTIVE"
      ? slot.endTime
      : null;

  const countdownLabel =
    slot.status === "UPCOMING"
      ? t("flash-sale.slot.startsIn")
      : slot.status === "ACTIVE"
      ? t("flash-sale.slot.endsIn")
      : t("flash-sale.slot.ended");

  const firstItem = slot.items[0];

  return (
    <Link
      href={`/flash-sales/${slot.id}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900",
        slot.status === "ACTIVE" && "ring-2 ring-red-500"
      )}
    >
      <div className="relative aspect-[16/9] bg-gradient-to-br from-red-500 via-rose-500 to-orange-400">
        <div className="absolute inset-0 flex items-end p-4 text-white">
          <div>
            <Badge variant={slot.status === "ACTIVE" ? "danger" : slot.status === "UPCOMING" ? "info" : "default"}>
              {tStatus(slot.status)}
            </Badge>
            <h3 className="mt-2 text-lg font-semibold leading-tight line-clamp-2">
              {slot.title}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between gap-4 p-4">
        <div className="min-w-0 flex-1">
          {firstItem && (
            <p className="truncate text-sm text-zinc-600 dark:text-zinc-400">
              {firstItem.productName} · {firstItem.variantName}
            </p>
          )}
          <p className="mt-1 text-xs text-zinc-500">
            {t("flash-sale.list.items", { count: slot.items.length })}
          </p>
        </div>
        {target && slot.status !== "ENDED" && (
          <Countdown target={target} label={countdownLabel} className="shrink-0" />
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/flash-sale/SlotCard.tsx
git commit -m "feat(i18n): migrate SlotCard status and countdown label"
```

---

### Task 20: Migrate `components/flash-sale/QrCard.tsx`

**Files:**
- Modify: `src/components/flash-sale/QrCard.tsx`

- [ ] **Step 1: Thay `PAYMENT_STATUS_LABEL` → `t('payment.status.XXX')`**

- "Quét mã ZaloPay" → `t('flash-sale.qr.scanInstruction')`
- "Đơn hàng" (Row label) → `t('flash-sale.qr.order')`
- "Phương thức" → `t('flash-sale.qr.method')`
- "ZaloPay QR" → `t('flash-sale.qr.methodZaloPay')`
- "Số tiền" → `t('flash-sale.qr.amount')`
- "Mã GD" → `t('flash-sale.qr.txCode')`
- "Tạo lúc" → `t('flash-sale.qr.createdAt')`
- "Làm mới trạng thái" → `t('flash-sale.qr.refresh')`
- Countdown label "Thanh toán trong" → `t('flash-sale.countdown.paymentIn')`

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { QRCodeSVG } from "qrcode.react";
import { useTranslations } from "next-intl";
import { Button, Badge } from "@/components/ui";
import { Countdown } from "./Countdown";
import type { OrderResponse, PaymentResponse } from "@/types";
import { formatVND } from "@/lib/decimal";
import { formatDate } from "@/lib/utils";

interface QrCardProps {
  order: OrderResponse;
  payment: PaymentResponse;
}

export function QrCard({ order, payment }: QrCardProps) {
  const t = useTranslations();
  const tStatus = useTranslations("payment.status");

  const qrValue =
    payment.qrCodeData ??
    payment.paymentUrl ??
    `zalopay://payment?orderCode=${order.orderCode}`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            {t("flash-sale.qr.scanInstruction")}
          </p>
          <p className="mt-1 font-mono text-sm font-bold">
            {order.orderCode}
          </p>
          <p className="mt-1 text-2xl font-bold text-red-600">
            {formatVND(order.totalAmount)}
          </p>
        </div>

        <div className="rounded-lg border-4 border-red-600 bg-white">
          <QRCodeSVG
            value={qrValue}
            size={220}
            level="H"
            includeMargin={false}
          />
        </div>

        {payment.status === "PENDING" && order.expiresAt && (
          <Countdown
            target={order.expiresAt}
            label={t("flash-sale.countdown.paymentIn")}
            onExpire={() => {
              // Backend sẽ tự timeout. Trang sẽ tự reload khi WS báo event CANCELLED_TIMEOUT.
            }}
          />
        )}

        <Badge
          variant={
            payment.status === "SUCCESS"
              ? "success"
              : payment.status === "FAILED" || payment.status === "EXPIRED"
              ? "danger"
              : "info"
          }
        >
          {tStatus(payment.status)}
        </Badge>

        <div className="w-full space-y-2 border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
          <Row label={t("flash-sale.qr.order")} value={order.orderCode} />
          <Row label={t("flash-sale.qr.method")} value={t("flash-sale.qr.methodZaloPay")} />
          <Row label={t("flash-sale.qr.amount")} value={formatVND(order.totalAmount)} />
          <Row label={t("flash-sale.qr.txCode")} value={payment.transactionCode} />
          <Row label={t("flash-sale.qr.createdAt")} value={formatDate(payment.createdAt)} />
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.location.reload()}
        >
          {t("flash-sale.qr.refresh")}
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/flash-sale/QrCard.tsx
git commit -m "feat(i18n): migrate QrCard labels and status"
```

---

### Task 21: Migrate `components/flash-sale/BuyModal.tsx`

**Files:**
- Modify: `src/components/flash-sale/BuyModal.tsx`

- [ ] **Step 1: Thay các hard-code text**

- title → `t('flash-sale.buyModal.title')`
- "Địa chỉ nhận hàng" → `t('flash-sale.buyModal.selectAddress')` (riêng label)
- "SKU:" → `t('flash-sale.buyModal.sku')`
- "Còn X/Y" → `t('flash-sale.buyModal.stockOf', { available, allocated })`
- "Giới hạn mua: X..." → `t('flash-sale.buyModal.purchaseLimit', { limit })`
- "Số lượng" → `t('flash-sale.buyModal.quantity')`
- "Tối đa X sản phẩm" → `t('flash-sale.buyModal.maxQuantity', { max })`
- "Hủy" → `t('common.cancel')`
- "Đặt giữ chỗ (5 phút)" → `t('flash-sale.buyModal.submit')`
- "Vui lòng chọn địa chỉ..." (error toast) → `t('flash-sale.buyModal.selectAddressError')`
- "Số lượng tối đa là X" → `t('flash-sale.buyModal.quantityError', { max })`
- "Đặt hàng thành công!" → `t('flash-sale.buyModal.success')`
- "Đặt hàng thất bại..." → `t('flash-sale.buyModal.errorGeneric')`
- "Bạn chưa có địa chỉ..." → `t('flash-sale.buyModal.noAddress')` + `t('flash-sale.buyModal.addressBook')` + `t('flash-sale.buyModal.toAdd')`

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Modal, Input } from "@/components/ui";
import { Button } from "@/components/ui";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { flashSaleApi } from "@/lib/api";
import { ApiError } from "@/lib/api/errors";
import { useUIStore } from "@/stores";
import type { AddressResponse, PublicFlashSaleItemResponse } from "@/types";

interface BuyModalProps {
  open: boolean;
  onClose: () => void;
  item: PublicFlashSaleItemResponse | null;
  addresses: AddressResponse[];
}

export function BuyModal({ open, onClose, item, addresses }: BuyModalProps) {
  const t = useTranslations();
  const router = useRouter();
  const pushToast = useUIStore((s) => s.pushToast);
  const [addressId, setAddressId] = useState<number | null>(
    addresses.find((a) => a.isDefault)?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  if (!item) return null;

  const maxQuantity = Math.min(item.userPurchaseLimit, item.availableStock);

  const handleSubmit = async () => {
    if (!addressId) {
      pushToast({ type: "error", message: t("flash-sale.buyModal.selectAddressError") });
      return;
    }
    if (quantity > maxQuantity) {
      pushToast({ type: "error", message: t("flash-sale.buyModal.quantityError", { max: maxQuantity }) });
      return;
    }
    setSubmitting(true);
    try {
      const res = await flashSaleApi.reserve({
        flashSaleItemId: item.id,
        addressId,
        quantity,
      });
      pushToast({
        type: "success",
        message: t("flash-sale.buyModal.success"),
      });
      onClose();
      router.push(`/orders/${res.orderCode}`);
    } catch (err) {
      const msg =
        err instanceof ApiError ? err.message : t("flash-sale.buyModal.errorGeneric");
      pushToast({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={t("flash-sale.buyModal.title")}>
      <div className="space-y-4">
        <div className="rounded-lg bg-red-50 p-3 text-sm dark:bg-red-950">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">
            {item.productName}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {t("flash-sale.buyModal.sku")}: {item.sku} · {t("flash-sale.buyModal.stockOf", {
              available: item.availableStock,
              allocated: item.allocatedStock,
            })}
          </p>
          <p className="mt-1 text-xs">
            {t("flash-sale.buyModal.purchaseLimit", { limit: item.userPurchaseLimit })}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t("flash-sale.buyModal.selectAddress")}
          </label>
          <select
            value={addressId ?? ""}
            onChange={(e) => setAddressId(Number(e.target.value))}
            className="block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">{t("flash-sale.buyModal.selectAddress")}</option>
            {addresses.map((a) => (
              <option key={a.id} value={a.id}>
                {a.contactName} - {a.phone} - {a.ward}, {a.district}
              </option>
            ))}
          </select>
          {addresses.length === 0 && (
            <p className="mt-2 text-xs text-rose-600">
              {t("flash-sale.buyModal.noAddress")}{" "}
              <Link href="/addresses" className="underline">
                {t("flash-sale.buyModal.addressBook")}
              </Link>{" "}
              {t("flash-sale.buyModal.toAdd")}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            {t("flash-sale.buyModal.quantity")}
          </label>
          <Input
            type="number"
            min={1}
            max={maxQuantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
          />
          <p className="mt-1 text-xs text-zinc-500">
            {t("flash-sale.buyModal.maxQuantity", { max: maxQuantity })}
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={submitting}
            disabled={!addressId || maxQuantity <= 0}
          >
            {t("flash-sale.buyModal.submit")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

> Lưu ý: `selectAddress` key dùng cho cả label + option placeholder. Phase sau tách nếu cần.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/flash-sale/BuyModal.tsx
git commit -m "feat(i18n): migrate BuyModal labels, errors, toasts"
```

---

### Task 22: Migrate `app/flash-sales/[slotId]/SlotDetailClient.tsx`

**Files:**
- Modify: `src/app/flash-sales/[slotId]/SlotDetailClient.tsx`

- [ ] **Step 1: Thay các hard-code**

- "Bắt đầu sau" / "Kết thúc sau" → `t('flash-sale.slotDetail.startsIn'|'endsIn')`
- "Vui lòng đăng nhập để mua" → `t('flash-sale.buyModal.requireLogin')`
- "Mua ngay" → `t('flash-sale.buyModal.buyNow')`
- "Hết hàng" → `t('flash-sale.buyModal.outOfStock')`

- [ ] **Step 2: Code hoàn chỉnh**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks";
import { StockProgressBar, Countdown, BuyModal } from "@/components/flash-sale";
import { useFlashSaleStock } from "@/hooks/useFlashSaleWs";
import { formatVND } from "@/lib/decimal";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";
import type {
  PublicFlashSaleItemResponse,
  PublicFlashSaleSlotResponse,
} from "@/types";

type Props = {
  slot: PublicFlashSaleSlotResponse;
};

export function SlotDetailClient({ slot }: Props) {
  const t = useTranslations();
  const [selected, setSelected] = useState<PublicFlashSaleItemResponse | null>(null);
  const toast = useToast();
  const isAuth = useAuthStore((s) => s.accessToken) != null;

  return (
    <>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{slot.title}</h1>
            <p className="text-sm text-zinc-500">
              {formatDate(slot.startTime)} → {formatDate(slot.endTime)}
            </p>
          </div>
          <Countdown
            target={slot.status === "UPCOMING" ? slot.startTime : slot.endTime}
            className="text-lg"
            label={slot.status === "UPCOMING" ? t("flash-sale.slotDetail.startsIn") : t("flash-sale.slotDetail.endsIn")}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slot.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onBuy={() => {
              if (!isAuth) {
                toast.warning(t("flash-sale.buyModal.requireLogin"));
                return;
              }
              setSelected(item);
            }}
          />
        ))}
      </div>

      {selected && (
        <BuyModal
          item={selected}
          open={!!selected}
          addresses={[]}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

function ItemCard({
  item,
  onBuy,
}: {
  item: PublicFlashSaleItemResponse;
  onBuy: () => void;
}) {
  const t = useTranslations();
  const stock = useFlashSaleStock(item.id, item.availableStock);
  const total = item.allocatedStock;
  const flashPrice = Number(item.flashSalePrice);
  const originalPrice = Number(item.originalPrice);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      {flashPrice < originalPrice && (
        <Badge variant="danger">
          -{Math.round(((originalPrice - flashPrice) / originalPrice) * 100)}%
        </Badge>
      )}
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold">
        {item.productName}
      </h3>
      <p className="mt-1 text-xs text-zinc-500">{item.variantName}</p>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-lg font-bold text-red-600">
          {formatVND(flashPrice)}
        </span>
        {flashPrice < originalPrice && (
          <span className="text-xs text-zinc-400 line-through">
            {formatVND(originalPrice)}
          </span>
        )}
      </div>

      <StockProgressBar
        available={stock}
        allocated={total}
      />

      <Button
        className="mt-3 w-full"
        disabled={stock <= 0 || item.status !== "APPROVED"}
        onClick={onBuy}
      >
        {stock <= 0 ? t("flash-sale.buyModal.outOfStock") : t("flash-sale.buyModal.buyNow")}
      </Button>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/flash-sales/[slotId]/SlotDetailClient.tsx
git commit -m "feat(i18n): migrate SlotDetailClient and ItemCard"
```

---

### Phase B Group 2 — Verify

- [ ] **Verify**

```bash
npx tsc --noEmit && npm run lint
```

---

## Phase B Group 3 — Pages (tuần tự)

### Task 23: Migrate `app/page.tsx` (home)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";
import { SLOT_STATUS_VARIANT } from "@/lib/constants";

/**
 * Trang chủ: Hero + danh sách Flash Sale đang/sắp diễn ra.
 * Đây là Server Component — fetch trực tiếp qua apiFetch().
 */
export default async function HomePage() {
  const t = useTranslations("home");  // ❌ — đổi thành getTranslations
  // Sửa thành:
}
```

**Sửa lại** (Server Component phải dùng `getTranslations`):

```tsx
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";

/**
 * Trang chủ: Hero + danh sách Flash Sale đang/sắp diễn ra.
 * Đây là Server Component — fetch trực tiếp qua apiFetch().
 */
export default async function HomePage() {
  const t = await getTranslations("home");
  let slots: Awaited<ReturnType<typeof flashSaleApi.listSlots>> = [];
  let loadError = false;

  try {
    slots = await flashSaleApi.listSlots();
  } catch {
    loadError = true;
  }

  const active = slots.find((s) => s.status === "ACTIVE");
  const upcoming = slots.filter((s) => s.status === "UPCOMING").slice(0, 4);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <section className="rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-orange-500 p-8 text-white">
          <Badge variant="warning">{t("hero.badge")}</Badge>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            {t("hero.title")}
          </h1>
          <p className="mt-2 max-w-xl text-sm opacity-90">
            {t("hero.subtitle")}
          </p>
          <div className="mt-5 flex gap-3">
            <Link href="/flash-sales">
              <Button variant="secondary" size="lg">
                {t("hero.viewAll")}
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-white/40 bg-white/10 text-white"
              >
                {t("hero.browseProducts")}
              </Button>
            </Link>
          </div>
        </section>

        {loadError ? (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
            {t("loadError")}
          </div>
        ) : (
          <>
            {active && (
              <section className="mt-8">
                <div className="mb-3 flex items-center gap-2">
                  <Badge variant="danger">{t("activeSection")}</Badge>
                  <h2 className="text-xl font-bold">{active.title}</h2>
                </div>
                <Link
                  href={`/flash-sales/${active.id}`}
                  className="block rounded-xl border-2 border-red-500 bg-white p-4 hover:shadow-lg dark:bg-zinc-900"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">
                    {active.items[0]?.productName} - {active.items[0]?.variantName}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {t("productCount", { count: active.items.length })}
                  </p>
                </Link>
              </section>
            )}

            {upcoming.length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 text-xl font-bold">{t("upcomingSection")}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {upcoming.map((slot) => (
                    <Link
                      key={slot.id}
                      href={`/flash-sales/${slot.id}`}
                      className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <Badge variant="info">{t(`flash-sale.status.${slot.status}` as any)}</Badge>
                      <h3 className="mt-2 font-semibold">{slot.title}</h3>
                      <p className="text-xs text-zinc-500">
                        {t("productCount", { count: slot.items.length })}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
```

> **Lưu ý**: `t(\`flash-sale.status.${slot.status}\`)` cần ép kiểu `as any` vì TS không thể check dynamic key. Phase sau sẽ cải thiện.

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(i18n): migrate home page hero and sections"
```

---

### Task 24: Migrate `app/products/page.tsx` + `ProductListClient.tsx`

**Files:**
- Modify: `src/app/products/page.tsx`
- Modify: `src/app/products/ProductListClient.tsx`

- [ ] **Step 1: Migrate `page.tsx`**

```tsx
import { Header, Footer } from "@/components/layout";
import { ProductListClient } from "./ProductListClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("product.list");
  return { title: `${t("title")} - FlashSale B2C` };
}

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <ProductListClient />
      </main>
      <Footer />
    </>
  );
}
```

> Title hard-code "Sản phẩm - FlashSale B2C" → dùng `getTranslations`.

- [ ] **Step 2: Migrate `ProductListClient.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Input as InputField } from "@/components/ui";
import { productApi, categoryApi } from "@/lib/api";
import { formatVND } from "@/lib/decimal";
import type { ProductSummaryResponse } from "@/types";

export function ProductListClient() {
  const t = useTranslations();
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [page, setPage] = useState(0);

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.list(),
  });

  const products = useQuery({
    queryKey: ["products", { keyword, categoryId, page }],
    queryFn: () =>
      productApi.list({
        keyword: keyword || undefined,
        categoryId,
        page,
        size: 12,
      }),
  });

  return (
    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="space-y-4">
        <InputField
          label={t("product.list.searchLabel")}
          placeholder={t("product.list.searchPlaceholder")}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(0);
          }}
        />
        <div>
          <h3 className="mb-2 text-sm font-semibold">{t("product.list.categories")}</h3>
          <ul className="space-y-1">
            <li>
              <button
                type="button"
                onClick={() => {
                  setCategoryId(undefined);
                  setPage(0);
                }}
                className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                  !categoryId ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : ""
                }`}
              >
                {t("product.list.all")}
              </button>
            </li>
            {categories.data?.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    setCategoryId(c.id);
                    setPage(0);
                  }}
                  className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    categoryId === c.id ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : ""
                  }`}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <section>
        <h1 className="mb-4 text-2xl font-bold">{t("product.list.title")}</h1>
        {products.isLoading ? (
          <p className="text-sm text-zinc-500">{t("common.loading")}</p>
        ) : products.data?.items.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("product.list.empty")}</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.data?.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {products.data && products.data.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              {t("product.list.prev")}
            </button>
            <span className="text-sm text-zinc-500">
              {t("product.list.pageOf", { page: page + 1, total: products.data.totalPages })}
            </span>
            <button
              type="button"
              disabled={!products.data.hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              {t("product.list.next")}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: ProductSummaryResponse }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <h3 className="line-clamp-2 font-semibold">{product.name}</h3>
      <p className="mt-1 text-xs text-zinc-500">{product.storeName}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-bold text-red-600">
          {formatVND(product.minPrice)}
        </span>
        {product.maxPrice > product.minPrice && (
          <span className="text-xs text-zinc-400">- {formatVND(product.maxPrice)}</span>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/products/
git commit -m "feat(i18n): migrate products list page"
```

---

### Task 25: Migrate `app/products/[id]/page.tsx` + `ProductDetailClient.tsx`

**Files:**
- Modify: `src/app/products/[id]/page.tsx`
- Modify: `src/app/products/[id]/ProductDetailClient.tsx`

- [ ] **Step 1: Migrate `page.tsx`**

```tsx
import { Header, Footer } from "@/components/layout";
import { ProductDetailClient } from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <ProductDetailClient productId={Number(id)} />
      </main>
      <Footer />
    </>
  );
}
```

> File này gần như không có text hard-code (chỉ layout shell) — giữ nguyên hoàn toàn.

- [ ] **Step 2: Migrate `ProductDetailClient.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks";
import { productApi, cartApi } from "@/lib/api";
import { money, formatVND } from "@/lib/decimal";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";

type Props = {
  productId: number;
};

export function ProductDetailClient({ productId }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const toast = useToast();
  const qc = useQueryClient();
  const isAuth = useAuthStore((s) => s.accessToken != null);
  const [variantId, setVariantId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productApi.byId(productId),
  });

  const addMutation = useMutation({
    mutationFn: cartApi.addItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(t("product.detail.addSuccess"));
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t("product.detail.addError"));
    },
  });

  if (isLoading) return <p className="text-sm text-zinc-500">{t("common.loading")}</p>;
  if (!product) return <p>{t("product.detail.notFound")}</p>;

  const selected = product.variants.find((v) => v.id === variantId) ?? product.variants[0];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="aspect-square rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        {/* placeholder */}
      </div>

      <div>
        <Badge variant="info">{product.storeName}</Badge>
        <h1 className="mt-2 text-2xl font-bold">{product.name}</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>

        <div className="mt-4 text-3xl font-bold text-red-600">
          {formatVND(selected?.originalPrice ?? product.minPrice)}
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-semibold">{t("product.detail.variants")}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  selected?.id === v.id
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950"
                    : "border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                }`}
              >
                {v.variantName}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <div className="inline-flex items-center rounded-md border border-zinc-300 dark:border-zinc-700">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1"
            >
              -
            </button>
            <span className="px-3">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1"
            >
              +
            </button>
          </div>
          <Button
            disabled={!selected || selected.stockQuantity <= 0 || addMutation.isPending}
            onClick={() => {
              if (!isAuth) {
                router.push(`/login?next=/products/${productId}`);
                return;
              }
              addMutation.mutate({
                variantId: selected!.id,
                quantity: qty,
              });
            }}
          >
            {selected && selected.stockQuantity <= 0 ? t("product.detail.outOfStock") : t("product.detail.addToCart")}
          </Button>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          {t("product.detail.stock", { count: selected?.stockQuantity ?? 0 })}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/app/products/[id]/
git commit -m "feat(i18n): migrate product detail page"
```

---

### Task 26: Migrate `app/cart/page.tsx`

**Files:**
- Modify: `src/app/cart/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { CartView } from "@/components/cart";
import { useAuthStore } from "@/stores/auth.store";

export default function CartPage() {
  const t = useTranslations();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (typeof window !== "undefined" && !accessToken) {
      router.replace("/login?next=/cart");
    }
  }, [accessToken, router]);

  if (!accessToken) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-zinc-500">
          {t("common.redirecting")}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("cart.view.title")}</h1>
        <CartView />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/cart/page.tsx
git commit -m "feat(i18n): migrate cart page"
```

---

### Task 27: Migrate `app/checkout/page.tsx`

**Files:**
- Modify: `src/app/checkout/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { cartApi, orderApi, voucherApi, addressApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { money, formatVND } from "@/lib/decimal";
import { ApiError } from "@/lib/api/errors";
import type { AddressResponse, CartStoreGroup as CartGroup } from "@/types";

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const toast = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [addressId, setAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"ZALOPAY" | "COD">("ZALOPAY");
  const [voucherCode, setVoucherCode] = useState<Record<number, string>>({});
  const [voucherDiscount, setVoucherDiscount] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/checkout");
  }, [accessToken, router]);

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.get,
    enabled: !!accessToken,
  });

  const checkoutMutation = useMutation({
    mutationFn: orderApi.checkout,
    onSuccess: (orders) => {
      toast.success(t("checkout.createdOrders", { count: orders.length }));
      router.push(`/orders/${orders[0].orderCode}`);
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t("checkout.paymentFailed"));
    },
  });

  if (!accessToken) return null;
  if (cart.isLoading) {
    return <main className="p-10 text-center text-sm">{t("checkout.loading")}</main>;
  }
  if (!cart.data || cart.data.storeGroups.length === 0) {
    return (
      <>
        <Header />
        <main className="p-10 text-center text-sm text-zinc-500">
          {t("checkout.emptyCart")}{" "}
          <Link href="/products" className="text-red-600 underline">
            {t("common.goShopping")}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const groups = cart.data.storeGroups;

  const submit = async () => {
    if (!addressId) {
      toast.warning(t("checkout.selectAddress"));
      return;
    }
    const storeOrders = groups.map((g: CartGroup) => ({
      storeId: g.storeId,
      items: g.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      voucherCode: voucherCode[g.storeId] || undefined,
      note: undefined as string | undefined,
    }));
    checkoutMutation.mutate({
      shippingAddressId: addressId,
      paymentMethod,
      storeOrders,
    });
  };

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("checkout.title")}</h1>

        <Section title={t("checkout.addressSection")}>
          <AddressSelector selectedId={addressId} onSelect={setAddressId} />
        </Section>

        <Section title={t("checkout.paymentSection")}>
          <div className="flex gap-3">
            {(["ZALOPAY", "COD"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setPaymentMethod(m)}
                className={`rounded-md border px-4 py-2 text-sm ${
                  paymentMethod === m
                    ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-950"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {m === "ZALOPAY" ? t("checkout.zaloPay") : t("checkout.cod")}
              </button>
            ))}
          </div>
        </Section>

        <Section title={t("checkout.storesSection")}>
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.storeId} className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="font-semibold">{g.storeName}</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {g.items.map((it) => (
                    <li key={it.variantId} className="flex justify-between">
                      <span>{it.productName} × {it.quantity}</span>
                      <span>{formatVND(Number(it.price) * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-end gap-2">
                  <InputField
                    label={t("checkout.voucherLabel")}
                    value={voucherCode[g.storeId] ?? ""}
                    onChange={(e) =>
                      setVoucherCode((p) => ({ ...p, [g.storeId]: e.target.value }))
                    }
                    placeholder={t("checkout.voucherPlaceholder")}
                  />
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const code = voucherCode[g.storeId];
                      if (!code) return;
                      try {
                        const res = await voucherApi.apply({
                          code,
                          storeId: g.storeId,
                          subtotalAmount: g.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0),
                        });
                        setVoucherDiscount((p) => ({ ...p, [g.storeId]: res.discountAmount }));
                        toast.success(t("checkout.voucherDiscount", { amount: formatVND(res.discountAmount) }));
                      } catch (err) {
                        toast.error(err instanceof ApiError ? err.message : t("checkout.voucherInvalid"));
                      }
                    }}
                  >
                    {t("checkout.voucherApply")}
                  </Button>
                </div>
                {voucherDiscount[g.storeId] ? (
                  <p className="mt-1 text-xs text-emerald-600">
                    {t("checkout.voucherDiscount", { amount: formatVND(voucherDiscount[g.storeId]) })}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </Section>

        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={submit}
            loading={checkoutMutation.isPending}
          >
            {t("checkout.submit")}
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function AddressSelector({
  selectedId,
  onSelect,
}: {
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const t = useTranslations();
  const { data: addresses } = useQuery<AddressResponse[]>({
    queryKey: ["addresses"],
    queryFn: () => addressApi.list(),
  });

  if (!addresses || addresses.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        {t("checkout.noAddress")}{" "}
        <Link href="/addresses" className="text-red-600 underline">
          {t("checkout.addAddress")}
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {addresses.map((a) => (
        <label
          key={a.id}
          className={`block rounded-md border p-3 text-sm cursor-pointer ${
            selectedId === a.id
              ? "border-red-500 bg-red-50 dark:bg-red-950"
              : "border-zinc-300 dark:border-zinc-700"
          }`}
        >
          <input
            type="radio"
            name="address"
            className="mr-2"
            checked={selectedId === a.id}
            onChange={() => onSelect(a.id)}
          />
          <strong>{a.contactName}</strong> · {a.phone}
          <br />
          <span className="text-zinc-500">
            {a.detailAddress}, {a.ward}, {a.district}, {a.province}
          </span>
        </label>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/checkout/
git commit -m "feat(i18n): migrate checkout page"
```

---

### Task 28: Migrate `app/addresses/page.tsx`

**Files:**
- Modify: `src/app/addresses/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { addressApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { VIETNAM_PROVINCES } from "@/lib/constants";
import { ApiError } from "@/lib/api/errors";
import { addressSchema } from "@/lib/validators/address.validator";
import type { AddressResponse } from "@/types";

export default function AddressesPage() {
  const t = useTranslations();
  const router = useRouter();
  const toast = useToast();
  const qc = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);

  const [editing, setEditing] = useState<AddressResponse | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/addresses");
  }, [accessToken, router]);

  const addresses = useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressApi.list(),
    enabled: !!accessToken,
  });

  const del = useMutation({
    mutationFn: addressApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(t("address.list.deleteSuccess"));
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("toast.common.error")),
  });

  const setDefault = useMutation({
    mutationFn: addressApi.setDefault,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["addresses"] });
      toast.success(t("address.list.setDefaultSuccess"));
    },
  });

  if (!accessToken) return null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("address.list.title")}</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
            {t("address.list.add")}
          </Button>
        </div>

        {addresses.isLoading ? (
          <p className="text-sm text-zinc-500">{t("common.loading")}</p>
        ) : addresses.data?.length === 0 ? (
          <p className="text-sm text-zinc-500">{t("address.list.empty")}</p>
        ) : (
          <div className="space-y-3">
            {addresses.data?.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div>
                  <p className="font-semibold">
                    {a.contactName} · {a.phone}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {a.detailAddress}, {a.ward}, {a.district}, {a.province}
                  </p>
                  {a.isDefault && (
                    <span className="mt-1 inline-block rounded bg-red-50 px-2 py-0.5 text-xs text-red-700">
                      {t("address.list.default")}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {!a.isDefault && (
                    <Button size="sm" variant="outline" onClick={() => setDefault.mutate(a.id)}>
                      {t("address.list.setDefault")}
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => { setEditing(a); setFormOpen(true); }}>
                    {t("address.list.edit")}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => del.mutate(a.id)}>
                    {t("address.list.delete")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {formOpen && (
          <AddressForm
            initial={editing}
            onClose={() => setFormOpen(false)}
            onSaved={() => {
              setFormOpen(false);
              qc.invalidateQueries({ queryKey: ["addresses"] });
            }}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

function AddressForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: AddressResponse | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const t = useTranslations();
  const toast = useToast();
  const [form, setForm] = useState({
    contactName: initial?.contactName ?? "",
    phone: initial?.phone ?? "",
    province: initial?.province ?? "",
    district: initial?.district ?? "",
    ward: initial?.ward ?? "",
    detailAddress: initial?.detailAddress ?? "",
    isDefault: initial?.isDefault ?? false,
  });

  const save = useMutation({
    mutationFn: async () => {
      const parsed = addressSchema.parse({
        contactName: form.contactName,
        phone: form.phone,
        province: form.province,
        district: form.district,
        ward: form.ward,
        detailAddress: form.detailAddress,
      });
      if (initial) {
        return addressApi.update(initial.id, parsed);
      }
      return addressApi.create({ ...parsed, isDefault: form.isDefault });
    },
    onSuccess: () => {
      toast.success(t("address.list.saveSuccess"));
      onSaved();
    },
    onError: (err) => {
      if (err instanceof ApiError) toast.error(err.message);
      else toast.error(t("address.form.validationError"));
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 dark:bg-zinc-900">
        <h2 className="mb-4 text-lg font-semibold">
          {initial ? t("address.form.editTitle") : t("address.form.addTitle")}
        </h2>
        <div className="space-y-3">
          <InputField
            label={t("address.form.contactName")}
            value={form.contactName}
            onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
          />
          <InputField
            label={t("address.form.phone")}
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <label className="block">
            <span className="mb-1 block text-sm">{t("address.form.province")}</span>
            <select
              value={form.province}
              onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            >
              <option value="">{t("address.form.selectPlaceholder")}</option>
              {VIETNAM_PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <InputField
            label={t("address.form.district")}
            value={form.district}
            onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
          />
          <InputField
            label={t("address.form.ward")}
            value={form.ward}
            onChange={(e) => setForm((p) => ({ ...p, ward: e.target.value }))}
          />
          <InputField
            label={t("address.form.detail")}
            value={form.detailAddress}
            onChange={(e) => setForm((p) => ({ ...p, detailAddress: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
            />
            {t("address.form.isDefault")}
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>{t("common.cancel")}</Button>
          <Button onClick={() => save.mutate()} loading={save.isPending}>
            {t("common.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/addresses/
git commit -m "feat(i18n): migrate addresses page"
```

---

### Task 29: Migrate `app/profile/page.tsx`

**Files:**
- Modify: `src/app/profile/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { Button, Input as InputField } from "@/components/ui";
import { useToast } from "@/hooks";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { ApiError } from "@/lib/api/errors";
import { changePasswordSchema } from "@/lib/validators/auth.validator";

export default function ProfilePage() {
  const t = useTranslations();
  const router = useRouter();
  const toast = useToast();
  const accessToken = useAuthStore((s) => s.accessToken);
  const userProfile = useAuthStore((s) => s.user);

  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/profile");
  }, [accessToken, router]);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => authApi.me(),
    enabled: !!accessToken,
  });

  const changePwd = useMutation({
    mutationFn: authApi.changePassword,
    onSuccess: () => {
      toast.success(t("profile.success"));
      setPwd({ oldPassword: "", newPassword: "", confirm: "" });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : t("toast.common.error")),
  });

  const logout = () => {
    useAuthStore.getState().clear();
    router.push("/login");
  };

  if (!accessToken) return null;

  const profile = me.data ?? userProfile;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("profile.title")}</h1>

        {profile && (
          <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-3 font-semibold">{t("profile.info")}</h2>
            <dl className="space-y-1 text-sm">
              <Row label={t("profile.email")} value={profile.email} />
              <Row label={t("profile.fullName")} value={profile.fullName ?? "—"} />
              <Row label={t("profile.phone")} value={profile.phone ?? "—"} />
            </dl>
          </section>
        )}

        <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 font-semibold">{t("profile.changePassword")}</h2>
          <div className="space-y-3">
            <InputField
              label={t("profile.oldPassword")}
              type="password"
              value={pwd.oldPassword}
              onChange={(e) => setPwd((p) => ({ ...p, oldPassword: e.target.value }))}
            />
            <InputField
              label={t("profile.newPassword")}
              type="password"
              value={pwd.newPassword}
              onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
            />
            <InputField
              label={t("profile.confirmNew")}
              type="password"
              value={pwd.confirm}
              onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))}
            />
            <Button
              onClick={() => {
                try {
                  const parsed = changePasswordSchema.parse(pwd);
                  changePwd.mutate({
                    oldPassword: parsed.oldPassword,
                    newPassword: parsed.newPassword,
                  });
                } catch (e) {
                  toast.error(t("profile.confirmMismatch"));
                }
              }}
              loading={changePwd.isPending}
            >
              {t("profile.submit")}
            </Button>
          </div>
        </section>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={logout}>
            {t("profile.logout")}
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-100 py-1 dark:border-zinc-800">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/profile/
git commit -m "feat(i18n): migrate profile page"
```

---

### Task 30: Migrate `app/orders/page.tsx`

**Files:**
- Modify: `src/app/orders/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { OrderCard } from "@/components/order";
import { orderApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";

export default function OrdersPage() {
  const t = useTranslations();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (!accessToken) router.replace("/login?next=/orders");
  }, [accessToken, router]);

  const orders = useQuery({
    queryKey: ["orders", "mine"],
    queryFn: () => orderApi.myList({ page: 0, size: 20 }),
    enabled: !!accessToken,
  });

  if (!accessToken) return null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("order.list.title")}</h1>
        {orders.isLoading ? (
          <p className="text-sm text-zinc-500">{t("common.loading")}</p>
        ) : orders.data?.items.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {t("order.list.empty")}{" "}
            <Link href="/products" className="text-red-600 underline">
              {t("common.goShopping")}
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {orders.data?.items.map((o) => (
              <OrderCard key={o.orderCode} order={o} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/orders/page.tsx
git commit -m "feat(i18n): migrate orders list page"
```

---

### Task 31: Migrate `app/orders/[orderCode]/page.tsx`

**Files:**
- Modify: `src/app/orders/[orderCode]/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Header, Footer } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { useToast } from "@/hooks";
import { QrCard } from "@/components/flash-sale";
import { Countdown } from "@/components/flash-sale";
import { orderApi } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { useFlashSaleWs } from "@/hooks/useFlashSaleWs";
import { formatVND } from "@/lib/decimal";
import { ApiError } from "@/lib/api/errors";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderCode: string }>;
}) {
  const t = useTranslations();
  const tStatus = useTranslations("order.status");
  const tPay = useTranslations("payment.status");
  const router = useRouter();
  const toast = useToast();
  const qc = useQueryClient();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [resolvedCode, setResolvedCode] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setResolvedCode(p.orderCode));
  }, [params]);

  useEffect(() => {
    if (!accessToken) router.replace(`/login?next=/orders`);
  }, [accessToken, router]);

  const order = useQuery({
    queryKey: ["order", resolvedCode],
    queryFn: () => orderApi.byCode(resolvedCode!),
    enabled: !!resolvedCode && !!accessToken,
    refetchInterval: 10_000,
  });

  const cancel = useMutation({
    mutationFn: () => orderApi.cancelByCode(resolvedCode!),
    onSuccess: () => {
      toast.success(t("order.detail.cancelSuccess"));
      qc.invalidateQueries({ queryKey: ["order", resolvedCode] });
    },
    onError: (err) => {
      toast.error(err instanceof ApiError ? err.message : t("order.detail.cancelError"));
    },
  });

  const wsRef = useRef<ReturnType<typeof useFlashSaleWs> | null>(null);
  wsRef.current = useFlashSaleWs();
  useEffect(() => {
    if (!resolvedCode) return;
    const ws = wsRef.current;
    if (!ws) return;
    const unsub = ws.subscribeOrderUpdates(resolvedCode, () => {
      qc.invalidateQueries({ queryKey: ["order", resolvedCode] });
    });
    return () => unsub?.();
  }, [resolvedCode, qc]);

  if (!accessToken || !resolvedCode) return null;
  if (order.isLoading) {
    return (
      <main className="p-10 text-center text-sm">{t("order.detail.loading")}</main>
    );
  }
  if (!order.data) {
    return <main className="p-10 text-center text-sm">{t("order.detail.notFound")}</main>;
  }

  const o = order.data;
  const ttlTarget = o.expiresAt ?? null;

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t("order.detail.title", { orderCode: o.orderCode })}</h1>
          <Badge
            variant={
              o.status === "PAID" || o.status === "CONFIRMED" || o.status === "SHIPPING" || o.status === "COMPLETED"
                ? "success"
                : o.status === "CANCELLED_TIMEOUT" || o.status === "CANCELLED_USER"
                  ? "default"
                  : "warning"
            }
          >
            {tStatus(o.status)}
          </Badge>
        </div>

        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm text-zinc-500">{t("order.detail.store")}</p>
            <p className="font-medium">{o.storeName}</p>
          </div>
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {o.items.map((it) => (
              <li key={it.id} className="flex justify-between py-2 text-sm">
                <span>
                  {it.productName} × {it.quantity}
                </span>
                <span>{formatVND(it.itemSubtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-3 font-bold">
            <span>{t("order.detail.total")}</span>
            <span className="text-red-600">{formatVND(o.totalAmount)}</span>
          </div>
        </div>

        {o.status === "PENDING_PAYMENT" && o.payment?.qrCodeData && (
          <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50 p-4 dark:bg-amber-950">
            <div className="flex items-center justify-between">
              <Badge variant="warning">{t("order.detail.pendingPayment")}</Badge>
              {ttlTarget && (
                <Countdown target={ttlTarget} label={t("order.detail.expiresIn")} />
              )}
            </div>
            <h2 className="mt-3 text-lg font-semibold">
              {t("order.detail.scanQr")}
            </h2>
            <p className="text-xs text-zinc-500">
              {tPay(o.payment.status)}
            </p>
            <div className="mt-3 flex justify-center">
              <QrCard order={o} payment={o.payment} />
            </div>
            <p className="mt-2 text-center text-sm font-semibold">
              {t("order.detail.amount")}: {formatVND(o.payment.amount)}
            </p>
          </div>
        )}

        {(o.status === "PENDING_PAYMENT") && (
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => cancel.mutate()}
              loading={cancel.isPending}
            >
              {t("order.detail.cancel")}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/orders/[orderCode]/
git commit -m "feat(i18n): migrate order detail page"
```

---

### Task 32: Migrate `app/flash-sales/page.tsx`

**Files:**
- Modify: `src/app/flash-sales/page.tsx`

- [ ] **Step 1: Code hoàn chỉnh**

```tsx
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Header, Footer } from "@/components/layout";
import { Badge } from "@/components/ui";
import { flashSaleApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Countdown } from "@/components/flash-sale";

export async function generateMetadata() {
  const t = await getTranslations("flash-sale.list");
  return { title: `${t("title")} - FlashSale B2C` };
}

export default async function FlashSalesPage() {
  const t = await getTranslations();
  const tStatus = await getTranslations("flash-sale.status");
  const slots = await flashSaleApi.listSlots();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold">{t("flash-sale.list.title")}</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <Link
              key={slot.id}
              href={`/flash-sales/${slot.id}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-2 flex items-center justify-between">
                <Badge
                  variant={
                    slot.status === "ACTIVE"
                      ? "danger"
                      : slot.status === "UPCOMING"
                        ? "info"
                        : "default"
                  }
                >
                  {tStatus(slot.status)}
                </Badge>
                {slot.status === "UPCOMING" && (
                  <Countdown target={slot.startTime} label={t("flash-sale.slot.startsIn")} />
                )}
                {slot.status === "ACTIVE" && (
                  <Countdown target={slot.endTime} label={t("flash-sale.slot.endsIn")} />
                )}
              </div>
              <h2 className="text-lg font-semibold">{slot.title}</h2>
              <p className="mt-1 text-sm text-zinc-500">
                {formatDate(slot.startTime)} → {formatDate(slot.endTime)}
              </p>
              <p className="mt-2 text-xs text-zinc-400">
                {t("flash-sale.list.items", { count: slot.items.length })}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/app/flash-sales/page.tsx
git commit -m "feat(i18n): migrate flash-sales list page"
```

---

### Task 33: Migrate `app/flash-sales/[slotId]/page.tsx`

**Files:**
- Modify: `src/app/flash-sales/[slotId]/page.tsx`

- [ ] **Step 1: Verify file không có text hard-code**

File này chỉ là layout shell (`Header`, `Footer`, `SlotDetailClient`). Không có text UI cần migrate.

- [ ] **Step 2: Skip — không cần sửa**

```bash
echo "Page is layout shell, no i18n changes needed"
```

> Commit (nếu muốn): không cần vì file không đổi.

---

### Phase B Group 3 — Verify

- [ ] **Verify Group 3**

```bash
npx tsc --noEmit && npm run lint
```

Expected: 0 lỗi.

- [ ] **Commit checkpoint**

```bash
git add .
git commit -m "chore(i18n): group 3 checkpoint"
```

---

## Phase C — Final Verification

### Task 34: Audit cuối — grep hard-code text

**Files:**
- (no file change)

- [ ] **Step 1: Grep hard-code Vietnamese text còn sót**

```bash
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
# Tìm các cụm tiếng Việt đặc trưng trong JSX
grep -rn --include="*.tsx" -E "(Đăng nhập|Đăng ký|Mật khẩu|Sản phẩm|Giỏ hàng|Đơn hàng|Tài khoản|Hết hàng|Mua ngay|Đặt hàng|Thanh toán)" src/app src/components 2>/dev/null | grep -v "/test/" | head -50
```

Expected: chỉ còn text trong `messages/vi.json` (file bắt đầu bằng `{`).

- [ ] **Step 2: Grep hard-code English "Loading..." còn sót**

```bash
grep -rn --include="*.tsx" "Loading..." src/ 2>/dev/null
```

Expected: 0 dòng.

- [ ] **Step 3: Grep `ORDER_STATUS_LABEL|SLOT_STATUS_LABEL|PAYMENT_STATUS_LABEL` còn sót**

```bash
grep -rn --include="*.ts*" "ORDER_STATUS_LABEL\|SLOT_STATUS_LABEL\|PAYMENT_STATUS_LABEL" src/ 2>/dev/null
```

Expected: 0 dòng (đã xoá ở Phase A).

---

### Task 35: Build cuối

- [ ] **Step 1: Run build**

```bash
cd D:\code\ky_I_nam_4\Project\flash-sale-b2c-fe
npm run build
```

Expected: build pass, không lỗi TypeScript, không lỗi ESLint.

- [ ] **Step 2: Smoke test bằng dev server**

```bash
npm run dev
```

Mở trình duyệt:
- [ ] `/` → hiển thị tiếng Việt (hero, section)
- [ ] `/en/` → hiển thị tiếng Anh (cùng nội dung)
- [ ] `/login` → tiếng Việt (label "Email", "Mật khẩu", button "Đăng nhập")
- [ ] `/en/login` → tiếng Anh (label "Email", "Password", button "Log in")
- [ ] Click `<LocaleSwitcher>` ở header → đổi locale, URL đổi (`/login` ↔ `/en/login`)

---

### Task 36: Commit cuối + Báo cáo

- [ ] **Step 1: Commit nếu có fix cuối**

```bash
git add .
git commit -m "feat(i18n): phase 1 final cleanup"
```

> Nếu đã commit hết, skip.

- [ ] **Step 2: Tạo summary commit**

```bash
git log --oneline -20
```

Expected output (10+ commits, tất cả `feat(i18n)`):
```
feat(i18n): phase 1 final cleanup
feat(i18n): migrate flash-sales list page
feat(i18n): migrate order detail page
feat(i18n): migrate orders list page
feat(i18n): migrate profile page
feat(i18n): migrate addresses page
feat(i18n): migrate checkout page
feat(i18n): migrate cart page
feat(i18n): migrate product detail page
feat(i18n): migrate products list page
feat(i18n): migrate home page hero and sections
feat(i18n): migrate BuyModal labels, errors, toasts
feat(i18n): migrate QrCard labels and status
feat(i18n): migrate SlotCard status and countdown label
feat(i18n): migrate CartView
feat(i18n): migrate register page and form
feat(i18n): migrate login page and form
feat(i18n): migrate OrderCard status and item count
feat(i18n): migrate CartItemRow labels
feat(i18n): migrate StockProgressBar labels
feat(i18n): migrate Countdown label to useTranslations
feat(i18n): migrate Footer to useTranslations
feat(i18n): migrate Header to useTranslations
feat(i18n): add LocaleSwitcher component
feat(i18n): wrap root layout with NextIntlClientProvider
feat(i18n): wire next-intl middleware into Next 16 proxy
feat(i18n): add English messages (mirror vi.json)
feat(i18n): add Vietnamese messages (13 namespaces)
feat(i18n): add server-side i18n config loader
feat(i18n): add routing config with vi/en locales
chore: add next-intl for i18n migration
```

---

## Definition of Done (Phase 1)

- [ ] Tất cả 36 task xong.
- [ ] `npx tsc --noEmit` không lỗi.
- [ ] `npm run lint` không lỗi.
- [ ] `npm run build` pass.
- [ ] Grep hard-code text còn 0 dòng trong `src/app/`, `src/components/`.
- [ ] Smoke test 5 route (vi + en) OK.
- [ ] KHÔNG push (theo rule `git-workflow.mdc`).
- [ ] Báo cáo user theo format AGENTS.md (xem cuối plan).

---

## Báo cáo sau khi hoàn thành (format AGENTS.md)

Sau khi tất cả task done, output báo cáo:

```text
## Changes
- Phase 1 i18n migration: 30+ file migrated, 2 messages files (vi + en, 13 namespaces top-level).
- Thêm next-intl@^4.0.0 vào package.json.
- Tạo src/i18n/{routing,request,navigation}.ts, src/components/layout/LocaleSwitcher.tsx.
- Wire createIntlMiddleware vào src/proxy.ts.
- Wrap NextIntlClientProvider trong src/app/layout.tsx.
- Xoá ORDER_STATUS_LABEL, SLOT_STATUS_LABEL, PAYMENT_STATUS_LABEL trong lib/constants.ts.

## Implementation
- 30 file migrate theo 3 group (Foundation → Group 1 → Group 2 → Group 3).
- Mỗi file ~1 commit riêng (atomic).
- Locale switcher đơn giản (button), dùng router.replace(pathname, { locale }).
- `localePrefix: 'as-needed'` → vi mặc định không prefix, en có prefix /en/.

## API / WS
- (không có)

## Tests
- Build: `npm run build` → PASS (cuối plan)
- Lint: `npm run lint` → PASS (cuối plan)
- TS: `npx tsc --noEmit` → PASS (cuối plan)
- Manual smoke:
  - `/` (vi) → hero tiếng Việt
  - `/en/` (en) → hero tiếng Anh
  - `/login` (vi) → label Việt
  - `/en/login` (en) → label Anh
  - LocaleSwitcher đổi locale OK

## Notes
- 2 messages files (vi + en) đồng bộ key 100% (verify bằng script node).
- Footer dùng `defaultMessage` cho nav keys chưa có trong messages — phase sau sẽ thêm keys.
- `<Suspense fallback>` text hard-code "..." thay vì "Đang tải..." → sẽ thêm key `common.loading` phase sau (hiện đã có key, có thể refactor).
- Chưa áp dụng cho Seller/Admin (chưa có code) → sẽ làm phase sau khi có.
- Không viết test (theo quyết định spec mục 12 — i18n là text refactor thuần).
- KHÔNG push (theo rule git-workflow.mdc).
```

---

## Phụ thuộc & Cảnh báo

### Phụ thuộc giữa các task

```
Task 1 (cài package)
  ↓
Task 2 (routing.ts)
  ↓
Task 3 (request.ts)
  ↓
Task 4 (vi.json)
  ↓
Task 5 (en.json)
  ↓
Task 6 (proxy.ts)
  ↓
Task 7 (layout.tsx)
  ↓
Task 8 (LocaleSwitcher.tsx)
  ↓
Task 9 (xoá *_STATUS_LABEL — KHÔNG commit)
  ↓
┌──────────────┬─────────────┬──────────────┐
Task 10 (Header) Task 11 (Footer) Task 12-17 (Group 1 còn lại)
└──────────────┴─────────────┴──────────────┘
  ↓ (song song xong mới tiếp)
Task 18-22 (Group 2 — phụ thuộc Group 1)
  ↓
Task 23-33 (Group 3 — Pages)
  ↓
Task 34-36 (Verify + commit + báo cáo)
```

### Cảnh báo

1. **PowerShell `-replace`**: KHÔNG dùng để replace JSON (xem `workflow-process.mdc` Notes). Dùng `StrReplace` cho từng file, hoặc `Write` nguyên file.
2. **Server vs Client**:
   - Server Component → `getTranslations` (async).
   - Client Component (`'use client'`) → `useTranslations` (sync).
3. **`Link`/`useRouter`**:
   - Đã import từ `next/link` → đổi sang `@/i18n/navigation`.
   - Đã import từ `next/navigation` (`useRouter`, `usePathname`, `redirect`) → đổi sang `@/i18n/navigation`.
4. **`useSearchParams`**: GIỮ nguyên từ `next/navigation` (KHÔNG đổi sang `@/i18n/navigation` — vì `useSearchParams` không có trong createNavigation).
5. **`next-intl/middleware` default export**: trong Next 16, default export giữ nguyên, chỉ wrap trong handler function.
6. **JSON validation**: Mỗi lần sửa `messages/*.json`, chạy `node -e "JSON.parse(require('fs').readFileSync('messages/vi.json','utf8'))"` để verify valid.
7. **Commit atomic**: Mỗi task = 1 commit riêng, KHÔNG batch.