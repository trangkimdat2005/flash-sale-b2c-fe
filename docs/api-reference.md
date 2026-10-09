# API Reference â€“ Chi Tiết Từng Module

File này chứa chi tiết request/response/error của **từng** module. Đọc khi cần tích hợp endpoint cụ thỒ.

> Tài liá»‡u gá»‘c: `docs/api-document.md` (project) và Swagger UI: `http://180.93.137.28/swagger-ui/index.html#/`

---

## Mục Lục

1. [Auth Module `/api/v1/auth`](#auth-module-apiv1auth)
2. [User Profile `/api/v1/users`](#user-profile-module-apiv1users)
3. [Address Book `/api/v1/users/addresses`](#address-book-module-apiv1usersaddresses)
4. [Store `/api/v1/stores`](#store-module-apiv1stores)
5. [Admin Store `/api/v1/admin/stores`](#admin-store-module-apiv1adminstores)
6. [Category `/api/v1/categories`](#category-module-apiv1categories)
7. [Admin Category `/api/v1/admin/categories`](#admin-category-module-apiv1admincategories)
8. [Product Public `/api/v1/products`](#product-public-module-apiv1products)
9. [Seller Product `/api/v1/seller/products`](#seller-product-module-apiv1sellerproducts)
10. [Flash Sale Public `/api/v1/flash-sales/slots`](#flash-sale-public-module-apiv1flashsalesslots)
11. [Flash Sale Reservation `/api/v1/flash-sales/reservations`](#flash-sale-reservation-module-apiv1flashsalesreservations)
12. [Admin Flash Sale `/api/v1/admin/flash-sales`](#admin-flash-sale-module-apiv1adminflashsales)
13. [Seller Flash Sale `/api/v1/seller/flash-sales`](#seller-flash-sale-module-apiv1sellerflashsales)
14. [Cart `/api/v1/cart`](#cart-module-apiv1cart)
15. [Order Buyer `/api/v1/orders`](#order-buyer-module-apiv1orders)
16. [Seller Order `/api/v1/seller/orders`](#seller-order-module-apiv1sellerorders)
17. [Voucher `/api/v1/vouchers`](#voucher-module-apiv1vouchers)
18. [Seller Voucher `/api/v1/seller/vouchers`](#seller-voucher-module-apiv1sellervouchers)
19. [Admin Voucher `/api/v1/admin/vouchers`](#admin-voucher-module-apiv1adminvouchers)
20. [WebSocket Realtime](#websocket-realtime)
21. [Bảng Mã Lá»—i Tá»•ng Hợp](#bảng-mã-lá»—i-tá»•ng-hợp)

---

## Auth Module `/api/v1/auth`

Tag Swagger: `Authentication`. **4 endpoints public.**

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/auth/register` | ĐĒng ký (mặc Ä‘á»‹nh role BUYER) |
| `POST` | `/auth/login` | ĐĒng nhập |
| `POST` | `/auth/refresh-token` | Lấy accessToken má»›i |
| `POST` | `/auth/logout` | Logout client-side |

### `POST /auth/register`

**Request:**
```json
{
  "email": "buyer@example.com",      // required, @Email
  "password": "secret123",            // required, min 6
  "fullName": "Nguyá»…n VĒn A",         // required, max 100
  "phone": "0987654321",              // optional, max 15
  "role": "BUYER"                     // optional, default BUYER, có thỒ "SELLER"
}
```

**Response 201:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "tokenType": "Bearer",
  "expiresIn": 3600000,
  "user": {
    "id": 1, "email": "...", "fullName": "...", "phone": "...",
    "avatarUrl": null, "status": "ACTIVE", "createdAt": "2026-10-03T..."
  }
}
```

**Errors:** `409 AUTH_409_EMAIL`, `409 AUTH_409_PHONE`, `404 AUTH_404_ROLE`, `400` validation.

### `POST /auth/login`
**Request:** `{ email, password }` (required). **Response:** giá»‘ng register.

**Errors:** `401 AUTH_401_CREDENTIALS`, `403 AUTH_403_USER_DISABLED`.

### `POST /auth/refresh-token`
**Request:** `{ refreshToken }` (required). **Error:** `401 AUTH_401_REFRESH_TOKEN`.

### `POST /auth/logout`
**Request:** `{ refreshToken?: string }` (optional). **HTTP 200.**

---

## User Profile Module `/api/v1/users`

Yêu cầu: **Authentication**. Tag: `User Profile`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/users/me` | Lấy há»“ sơ |
| `PUT` | `/users/me` | Cập nhật há»“ sơ |
| `PUT` | `/users/me/change-password` | Đá»•i mật khẩu |

### `GET /users/me`
**Response data:**
```json
{
  "id": 1, "email": "...", "fullName": "...", "phone": "...",
  "avatarUrl": null, "status": "ACTIVE", "createdAt": "2026-10-01T..."
}
```

### `PUT /users/me`
**Request:** `{ fullName (required), phone?, avatarUrl? }`.

### `PUT /users/me/change-password`
**Request:** `{ oldPassword (required), newPassword (required, min 6) }`.
**Error:** `400 USER_400_OLD_PASSWORD`.

---

## Address Book Module `/api/v1/users/addresses`

Yêu cầu: **Authentication**. Tag: `Address Book`. **Owner** = chá»‰ chủ sở hữu address.

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/users/addresses` | Auth â€“ DS (default xếp trưá»›c) |
| `POST` | `/users/addresses` | Auth â€“ Tạo má»›i |
| `GET` | `/users/addresses/{id}` | Owner |
| `PUT` | `/users/addresses/{id}` | Owner |
| `DELETE` | `/users/addresses/{id}` | Owner |
| `PATCH` | `/users/addresses/{id}/default` | Owner |

**AddressResponse:**
```json
{
  "id": 1, "contactName": "...", "phone": "...",
  "province": "...", "district": "...", "ward": "...",
  "detailAddress": "...", "latitude": 10.7769, "longitude": 106.7009,
  "isDefault": true, "createdAt": "...", "updatedAt": "..."
}
```

**Create request:** `contactName, phone, province, district, ward, detailAddress` (required), `latitude?, longitude?, isDefault?` (default false).

**Errors:**
- `403 USER_403_ADDRESS_DENIED` â€“ không phải chủ address.
- `400 USER_400_DELETE_DEFAULT` â€“ không xóa Ä‘ược default khi còn address khác.

> Khi set 1 address làm default â†’ các address khác tự Ä‘á»™ng `isDefault=false`.
> **Constraint XOR**: address của User phải `store=null` (và ngược lại).

---

## Store Module `/api/v1/stores`

Tag: `Stores`.

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/stores` | Authenticated |
| `GET` | `/stores/me` | Seller |
| `PUT` | `/stores/me` | Seller |
| `GET` | `/stores/{id}` | **Public** |
| `GET` | `/stores/me/addresses` | Seller |
| `POST` | `/stores/me/addresses` | Seller |
| `PUT` | `/stores/me/addresses/{addressId}` | Seller |
| `DELETE` | `/stores/me/addresses/{addressId}` | Seller |
| `PATCH` | `/stores/me/addresses/{addressId}/default` | Seller |

### `POST /stores`
**Request:** `{ storeName (2-150), logoUrl?, description? }`. Store mặc Ä‘á»‹nh status `PENDING`, auto tạo Wallet 1-1.
**Errors:** `409 STORE_409_EXISTS`, `409 STORE_409_NAME_EXISTS`.

**StoreResponse:**
```json
{
  "id": 1, "userId": 5, "storeName": "...", "logoUrl": null, "description": null,
  "defaultCommissionRate": 0.10, "status": "PENDING", "createdAt": "..."
}
```

### `GET /stores/{id}` (Public)
**Error:** `404 STORE_404_NOT_FOUND`.

Store Address dùng chung `CreateAddressRequest` / `AddressResponse` như User.

---

## Admin Store Module `/api/v1/admin/stores`

| Method | Endpoint | Access |
|---|---|---|
| `PATCH` | `/admin/stores/{id}/status` | Admin |

**Request:** `{ status: "APPROVED" | "BANNED" | "SUSPENDED" | "PENDING" }`.

> **Hành vi quan trọng**: Khi `APPROVED` â†’ tự Ä‘á»™ng gán role `SELLER` cho chủ shop.

**Errors:** `404 STORE_404_NOT_FOUND`, `400 STORE_400_INVALID_STATUS`.

---

## Category Module `/api/v1/categories`

**Public API**. Tag: `Categories`.

| Method | Endpoint |
|---|---|
| `GET` | `/categories` |
| `GET` | `/categories/{id}` |
| `GET` | `/categories/slug/{slug}` |

**CategoryResponse:**
```json
{ "id": 1, "name": "...", "slug": "...", "commissionRate": 0.10, "description": "..." }
```

**Error:** `404 CAT_404_NOT_FOUND`.

---

## Admin Category Module `/api/v1/admin/categories`

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/admin/categories` | Tạo |
| `PUT` | `/admin/categories/{id}` | Cập nhật |
| `DELETE` | `/admin/categories/{id}` | Xóa (chặn nếu có con) |

### `POST /admin/categories`
**Request:**
```json
{
  "name": "Thời trang nam",   // required, max 100
  "slug": "thoi-trang-nam",   // required, max 100
  "commissionRate": 0.10,     // required, 0.0000 -> 1.0000
  "description": "..."        // optional, max 255
}
```

**Errors:** `409 CAT_409_NAME_EXISTS`, `409 CAT_409_SLUG_EXISTS`.

---

## Product Public Module `/api/v1/products`

**Public API**. Tag: `Product - Public API`.

| Method | Endpoint |
|---|---|
| `GET` | `/products` |
| `GET` | `/products/{id}` |

### `GET /products`

**Query:** `categoryId, keyword, minPrice, maxPrice, page, size, sort`.

> Chá»‰ trả về product `ACTIVE` thuá»™c store `APPROVED`. Batch fetch variants tránh N+1.

**ProductSummaryResponse:**
```json
{
  "id": 1, "storeId": 2, "storeName": "...", "categoryId": 1, "categoryName": "...",
  "name": "...", "imageUrl": "...",
  "minPrice": 99000, "maxPrice": 199000, "totalStock": 50,
  "status": "ACTIVE", "createdAt": "..."
}
```

### `GET /products/{id}`

**ProductDetailResponse** (gá»“m variants):
```json
{
  "id": 1, "storeId": 2, "storeName": "...", "name": "...", "imageUrl": "...",
  "description": "...",
  "tierVariationConfigs": [
    { "name": "Màu sắc", "options": ["Đen", "Trắng"] },
    { "name": "Size", "options": ["M", "L", "XL"] }
  ],
  "status": "ACTIVE", "createdAt": "...",
  "variants": [
    {
      "id": 10, "productId": 1, "sku": "AT-DEN-M", "variantName": "Đen, Size M",
      "attributes": { "Màu sắc": "Đen", "Size": "M" },
      "originalPrice": 99000, "stockQuantity": 25, "imageUrl": null,
      "status": "ACTIVE", "version": 0, "createdAt": "..."
    }
  ]
}
```

**Error:** `404 PROD_404_NOT_FOUND`.

---

## Seller Product Module `/api/v1/seller/products`

Yêu cầu: **Role SELLER**. Tag: `Seller - Product Management API`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/seller/products` | Tạo SPU + SKU |
| `GET` | `/seller/products` | DS của tôi |
| `GET` | `/seller/products/{id}` | Chi tiết |
| `PUT` | `/seller/products/{id}` | Cập nhật |
| `DELETE` | `/seller/products/{id}` | Soft/Hard delete |
| `PATCH` | `/seller/products/{id}/status` | Đá»•i trạng thái |

### `POST /seller/products`

**CreateProductRequest:**
```json
{
  "categoryId": 1,                    // required
  "name": "Áo thun nam",              // required, max 255
  "imageUrl": "https://...",          // optional, max 255
  "description": "...",               // optional
  "tierVariationConfigs": [           // optional
    { "name": "Màu sắc", "options": ["Đen", "Trắng"] }
  ],
  "variants": [                       // required, min 1
    {
      "sku": "AT-DEN-M",              // required, max 50, unique toàn há»‡ thá»‘ng
      "variantName": "Đen, Size M",   // required, max 150
      "attributes": { "Màu sắc": "Đen" },  // optional
      "originalPrice": 99000,         // required, > 0
      "stockQuantity": 25,            // required, >= 0
      "imageUrl": null                // optional
    }
  ]
}
```

**Validate ngầm:**
- Store phải `APPROVED`.
- Sá»‘ SKU phải khá»›p `tierVariationConfigs`.
- Không trùng SKU trong cùng request.

**Errors:** `403 PROD_403_STORE_NOT_ELIGIBLE`, `400 PROD_400_INVALID_TIER_VARIATION`, `409 PROD_409_SKU_EXISTS`, `400 PROD_400_INVALID_PRICE`, `400 PROD_400_INVALID_STOCK`, `400 PROD_400_DUPLICATE_SKU`.

### `PUT /seller/products/{id}`
**UpdateProductRequest** giá»‘ng Create nhưng variants có thêm `id` (null = SKU má»›i) và `status`.

> **Quy tắc quan trọng**: Không sửa giá hoặc **giảm** tá»“n kho nếu SKU Ä‘ang trong Flash Sale `ACTIVE`. Optimistic Lock (`@Version`).
> **Error:** `409 PROD_409_VARIANT_IN_ACTIVE_FLASH_SALE`.

### `DELETE /seller/products/{id}`
- Soft delete (`status=INACTIVE`) nếu SKU Ä‘ã có trong `order_items` hoặc `flash_sale_items`.
- Hard delete nếu chưa phát sinh Ä‘ơn.

### `PATCH /seller/products/{id}/status?status=...`
Query: `status=ACTIVE|INACTIVE|OUT_OF_STOCK`.

---

## Flash Sale Public Module `/api/v1/flash-sales/slots`

**Public API**. Tag: `Public Flash Sale`.

| Method | Endpoint |
|---|---|
| `GET` | `/flash-sales/slots` |

### `GET /flash-sales/slots`

**PublicFlashSaleSlotResponse (array):**
```json
[
  {
    "id": 1, "title": "Flash Sale 12h Trưa",
    "startTime": "2026-10-04T04:00:00Z", "endTime": "2026-10-04T05:00:00Z",
    "reservationTtlSeconds": 300, "status": "UPCOMING",
    "items": [
      {
        "id": 7, "slotId": 1, "variantId": 42,
        "sku": "AT-DEN-M", "variantName": "Đen, Size M",
        "productName": "Áo thun nam", "imageUrl": "...",
        "originalPrice": 199000, "flashSalePrice": 99000,
        "allocatedStock": 100, "availableStock": 87,
        "userPurchaseLimit": 2, "status": "APPROVED"
      }
    ]
  }
]
```

> **`availableStock` lấy realtime từ Redis** (không phải DB). DB chá»‰ là nguá»“n bền vững.

---

## Flash Sale Reservation Module `/api/v1/flash-sales/reservations`

Yêu cầu: **Authentication**.

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/flash-sales/reservations` | Authenticated |

### `POST /flash-sales/reservations`

**Headers:**
```http
Authorization: Bearer <access_token>
Idempotency-Key: <uuid-v4>          # bắt buá»™c Ä‘Ồ retry an toàn
```

**CreateReservationRequest:**
```json
{
  "flashSaleItemId": 7,    // required, lấy từ /flash-sales/slots
  "addressId": 1,          // required, phải là của user hiá»‡n tại
  "quantity": 1            // required, > 0, mặc Ä‘á»‹nh 1
}
```

**Hành vi ngầm (Lua script):**
1. Trừ stock nguyên tử trên Redis (`flash_sale:stock:{itemId}`).
2. Check purchase limit/user (`flash_sale:user_limit:{slotId}:{userId}:{itemId}`).
3. Tạo Ä‘ơn `PENDING_PAYMENT`.
4. DB fail â†’ **compensation tự Ä‘á»™ng** trả lại sá»‘ lượng về Redis + giảm `available_stock` DB.

**ReservationResponse:**
```json
{
  "orderId": 123, "orderCode": "ORD-20261003-00001",
  "flashSaleItemId": 7, "quantity": 1, "totalAmount": 99000,
  "status": "PENDING_PAYMENT", "expiresAt": "2026-10-03T14:27:35Z",
  "message": "Đặt hàng thành công, vui lòng thanh toán trong 5 phút"
}
```

**Errors:**
- `404 FS_404_ITEM_NOT_FOUND`, `404 USER_404_ADDRESS`
- `403 FS_403_ADDRESS_INVALID`
- `409 FS_409_OUT_OF_STOCK`, `409 FS_409_PURCHASE_LIMIT_EXCEEDED`
- `400 FS_400_SLOT_NOT_ACTIVE`, `400 FS_400_SLOT_ALREADY_ENDED`
- `400 FS_400_IDEMPOTENCY_KEY_MISSING`, `409 FS_409_IDEMPOTENCY_CONFLICT`
- `500 FS_500_ORDER_FAILED`

> Sau reservation thành công â†’ Đơn hàng `PENDING_PAYMENT` trong `expiresAt` (mặc Ä‘á»‹nh 300s). Hết hạn tự hủy + hoàn stock.

---

## Admin Flash Sale Module `/api/v1/admin/flash-sales`

Yêu cầu: **Role ADMIN**. Tag: `Admin Flash Sale`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/admin/flash-sales/slots` | Tạo phiên |
| `PUT` | `/admin/flash-sales/slots/{id}` | Cập nhật (chặn nếu ENDED) |
| `GET` | `/admin/flash-sales/slots/{id}` | Chi tiết |
| `GET` | `/admin/flash-sales/slots` | DS tất cả phiên |
| `PATCH` | `/admin/flash-sales/items/{id}/approve` | Duyá»‡t SKU |
| `POST` | `/admin/flash-sales/slots/{id}/pre-warm` | Pre-warm nạp Redis |

### `POST /admin/flash-sales/slots`
**CreateFlashSaleSlotRequest:**
```json
{
  "title": "Flash Sale 12h Trưa",     // required, not blank
  "startTime": "2026-10-04T04:00:00Z",  // required, < endTime
  "endTime": "2026-10-04T05:00:00Z",    // required, > startTime
  "reservationTtlSeconds": 300          // optional, default 300, > 0
}
```

**Errors:** `400 FS_400_SLOT_TIME_INVALID`, `409 FS_409_SLOT_OVERLAP`.

### `PATCH /admin/flash-sales/items/{id}/approve`
Duyá»‡t SKU â†’ khấu trừ kho gá»‘c `product_variants.stock_quantity` nguyên tử.

### `POST /admin/flash-sales/slots/{id}/pre-warm`
Pre-warm nạp Redis bằng `SETNX` (idempotent, tính cả Ä‘ơn PENDING hiá»‡n có). Gọi trưá»›c khi phiên `ACTIVE`.

---

## Seller Flash Sale Module `/api/v1/seller/flash-sales`

Yêu cầu: **Role SELLER**. Tag: `Seller Flash Sale`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/seller/flash-sales/items` | ĐĒng ký SKU Flash Sale |

### `POST /seller/flash-sales/items`

**RegisterFlashSaleItemRequest:**
```json
{
  "slotId": 1,                  // required
  "variantId": 42,              // required
  "flashSalePrice": 99000,      // required, > 0 và < originalPrice
  "allocatedStock": 100,        // required, > 0 và â‰¤ stockQuantity gá»‘c
  "userPurchaseLimit": 2,       // optional, > 0, default 1
  "commissionRateOverride": null  // optional, 0-1
}
```

**Errors:**
- `403 FS_403_STORE_NOT_APPROVED`, `403 FS_403_NOT_STORE_OWNER`
- `400 FS_400_INVALID_PRICE`, `400 FS_400_INVALID_ALLOCATED_STOCK`, `400 FS_400_INVALID_PURCHASE_LIMIT`
- `409 FS_409_ITEM_ALREADY_REGISTERED`, `409 FS_409_INSUFFICIENT_BASE_STOCK`

**FlashSaleItemResponse:**
```json
{
  "id": 7, "slotId": 1, "variantId": 42,
  "flashSalePrice": 99000, "allocatedStock": 100, "availableStock": 100,
  "userPurchaseLimit": 2, "commissionRateOverride": null,
  "status": "PENDING", "createdAt": "..."
}
```

---

## Cart Module `/api/v1/cart`

Yêu cầu: **Authentication**. Tag: `Cart`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/cart` | Xem giỏ (gom nhóm theo store) |
| `POST` | `/cart/items` | Thêm vào giỏ |
| `PUT` | `/cart/items/{itemId}` | Cập nhật sá»‘ lượng |
| `DELETE` | `/cart/items/{itemId}` | Xóa 1 sản phẩm |
| `DELETE` | `/cart` | Xóa toàn bá»™ |

### `GET /cart`

**CartResponse:**
```json
{
  "id": 1, "userId": 5,
  "storeGroups": [
    {
      "storeId": 2, "storeName": "Shop ABC",
      "items": [
        {
          "id": 11, "variantId": 42, "sku": "AT-DEN-M",
          "productName": "...", "variantName": "...", "imageUrl": null,
          "price": 99000, "stockQuantity": 25, "quantity": 2,
          "itemSubtotal": 198000, "storeId": 2, "storeName": "Shop ABC"
        }
      ],
      "storeSubtotal": 198000
    }
  ],
  "totalItems": 2, "grandTotal": 198000
}
```

### `POST /cart/items`
**Request:** `{ variantId (required), quantity (required, > 0) }`.

**Errors:** `400 CART_400_1` (INSUFFICIENT_STOCK), `400 CART_400_2` (INVALID_QUANTITY).

### `PUT /cart/items/{itemId}`
**Request:** `{ quantity (required, > 0) }`.

### `DELETE /cart/items/{itemId}`
**Errors:** `404 CART_ITEM_404`, `403 CART_403`.

---

## Order Buyer Module `/api/v1/orders`

Yêu cầu: **Authentication**. Tag: `Orders Buyer`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/orders/checkout` | Đặt hàng (tách Ä‘a gian hàng) |
| `GET` | `/orders` | DS Ä‘ơn của tôi |
| `GET` | `/orders/{id}` | Chi tiết |
| `PATCH` | `/orders/{id}/cancel` | Hủy (chưa thanh toán) |

### `POST /orders/checkout`

**CreateOrderRequest:**
```json
{
  "shippingAddressId": 1,        // required
  "storeOrders": [               // required, min 1
    {
      "storeId": 2,              // required
      "items": [                 // required
        { "variantId": 42, "quantity": 2 }   // variantId required, quantity > 0
      ],
      "voucherCode": "SALE10"    // optional, voucher store
    }
  ]
}
```

> Cart nhiều store â†’ tách thành nhiều Order Ä‘á»™c lập theo store. **Không có Parent Order**.

**Response 201** â€“ Array `OrderResponse` (má»—i store 1 Order):
```json
[{
  "id": 100, "orderCode": "ORD-20261003-00001",
  "buyerId": 5, "storeId": 2, "storeName": "Shop ABC",
  "slotId": null, "voucherId": 3,
  "recipientName": "...", "recipientPhone": "...",
  "shippingAddressText": "Nguyá»…n VĒn A - 0987654321 - 12 Nguyá»…n Huá»‡, ...",
  "subtotalAmount": 198000, "voucherDiscountAmount": 10000, "totalAmount": 188000,
  "commissionRate": 0.10, "platformFee": 18800, "sellerAmount": 169200,
  "status": "PENDING_PAYMENT", "expiresAt": null,
  "createdAt": "...", "updatedAt": "...",
  "items": [{
    "id": 200, "variantId": 42, "flashSaleItemId": null,
    "productName": "...", "variantName": "...",
    "priceAtPurchase": 99000, "quantity": 2, "itemSubtotal": 198000
  }]
}]
```

**Errors:** `403 USER_403_ADDRESS_DENIED`, `400 ORDER_400_2` (INSUFFICIENT_VARIANT_STOCK), `400 ORDER_400_4` (STORE_NOT_APPROVED).

### `GET /orders`
**Query:** `?page=0&size=10` (mặc Ä‘á»‹nh sort `createdAt DESC`).

### `PATCH /orders/{id}/cancel`
Hủy Ä‘ơn khi chưa thanh toán.
**Errors:** `404 ORDER_404`, `403 ORDER_403`, `400 ORDER_400_3` (INVALID_STATUS_TRANSITION).

---

## Seller Order Module `/api/v1/seller/orders`

Yêu cầu: **Role SELLER**.

| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/seller/orders` | DS Ä‘ơn của shop |
| `PATCH` | `/seller/orders/{id}/status` | Cập nhật trạng thái |

### `PATCH /seller/orders/{id}/status`
**Request:** `{ status: "..." }`. Hợp lá»‡: `PENDING_PAYMENT`, `CONFIRMED`, `SHIPPED`, `COMPLETED`, `CANCELLED`, `CANCELLED_TIMEOUT`.

---

## Voucher Module `/api/v1/vouchers`

Tag: `Vouchers Public`. Apply cần auth.

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/vouchers/platform` | Public |
| `GET` | `/vouchers/store/{storeId}` | Public |
| `POST` | `/vouchers/apply` | Authenticated |

### `GET /vouchers/platform`

**VoucherResponse:**
```json
{
  "id": 1, "code": "SALE10", "storeId": null,
  "discountType": "PERCENT", "discountValue": 0.10,
  "minOrderAmount": 100000, "maxDiscountAmount": 50000,
  "totalQuantity": 1000, "usedQuantity": 12, "userUsageLimit": 1,
  "startTime": "...", "endTime": "...",
  "status": "ACTIVE", "createdAt": "..."
}
```

### `POST /vouchers/apply`
**ApplyVoucherRequest:**
```json
{ "code": "SALE10", "storeId": null, "subtotalAmount": 188000 }
```

**VoucherCalculationResponse:**
```json
{ "voucherId": 1, "code": "SALE10", "discountAmount": 18800, "finalAmount": 179200 }
```

**Errors:** `404 VOUCHER_404`, `400 VOUCHER_400_1..6`, `403 VOUCHER_403` (STORE_MISMATCH).

---

## Seller Voucher Module `/api/v1/seller/vouchers`

Yêu cầu: **Role SELLER**. Tag: `Seller Vouchers`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/seller/vouchers` | Tạo voucher shop |
| `GET` | `/seller/vouchers` | DS của tôi |

### `POST /seller/vouchers`

**CreateVoucherRequest:**
```json
{
  "code": "SALE10",                  // required, max 30, unique
  "storeId": 2,                      // optional, null = platform (Admin only)
  "discountType": "FIXED_AMOUNT",    // required: FIXED_AMOUNT | PERCENT
  "discountValue": 10000,            // required, > 0 (PERCENT â‰¤ 100)
  "minOrderAmount": 100000,          // optional, >= 0
  "maxDiscountAmount": 50000,        // optional, > 0
  "totalQuantity": 1000,             // required, > 0
  "userUsageLimit": 1,               // optional, > 0
  "startTime": "...",                // required
  "endTime": "..."                   // required, > startTime, future
}
```

**Errors:** `409 VOUCHER_409`, `400 VOUCHER_400_7` (INVALID_DATES), `400 VOUCHER_400_8` (INVALID_DISCOUNT_PERCENT).

---

## Admin Voucher Module `/api/v1/admin/vouchers`

Yêu cầu: **Role ADMIN**. Tag: `Admin Vouchers`.

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/admin/vouchers` | Tạo platform voucher (ép storeId=null) |

Giá»‘ng `CreateVoucherRequest` nhưng server **ép `storeId=null`**.

---

## WebSocket Realtime

### Kết ná»‘i

**Endpoint:** `ws://host/ws` (SockJS fallback: `http://host/ws/...`).

**Browser â†’ Server**: token trong **STOMP CONNECT headers** (không phải query â€“ do header `Authorization` không set Ä‘ược khi upgrade WS):

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
stompClient.connect(
  { token: accessToken },  // STOMP CONNECT headers
  () => { /* connected */ },
  (err) => { /* error */ }
);
```

Server Ä‘ọc `token` từ query `?token=` để handshake, validate và set Principal.

### Destinations (build qua `WsDestinations` Java class â€“ **không hard-code URL rải rác**)

#### Public topics (broadcast)

| Subscribe URL | Mô tả |
|---|---|
| `/topic/flash-sale/item/{itemId}/stock` | Stock realtime 1 SKU |
| `/topic/flash-sale/slot/{slotId}/stock-update` | Stock thay Ä‘á»•i trong slot |
| `/topic/flash-sale/slot/{slotId}/status` | Slot chuyỒn trạng thái |

#### Private queues (per-user, Spring prefix `/user/{username}`)

| Subscribe URL | Mô tả |
|---|---|
| `/user/queue/flash-sale/reservation-result` | Kết quả reservation riêng user |
| `/user/queue/flash-sale/orders/{orderCode}/updates` | Update riêng cho 1 Ä‘ơn |

### Event Payload

Mọi event Ä‘ược wrap trong `ApiResponse<T>` chung của project. Body là `FlashSaleWsEvent`:

```typescript
interface FlashSaleWsEvent {
  eventType:
    | 'STOCK_DECREMENTED'
    | 'STOCK_RESTORED'
    | 'STOCK_RETURNED_UNSOLD'
    | 'SLOT_ACTIVATED'
    | 'SLOT_CLOSED'
    | 'ORDER_RESERVED'
    | 'ORDER_CANCELLED_TIMEOUT';

  // Context
  slotId?: number;
  flashSaleItemId?: number;
  orderId?: number;
  userId?: number;

  // Payload (tuỳ event)
  availableStock?: number;
  allocatedStock?: number;
  totalAmount?: number;
  quantity?: number;
  orderCode?: string;
  expiresAt?: string;          // ISO-8601
  slotStatus?: string;          // 'UPCOMING' | 'ACTIVE' | 'ENDED'
  restoredQuantity?: number;

  occurredAt: string;          // ISO-8601
}
```

### Ví dụ Subscribe

```javascript
// Public: stock realtime cho 1 SKU
stompClient.subscribe(
  '/topic/flash-sale/item/7/stock',
  (message) => {
    const event = JSON.parse(message.body);
    console.log('Stock giảm còn:', event.data.availableStock);
  }
);

// Private: kết quả reservation
stompClient.subscribe(
  '/user/queue/flash-sale/reservation-result',
  (message) => {
    const event = JSON.parse(message.body);
    if (event.data.eventType === 'ORDER_RESERVED') {
      router.push(`/orders/${event.data.orderCode}`);
    }
  }
);

// Private: update cho 1 Ä‘ơn cụ thỒ
stompClient.subscribe(
  `/user/queue/flash-sale/orders/${orderCode}/updates`,
  (message) => {
    const event = JSON.parse(message.body);
    if (event.data.eventType === 'ORDER_CANCELLED_TIMEOUT') {
      toast.error('Đơn Ä‘ã hết hạn giữ chá»—');
    }
  }
);
```

### Quy Tắc Quan Trọng

1. **WS chá»‰ là thông báo** â€“ không dựa vào WS quyết Ä‘á»‹nh logic, reload qua REST khi cần.
2. **Stock count lấy từ REST** (`GET /api/v1/flash-sales/slots`) là source-of-truth.
3. **WS miss** â†’ REST vẫn Ä‘úng stock â€“ không cần Ä‘á»“ng bá»™ lại.
4. **Không cần queue offline** â€“ `SimpMessagingTemplate` không queue khi user offline.
5. **Heartbeat 10s cả 2 chiều**, dedicated scheduler pool.

---

## Bảng Mã Lá»—i Tá»•ng Hợp

### Common Error Codes
| HTTP | Code | Message |
|---|---|---|
| 400 | `SYS_400` | Dữ liá»‡u yêu cầu không hợp lá»‡ |
| 401 | `AUTH_401` | Chưa xác thực hoặc token không hợp lá»‡ |
| 403 | `AUTH_403` | Không có quyền truy cập tài nguyên |
| 404 | `SYS_404` | Không tìm thấy tài nguyên yêu cầu |
| 405 | `SYS_405` | Phương thức HTTP không Ä‘ược há»— trợ |
| 409 | `SYS_409` | Xảy ra xung Ä‘á»™t tài nguyên |
| 422 | `SYS_422` | Dữ liá»‡u không vượt qua ràng buá»™c xác thực |
| 500 | `SYS_500` | Lá»—i máy chủ ná»™i bá»™ không xác Ä‘á»‹nh |

> GlobalExceptionHandler trả `400 BAD_REQUEST` (không phải 422) cho cả `MethodArgumentNotValidException` và `ConstraintViolationException`.

### Auth Errors
| HTTP | Code | Message |
|---|---|---|
| 401 | `AUTH_401_CREDENTIALS` | Email hoặc mật khẩu không chính xác |
| 401 | `AUTH_401_REFRESH_TOKEN` | Refresh token không hợp lá»‡ hoặc Ä‘ã hết hạn |
| 403 | `AUTH_403_USER_DISABLED` | Tài khoản của bạn Ä‘ã bá»‹ khóa hoặc tạm ngưng |
| 404 | `AUTH_404_ROLE` | Vai trò yêu cầu không tá»“n tại trên há»‡ thá»‘ng |
| 409 | `AUTH_409_EMAIL` | Email này Ä‘ã Ä‘ược Ä‘Ēng ký trên há»‡ thá»‘ng |
| 409 | `AUTH_409_PHONE` | Sá»‘ Ä‘iá»‡n thoại này Ä‘ã Ä‘ược sử dụng |

### User Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `USER_400_OLD_PASSWORD` | Mật khẩu hiá»‡n tại không chính xác |
| 400 | `USER_400_DELETE_DEFAULT` | Không thỒ xóa Ä‘á»‹a chá»‰ mặc Ä‘á»‹nh khi còn Ä‘á»‹a chá»‰ khác |
| 403 | `USER_403_ADDRESS_DENIED` | Bạn không có quyền truy cập/chá»‰nh sửa Ä‘á»‹a chá»‰ này |
| 404 | `USER_404_NOT_FOUND` | Không tìm thấy thông tin người dùng |
| 404 | `USER_404_ADDRESS` | Không tìm thấy Ä‘á»‹a chá»‰ yêu cầu |

### Store Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `STORE_400_INVALID_STATUS` | Trạng thái phê duyá»‡t gian hàng không hợp lá»‡ |
| 400 | `STORE_400_NOT_APPROVED` | Gian hàng chưa Ä‘ược phê duyá»‡t hoặc Ä‘ang bá»‹ tạm khóa |
| 403 | `STORE_403_ACCESS_DENIED` | Bạn không có quyền quản lý gian hàng này |
| 403 | `STORE_403_ADDRESS_ACCESS_DENIED` | Đá»‹a chá»‰ kho không thuá»™c quyền sở hữu của gian hàng này |
| 404 | `STORE_404_NOT_FOUND` | Không tìm thấy thông tin gian hàng |
| 404 | `STORE_404_ADDRESS_NOT_FOUND` | Không tìm thấy Ä‘á»‹a chá»‰ kho của gian hàng |
| 409 | `STORE_409_EXISTS` | Bạn Ä‘ã có gian hàng trên há»‡ thá»‘ng, không thỒ Ä‘Ēng ký thêm |
| 409 | `STORE_409_NAME_EXISTS` | Tên gian hàng này Ä‘ã Ä‘ược sử dụng |

### Product / Category Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `PROD_400_VARIANTS_REQUIRED` | Sản phẩm phải có ít nhất má»™t biến thỒ phân loại (SKU) |
| 400 | `PROD_400_INVALID_TIER_VARIATION` | Sá»‘ lượng biến thỒ không khá»›p vá»›i cấu hình phân loại tier_variation_configs |
| 400 | `PROD_400_INVALID_PRICE` | Giá bán của biến thỒ phải lá»›n hơn 0 |
| 400 | `PROD_400_INVALID_STOCK` | Sá»‘ lượng tá»“n kho không Ä‘ược nhỏ hơn 0 |
| 400 | `PROD_400_DUPLICATE_SKU` | Mã SKU không Ä‘ược trùng lặp trong cùng sản phẩm |
| 403 | `PROD_403_ACCESS_DENIED` | Bạn không có quyền quản lý sản phẩm này |
| 403 | `PROD_403_STORE_NOT_ELIGIBLE` | Gian hàng chưa Ä‘ược phê duyá»‡t hoặc không Ä‘ủ Ä‘iều kiá»‡n Ä‘Ēng bán |
| 404 | `PROD_404_NOT_FOUND` | Không tìm thấy sản phẩm |
| 404 | `PROD_404_VARIANT_NOT_FOUND` | Không tìm thấy biến thỒ phân loại sản phẩm |
| 409 | `PROD_409_SKU_EXISTS` | Mã SKU này Ä‘ã tá»“n tại trong há»‡ thá»‘ng |
| 409 | `PROD_409_VARIANT_IN_ACTIVE_FLASH_SALE` | Không thỒ chá»‰nh sửa giá hoặc tá»“n kho của biến thỒ Ä‘ang tham gia Flash Sale Ä‘ang hoạt Ä‘á»™ng |
| 404 | `CAT_404_NOT_FOUND` | Không tìm thấy ngành hàng yêu cầu |
| 409 | `CAT_409_NAME_EXISTS` | Tên ngành hàng Ä‘ã tá»“n tại |
| 409 | `CAT_409_SLUG_EXISTS` | Đường dẫn slug của ngành hàng Ä‘ã tá»“n tại |

### Flash Sale Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `FS_400_SLOT_TIME_INVALID` | Thời gian bắt Ä‘ầu phải trưá»›c thời gian kết thúc |
| 400 | `FS_400_SLOT_NOT_ACTIVE` | Khung giờ Flash Sale hiá»‡n không hoạt Ä‘á»™ng |
| 400 | `FS_400_SLOT_ALREADY_ENDED` | Khung giờ Flash Sale Ä‘ã kết thúc |
| 400 | `FS_400_ITEM_NOT_PENDING` | Mục Flash Sale không ở trạng thái chờ duyá»‡t |
| 400 | `FS_400_INVALID_PRICE` | Giá Flash Sale phải lá»›n hơn 0 và nhỏ hơn giá gá»‘c của biến thỒ |
| 400 | `FS_400_INVALID_ALLOCATED_STOCK` | Sá»‘ lượng tá»“n kho phân bá»• cho Flash Sale không hợp lá»‡ hoặc vượt quá tá»“n kho gá»‘c |
| 400 | `FS_400_INVALID_PURCHASE_LIMIT` | Giá»›i hạn mua của người dùng phải lá»›n hơn 0 |
| 400 | `FS_400_IDEMPOTENCY_KEY_MISSING` | Yêu cầu thiếu Idempotency-Key |
| 403 | `FS_403_STORE_NOT_APPROVED` | Gian hàng chưa Ä‘ược duyá»‡t, không thỒ tham gia Flash Sale |
| 403 | `FS_403_NOT_STORE_OWNER` | Bạn không có quyền quản lý sản phẩm hoặc gian hàng này |
| 403 | `FS_403_ADDRESS_INVALID` | Đá»‹a chá»‰ giao hàng không hợp lá»‡ hoặc không thuá»™c về người dùng |
| 404 | `FS_404_SLOT_NOT_FOUND` | Không tìm thấy khung giờ Flash Sale |
| 404 | `FS_404_ITEM_NOT_FOUND` | Không tìm thấy sản phẩm trong Flash Sale |
| 409 | `FS_409_SLOT_OVERLAP` | Khung giờ Flash Sale bá»‹ trùng lặp vá»›i khung giờ Ä‘ã tá»“n tại |
| 409 | `FS_409_ITEM_ALREADY_REGISTERED` | Biến thỒ sản phẩm này Ä‘ã Ä‘ược Ä‘Ēng ký trong khung giờ |
| 409 | `FS_409_INSUFFICIENT_BASE_STOCK` | Tá»“n kho gá»‘c của sản phẩm không Ä‘ủ Ä‘Ồ phân bá»• cho Flash Sale |
| 409 | `FS_409_OUT_OF_STOCK` | Sản phẩm Flash Sale Ä‘ã hết hàng tá»“n kho |
| 409 | `FS_409_PURCHASE_LIMIT_EXCEEDED` | Bạn Ä‘ã vượt quá giá»›i hạn sá»‘ lượng mua cho sản phẩm này trong phiên Flash Sale |
| 409 | `FS_409_IDEMPOTENCY_CONFLICT` | Yêu cầu vá»›i Idempotency-Key này Ä‘ang Ä‘ược xử lý, vui lòng không gửi lặp lại |
| 500 | `FS_500_ORDER_FAILED` | Há»‡ thá»‘ng bận khi khởi tạo Ä‘ơn hàng Flash Sale |

### Cart Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `CART_400_1` (`INSUFFICIENT_STOCK`) | Sá»‘ lượng tá»“n kho sản phẩm không Ä‘ủ |
| 400 | `CART_400_2` (`INVALID_QUANTITY`) | Sá»‘ lượng sản phẩm thêm vào giỏ phải lá»›n hơn 0 |
| 403 | `CART_403` (`CART_ITEM_ACCESS_DENIED`) | Bạn không có quyền thao tác trên mục giỏ hàng này |
| 404 | `CART_404` (`CART_NOT_FOUND`) | Không tìm thấy giỏ hàng của người dùng |
| 404 | `CART_ITEM_404` (`CART_ITEM_NOT_FOUND`) | Không tìm thấy sản phẩm trong giỏ hàng |

### Order Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `ORDER_400_1` (`EMPTY_ORDER_ITEMS`) | Đơn hàng phải chứa ít nhất má»™t sản phẩm |
| 400 | `ORDER_400_2` (`INSUFFICIENT_VARIANT_STOCK`) | Sá»‘ lượng tá»“n kho sản phẩm không Ä‘ủ Ä‘Ồ Ä‘ặt hàng |
| 400 | `ORDER_400_3` (`INVALID_STATUS_TRANSITION`) | Trạng thái chuyỒn Ä‘á»•i của Ä‘ơn hàng không hợp lá»‡ |
| 400 | `ORDER_400_4` (`STORE_NOT_APPROVED`) | Gian hàng chưa Ä‘ược duyá»‡t hoặc Ä‘ang bá»‹ khóa, không thỒ Ä‘ặt hàng |
| 403 | `ORDER_403` (`ORDER_ACCESS_DENIED`) | Bạn không có quyền truy cập hoặc thao tác trên Ä‘ơn hàng này |
| 404 | `ORDER_404` (`ORDER_NOT_FOUND`) | Không tìm thấy Ä‘ơn hàng |

### Voucher Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `VOUCHER_400_1` (`EXPIRED`) | Mã giảm giá Ä‘ã hết hạn sử dụng |
| 400 | `VOUCHER_400_2` (`NOT_STARTED`) | Mã giảm giá chưa Ä‘ến thời gian hiá»‡u lực |
| 400 | `VOUCHER_400_3` (`OUT_OF_STOCK`) | Mã giảm giá Ä‘ã hết lượt sử dụng |
| 400 | `VOUCHER_400_4` (`USER_LIMIT_EXCEEDED`) | Bạn Ä‘ã dùng hết lượt cho phép |
| 400 | `VOUCHER_400_5` (`MIN_AMOUNT_NOT_MET`) | Giá trá»‹ Ä‘ơn hàng chưa Ä‘ạt mức tá»‘i thiỒu áp dụng mã |
| 400 | `VOUCHER_400_6` (`INACTIVE`) | Mã giảm giá Ä‘ang bá»‹ tạm khóa |
| 400 | `VOUCHER_400_7` (`INVALID_DATES`) | Thời gian kết thúc phải sau thời gian bắt Ä‘ầu |
| 400 | `VOUCHER_400_8` (`INVALID_DISCOUNT_PERCENT`) | Tỷ lá»‡ giảm giá theo % không Ä‘ược vượt quá 100% |
| 403 | `VOUCHER_403` (`STORE_MISMATCH`) | Mã giảm giá của gian hàng không áp dụng cho Ä‘ơn hàng gian hàng khác |
| 404 | `VOUCHER_404` (`VOUCHER_NOT_FOUND`) | Không tìm thấy mã giảm giá |
| 409 | `VOUCHER_409` (`VOUCHER_CODE_EXISTS`) | Mã giảm giá Ä‘ã tá»“n tại trên há»‡ thá»‘ng |

---

## Phân Quyền Truy Cập

### Public Endpoints
- `POST /auth/{register,login,refresh-token,logout}`
- `GET /categories`, `/categories/{id}`, `/categories/slug/{slug}`
- `GET /products`, `/products/{id}`
- `GET /stores/{id}`
- `GET /flash-sales/slots`
- `GET /vouchers/platform`, `/vouchers/store/{storeId}`
- `WS /ws/**` (auth xử lý để interceptor)
- `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**`

### Authenticated (cần JWT)
- `/users/**`, `/users/addresses/**`
- `POST /cart/**`, `GET /cart`
- `/orders/**`
- `POST /flash-sales/reservations`
- `POST /vouchers/apply` (optional auth)

### Role `SELLER`
- `/seller/**`
- `/stores/**` (POST/GET/PATCH/DELETE my store + my addresses)

### Role `ADMIN`
- `/admin/**`

### Security Filter Chain
- CORS: enable (`CorsConfig` riêng)
- CSRF: disable (stateless API)
- Session: STATELESS
- BCrypt password encoder
- JWT filter chạy trưá»›c `UsernamePasswordAuthenticationFilter`
- 401/403 â†’ trả JSON `ApiResponse` format chuẩn
