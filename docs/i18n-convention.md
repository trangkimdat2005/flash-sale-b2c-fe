# i18n Convention — Messages Structure & Reference Data

> File này chứa **data tham chiếu** về cấu trúc messages, namespace list, error code mapping. Policy thật ở `.cursor/rules/i18n.mdc` (load theo glob trong file đó).

## 1. Namespace Convention

Mỗi component / feature có namespace riêng theo concern:

| Component / feature | Namespace |
|---|---|
| `LoginForm` | `auth.login` |
| `RegisterForm` | `auth.register` |
| `Header` | `common.header` |
| `Footer` | `common.footer` |
| `Cart` | `cart` |
| `CheckoutForm` | `checkout` |
| `OrderList` | `order.list` |
| `OrderDetail` | `order.detail` |
| `FlashSaleSlot` | `flash-sale.slot` |
| `Countdown` | `flash-sale.countdown` |
| `ProductCard` | `product.card` |
| `Voucher` | `voucher` |
| `ErrorPage` | `error` |
| `common.*` (loading, retry, cancel, save...) | `common` |

> **Khi thêm component mới**: chọn namespace theo bảng này, nếu không có → thêm row mới vào bảng.

## 2. messages/vi.json — Common + Auth + Order mẫu

```json
{
  "common": {
    "appName": "Flash Sale B2C",
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
    "noData": "Không có dữ liệu"
  },
  "auth": {
    "login": {
      "title": "Đăng nhập",
      "email": "Email",
      "password": "Mật khẩu",
      "submit": "Đăng nhập",
      "noAccount": "Chưa có tài khoản?",
      "registerLink": "Đăng ký ngay"
    }
  },
  "order": {
    "status": {
      "PENDING": "Chờ xác nhận",
      "CONFIRMED": "Đã xác nhận",
      "SHIPPING": "Đang giao",
      "DELIVERED": "Đã giao",
      "CANCELLED": "Đã huỷ"
    }
  }
}
```

## 3. messages/en.json — Common + Auth + Order mẫu

```json
{
  "common": {
    "appName": "Flash Sale B2C",
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
    "noData": "No data"
  },
  "auth": {
    "login": {
      "title": "Login",
      "email": "Email",
      "password": "Password",
      "submit": "Login",
      "noAccount": "Don't have an account?",
      "registerLink": "Sign up"
    }
  },
  "order": {
    "status": {
      "PENDING": "Pending",
      "CONFIRMED": "Confirmed",
      "SHIPPING": "Shipping",
      "DELIVERED": "Delivered",
      "CANCELLED": "Cancelled"
    }
  }
}
```

## 4. Error keys (namespace `error`)

Key trùng với `ApiError.code` từ backend:

```json
// vi
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

```json
// en
{
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

→ Khi backend thêm code mới → thêm key vào cả `vi.json` + `en.json`.

## 5. Enum status labels (namespace `*.status`)

Xem chi tiết ở `enum-labels.mdc`. Pattern: `<module>.status.<ENUM_VALUE>` → nhãn đa ngôn ngữ.

## 6. Plural syntax (ICU MessageFormat)

```json
{
  "cart": {
    "items": "{count, plural, =0 {Giỏ hàng trống} =1 {1 sản phẩm} other {# sản phẩm}}"
  },
  "order": {
    "minutesAgo": "{minutes, plural, =0 {vừa xong} =1 {1 phút trước} other {# phút trước}}"
  }
}
```

→ Sử dụng: `t('cart.items', { count: items.length })`.

## 7. Khi thêm key mới — checklist

```
1. Xác định namespace (xem bảng mục 1, hoặc thêm mới)
2. Thêm key + giá trị vào messages/vi.json
3. Thêm key + giá trị tương ứng vào messages/en.json
4. Nếu là enum status → cập nhật constants.ts + variant map (xem enum-labels.mdc)
5. Nếu là error code mới → cập nhật ApiError handling trong lib/api/errors.ts
6. Chạy build + lint → đảm bảo không có key nào thiếu
7. Nếu là 1 enum mới có nhiều status → báo user trong review
```