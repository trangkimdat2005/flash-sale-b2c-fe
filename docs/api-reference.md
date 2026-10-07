# API Reference â€“ Chi Tiáº¿t Tá»«ng Module

File nÃ y chá»©a chi tiáº¿t request/response/error cá»§a **tá»«ng** module. Äá»c khi cáº§n tÃ­ch há»£p endpoint cá»¥ thá»ƒ.

> TÃ i liá»‡u gá»‘c: `docs/api-document.md` (project) vÃ  Swagger UI: `http://180.93.137.28/swagger-ui/index.html#/`

---

## Má»¥c Lá»¥c

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
21. [Báº£ng MÃ£ Lá»—i Tá»•ng Há»£p](#báº£ng-mÃ£-lá»—i-tá»•ng-há»£p)

---

## Auth Module `/api/v1/auth`

Tag Swagger: `Authentication`. **4 endpoints public.**

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/auth/register` | ÄÄƒng kÃ½ (máº·c Ä‘á»‹nh role BUYER) |
| `POST` | `/auth/login` | ÄÄƒng nháº­p |
| `POST` | `/auth/refresh-token` | Láº¥y accessToken má»›i |
| `POST` | `/auth/logout` | Logout client-side |

### `POST /auth/register`

**Request:**
```json
{
  "email": "buyer@example.com",      // required, @Email
  "password": "secret123",            // required, min 6
  "fullName": "Nguyá»…n VÄƒn A",         // required, max 100
  "phone": "0987654321",              // optional, max 15
  "role": "BUYER"                     // optional, default BUYER, cÃ³ thá»ƒ "SELLER"
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

YÃªu cáº§u: **Authentication**. Tag: `User Profile`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `GET` | `/users/me` | Láº¥y há»“ sÆ¡ |
| `PUT` | `/users/me` | Cáº­p nháº­t há»“ sÆ¡ |
| `PUT` | `/users/me/change-password` | Äá»•i máº­t kháº©u |

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

YÃªu cáº§u: **Authentication**. Tag: `Address Book`. **Owner** = chá»‰ chá»§ sá»Ÿ há»¯u address.

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/users/addresses` | Auth â€“ DS (default xáº¿p trÆ°á»›c) |
| `POST` | `/users/addresses` | Auth â€“ Táº¡o má»›i |
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
- `403 USER_403_ADDRESS_DENIED` â€“ khÃ´ng pháº£i chá»§ address.
- `400 USER_400_DELETE_DEFAULT` â€“ khÃ´ng xÃ³a Ä‘Æ°á»£c default khi cÃ²n address khÃ¡c.

> Khi set 1 address lÃ m default â†’ cÃ¡c address khÃ¡c tá»± Ä‘á»™ng `isDefault=false`.
> **Constraint XOR**: address cá»§a User pháº£i `store=null` (vÃ  ngÆ°á»£c láº¡i).

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
**Request:** `{ storeName (2-150), logoUrl?, description? }`. Store máº·c Ä‘á»‹nh status `PENDING`, auto táº¡o Wallet 1-1.
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

Store Address dÃ¹ng chung `CreateAddressRequest` / `AddressResponse` nhÆ° User.

---

## Admin Store Module `/api/v1/admin/stores`

| Method | Endpoint | Access |
|---|---|---|
| `PATCH` | `/admin/stores/{id}/status` | Admin |

**Request:** `{ status: "APPROVED" | "BANNED" | "SUSPENDED" | "PENDING" }`.

> **HÃ nh vi quan trá»ng**: Khi `APPROVED` â†’ tá»± Ä‘á»™ng gÃ¡n role `SELLER` cho chá»§ shop.

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

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/admin/categories` | Táº¡o |
| `PUT` | `/admin/categories/{id}` | Cáº­p nháº­t |
| `DELETE` | `/admin/categories/{id}` | XÃ³a (cháº·n náº¿u cÃ³ con) |

### `POST /admin/categories`
**Request:**
```json
{
  "name": "Thá»i trang nam",   // required, max 100
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

> Chá»‰ tráº£ vá» product `ACTIVE` thuá»™c store `APPROVED`. Batch fetch variants trÃ¡nh N+1.

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
    { "name": "MÃ u sáº¯c", "options": ["Äen", "Tráº¯ng"] },
    { "name": "Size", "options": ["M", "L", "XL"] }
  ],
  "status": "ACTIVE", "createdAt": "...",
  "variants": [
    {
      "id": 10, "productId": 1, "sku": "AT-DEN-M", "variantName": "Äen, Size M",
      "attributes": { "MÃ u sáº¯c": "Äen", "Size": "M" },
      "originalPrice": 99000, "stockQuantity": 25, "imageUrl": null,
      "status": "ACTIVE", "version": 0, "createdAt": "..."
    }
  ]
}
```

**Error:** `404 PROD_404_NOT_FOUND`.

---

## Seller Product Module `/api/v1/seller/products`

YÃªu cáº§u: **Role SELLER**. Tag: `Seller - Product Management API`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/seller/products` | Táº¡o SPU + SKU |
| `GET` | `/seller/products` | DS cá»§a tÃ´i |
| `GET` | `/seller/products/{id}` | Chi tiáº¿t |
| `PUT` | `/seller/products/{id}` | Cáº­p nháº­t |
| `DELETE` | `/seller/products/{id}` | Soft/Hard delete |
| `PATCH` | `/seller/products/{id}/status` | Äá»•i tráº¡ng thÃ¡i |

### `POST /seller/products`

**CreateProductRequest:**
```json
{
  "categoryId": 1,                    // required
  "name": "Ão thun nam",              // required, max 255
  "imageUrl": "https://...",          // optional, max 255
  "description": "...",               // optional
  "tierVariationConfigs": [           // optional
    { "name": "MÃ u sáº¯c", "options": ["Äen", "Tráº¯ng"] }
  ],
  "variants": [                       // required, min 1
    {
      "sku": "AT-DEN-M",              // required, max 50, unique toÃ n há»‡ thá»‘ng
      "variantName": "Äen, Size M",   // required, max 150
      "attributes": { "MÃ u sáº¯c": "Äen" },  // optional
      "originalPrice": 99000,         // required, > 0
      "stockQuantity": 25,            // required, >= 0
      "imageUrl": null                // optional
    }
  ]
}
```

**Validate ngáº§m:**
- Store pháº£i `APPROVED`.
- Sá»‘ SKU pháº£i khá»›p `tierVariationConfigs`.
- KhÃ´ng trÃ¹ng SKU trong cÃ¹ng request.

**Errors:** `403 PROD_403_STORE_NOT_ELIGIBLE`, `400 PROD_400_INVALID_TIER_VARIATION`, `409 PROD_409_SKU_EXISTS`, `400 PROD_400_INVALID_PRICE`, `400 PROD_400_INVALID_STOCK`, `400 PROD_400_DUPLICATE_SKU`.

### `PUT /seller/products/{id}`
**UpdateProductRequest** giá»‘ng Create nhÆ°ng variants cÃ³ thÃªm `id` (null = SKU má»›i) vÃ  `status`.

> **Quy táº¯c quan trá»ng**: KhÃ´ng sá»­a giÃ¡ hoáº·c **giáº£m** tá»“n kho náº¿u SKU Ä‘ang trong Flash Sale `ACTIVE`. Optimistic Lock (`@Version`).
> **Error:** `409 PROD_409_VARIANT_IN_ACTIVE_FLASH_SALE`.

### `DELETE /seller/products/{id}`
- Soft delete (`status=INACTIVE`) náº¿u SKU Ä‘Ã£ cÃ³ trong `order_items` hoáº·c `flash_sale_items`.
- Hard delete náº¿u chÆ°a phÃ¡t sinh Ä‘Æ¡n.

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
    "id": 1, "title": "Flash Sale 12h TrÆ°a",
    "startTime": "2026-10-04T04:00:00Z", "endTime": "2026-10-04T05:00:00Z",
    "reservationTtlSeconds": 300, "status": "UPCOMING",
    "items": [
      {
        "id": 7, "slotId": 1, "variantId": 42,
        "sku": "AT-DEN-M", "variantName": "Äen, Size M",
        "productName": "Ão thun nam", "imageUrl": "...",
        "originalPrice": 199000, "flashSalePrice": 99000,
        "allocatedStock": 100, "availableStock": 87,
        "userPurchaseLimit": 2, "status": "APPROVED"
      }
    ]
  }
]
```

> **`availableStock` láº¥y realtime tá»« Redis** (khÃ´ng pháº£i DB). DB chá»‰ lÃ  nguá»“n bá»n vá»¯ng.

---

## Flash Sale Reservation Module `/api/v1/flash-sales/reservations`

YÃªu cáº§u: **Authentication**.

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/flash-sales/reservations` | Authenticated |

### `POST /flash-sales/reservations`

**Headers:**
```http
Authorization: Bearer <access_token>
Idempotency-Key: <uuid-v4>          # báº¯t buá»™c Ä‘á»ƒ retry an toÃ n
```

**CreateReservationRequest:**
```json
{
  "flashSaleItemId": 7,    // required, láº¥y tá»« /flash-sales/slots
  "addressId": 1,          // required, pháº£i lÃ  cá»§a user hiá»‡n táº¡i
  "quantity": 1            // required, > 0, máº·c Ä‘á»‹nh 1
}
```

**HÃ nh vi ngáº§m (Lua script):**
1. Trá»« stock nguyÃªn tá»­ trÃªn Redis (`flash_sale:stock:{itemId}`).
2. Check purchase limit/user (`flash_sale:user_limit:{slotId}:{userId}:{itemId}`).
3. Táº¡o Ä‘Æ¡n `PENDING_PAYMENT`.
4. DB fail â†’ **compensation tá»± Ä‘á»™ng** tráº£ láº¡i sá»‘ lÆ°á»£ng vá» Redis + giáº£m `available_stock` DB.

**ReservationResponse:**
```json
{
  "orderId": 123, "orderCode": "ORD-20261003-00001",
  "flashSaleItemId": 7, "quantity": 1, "totalAmount": 99000,
  "status": "PENDING_PAYMENT", "expiresAt": "2026-10-03T14:27:35Z",
  "message": "Äáº·t hÃ ng thÃ nh cÃ´ng, vui lÃ²ng thanh toÃ¡n trong 5 phÃºt"
}
```

**Errors:**
- `404 FS_404_ITEM_NOT_FOUND`, `404 USER_404_ADDRESS`
- `403 FS_403_ADDRESS_INVALID`
- `409 FS_409_OUT_OF_STOCK`, `409 FS_409_PURCHASE_LIMIT_EXCEEDED`
- `400 FS_400_SLOT_NOT_ACTIVE`, `400 FS_400_SLOT_ALREADY_ENDED`
- `400 FS_400_IDEMPOTENCY_KEY_MISSING`, `409 FS_409_IDEMPOTENCY_CONFLICT`
- `500 FS_500_ORDER_FAILED`

> Sau reservation thÃ nh cÃ´ng â†’ Ä‘Æ¡n á»Ÿ `PENDING_PAYMENT` trong `expiresAt` (máº·c Ä‘á»‹nh 300s). Háº¿t háº¡n tá»± há»§y + hoÃ n stock.

---

## Admin Flash Sale Module `/api/v1/admin/flash-sales`

YÃªu cáº§u: **Role ADMIN**. Tag: `Admin Flash Sale`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/admin/flash-sales/slots` | Táº¡o phiÃªn |
| `PUT` | `/admin/flash-sales/slots/{id}` | Cáº­p nháº­t (cháº·n náº¿u ENDED) |
| `GET` | `/admin/flash-sales/slots/{id}` | Chi tiáº¿t |
| `GET` | `/admin/flash-sales/slots` | DS táº¥t cáº£ phiÃªn |
| `PATCH` | `/admin/flash-sales/items/{id}/approve` | Duyá»‡t SKU |
| `POST` | `/admin/flash-sales/slots/{id}/pre-warm` | Pre-warm náº¡p Redis |

### `POST /admin/flash-sales/slots`
**CreateFlashSaleSlotRequest:**
```json
{
  "title": "Flash Sale 12h TrÆ°a",     // required, not blank
  "startTime": "2026-10-04T04:00:00Z",  // required, < endTime
  "endTime": "2026-10-04T05:00:00Z",    // required, > startTime
  "reservationTtlSeconds": 300          // optional, default 300, > 0
}
```

**Errors:** `400 FS_400_SLOT_TIME_INVALID`, `409 FS_409_SLOT_OVERLAP`.

### `PATCH /admin/flash-sales/items/{id}/approve`
Duyá»‡t SKU â†’ kháº¥u trá»« kho gá»‘c `product_variants.stock_quantity` nguyÃªn tá»­.

### `POST /admin/flash-sales/slots/{id}/pre-warm`
Pre-warm náº¡p Redis báº±ng `SETNX` (idempotent, tÃ­nh cáº£ Ä‘Æ¡n PENDING hiá»‡n cÃ³). Gá»i trÆ°á»›c khi phiÃªn `ACTIVE`.

---

## Seller Flash Sale Module `/api/v1/seller/flash-sales`

YÃªu cáº§u: **Role SELLER**. Tag: `Seller Flash Sale`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/seller/flash-sales/items` | ÄÄƒng kÃ½ SKU Flash Sale |

### `POST /seller/flash-sales/items`

**RegisterFlashSaleItemRequest:**
```json
{
  "slotId": 1,                  // required
  "variantId": 42,              // required
  "flashSalePrice": 99000,      // required, > 0 vÃ  < originalPrice
  "allocatedStock": 100,        // required, > 0 vÃ  â‰¤ stockQuantity gá»‘c
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

YÃªu cáº§u: **Authentication**. Tag: `Cart`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `GET` | `/cart` | Xem giá» (gom nhÃ³m theo store) |
| `POST` | `/cart/items` | ThÃªm vÃ o giá» |
| `PUT` | `/cart/items/{itemId}` | Cáº­p nháº­t sá»‘ lÆ°á»£ng |
| `DELETE` | `/cart/items/{itemId}` | XÃ³a 1 sáº£n pháº©m |
| `DELETE` | `/cart` | XÃ³a toÃ n bá»™ |

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

YÃªu cáº§u: **Authentication**. Tag: `Orders Buyer`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/orders/checkout` | Äáº·t hÃ ng (tÃ¡ch Ä‘a gian hÃ ng) |
| `GET` | `/orders` | DS Ä‘Æ¡n cá»§a tÃ´i |
| `GET` | `/orders/{id}` | Chi tiáº¿t |
| `PATCH` | `/orders/{id}/cancel` | Há»§y (chÆ°a thanh toÃ¡n) |

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

> Cart nhiá»u store â†’ tÃ¡ch thÃ nh nhiá»u Order Ä‘á»™c láº­p theo store. **KhÃ´ng cÃ³ Parent Order**.

**Response 201** â€“ Array `OrderResponse` (má»—i store 1 Order):
```json
[{
  "id": 100, "orderCode": "ORD-20261003-00001",
  "buyerId": 5, "storeId": 2, "storeName": "Shop ABC",
  "slotId": null, "voucherId": 3,
  "recipientName": "...", "recipientPhone": "...",
  "shippingAddressText": "Nguyá»…n VÄƒn A - 0987654321 - 12 Nguyá»…n Huá»‡, ...",
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
**Query:** `?page=0&size=10` (máº·c Ä‘á»‹nh sort `createdAt DESC`).

### `PATCH /orders/{id}/cancel`
Há»§y Ä‘Æ¡n khi chÆ°a thanh toÃ¡n.
**Errors:** `404 ORDER_404`, `403 ORDER_403`, `400 ORDER_400_3` (INVALID_STATUS_TRANSITION).

---

## Seller Order Module `/api/v1/seller/orders`

YÃªu cáº§u: **Role SELLER**.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `GET` | `/seller/orders` | DS Ä‘Æ¡n cá»§a shop |
| `PATCH` | `/seller/orders/{id}/status` | Cáº­p nháº­t tráº¡ng thÃ¡i |

### `PATCH /seller/orders/{id}/status`
**Request:** `{ status: "..." }`. Há»£p lá»‡: `PENDING_PAYMENT`, `CONFIRMED`, `SHIPPED`, `COMPLETED`, `CANCELLED`, `CANCELLED_TIMEOUT`.

---

## Voucher Module `/api/v1/vouchers`

Tag: `Vouchers Public`. Apply cáº§n auth.

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

YÃªu cáº§u: **Role SELLER**. Tag: `Seller Vouchers`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/seller/vouchers` | Táº¡o voucher shop |
| `GET` | `/seller/vouchers` | DS cá»§a tÃ´i |

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

YÃªu cáº§u: **Role ADMIN**. Tag: `Admin Vouchers`.

| Method | Endpoint | MÃ´ táº£ |
|---|---|---|
| `POST` | `/admin/vouchers` | Táº¡o platform voucher (Ã©p storeId=null) |

Giá»‘ng `CreateVoucherRequest` nhÆ°ng server **Ã©p `storeId=null`**.

---

## WebSocket Realtime

### Káº¿t ná»‘i

**Endpoint:** `ws://host/ws` (SockJS fallback: `http://host/ws/...`).

**Browser â†’ Server**: token trong **STOMP CONNECT headers** (khÃ´ng pháº£i query â€“ do header `Authorization` khÃ´ng set Ä‘Æ°á»£c khi upgrade WS):

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
stompClient.connect(
  { token: accessToken },  // STOMP CONNECT headers
  () => { /* connected */ },
  (err) => { /* error */ }
);
```

Server Ä‘á»c `token` tá»« query `?token=` á»Ÿ handshake, validate vÃ  set Principal.

### Destinations (build qua `WsDestinations` Java class â€“ **khÃ´ng hard-code URL ráº£i rÃ¡c**)

#### Public topics (broadcast)

| Subscribe URL | MÃ´ táº£ |
|---|---|
| `/topic/flash-sale/item/{itemId}/stock` | Stock realtime 1 SKU |
| `/topic/flash-sale/slot/{slotId}/stock-update` | Stock thay Ä‘á»•i trong slot |
| `/topic/flash-sale/slot/{slotId}/status` | Slot chuyá»ƒn tráº¡ng thÃ¡i |

#### Private queues (per-user, Spring prefix `/user/{username}`)

| Subscribe URL | MÃ´ táº£ |
|---|---|
| `/user/queue/flash-sale/reservation-result` | Káº¿t quáº£ reservation riÃªng user |
| `/user/queue/flash-sale/orders/{orderCode}/updates` | Update riÃªng cho 1 Ä‘Æ¡n |

### Event Payload

Má»i event Ä‘Æ°á»£c wrap trong `ApiResponse<T>` chung cá»§a project. Body lÃ  `FlashSaleWsEvent`:

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

  // Payload (tuá»³ event)
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

### VÃ­ dá»¥ Subscribe

```javascript
// Public: stock realtime cho 1 SKU
stompClient.subscribe(
  '/topic/flash-sale/item/7/stock',
  (message) => {
    const event = JSON.parse(message.body);
    console.log('Stock giáº£m cÃ²n:', event.data.availableStock);
  }
);

// Private: káº¿t quáº£ reservation
stompClient.subscribe(
  '/user/queue/flash-sale/reservation-result',
  (message) => {
    const event = JSON.parse(message.body);
    if (event.data.eventType === 'ORDER_RESERVED') {
      router.push(`/orders/${event.data.orderCode}`);
    }
  }
);

// Private: update cho 1 Ä‘Æ¡n cá»¥ thá»ƒ
stompClient.subscribe(
  `/user/queue/flash-sale/orders/${orderCode}/updates`,
  (message) => {
    const event = JSON.parse(message.body);
    if (event.data.eventType === 'ORDER_CANCELLED_TIMEOUT') {
      toast.error('ÄÆ¡n Ä‘Ã£ háº¿t háº¡n giá»¯ chá»—');
    }
  }
);
```

### Quy Táº¯c Quan Trá»ng

1. **WS chá»‰ lÃ  thÃ´ng bÃ¡o** â€“ khÃ´ng dá»±a vÃ o WS quyáº¿t Ä‘á»‹nh logic, reload qua REST khi cáº§n.
2. **Stock count láº¥y tá»« REST** (`GET /api/v1/flash-sales/slots`) lÃ  source-of-truth.
3. **WS miss** â†’ REST váº«n Ä‘Ãºng stock â€“ khÃ´ng cáº§n Ä‘á»“ng bá»™ láº¡i.
4. **KhÃ´ng cáº§n queue offline** â€“ `SimpMessagingTemplate` khÃ´ng queue khi user offline.
5. **Heartbeat 10s cáº£ 2 chiá»u**, dedicated scheduler pool.

---

## Báº£ng MÃ£ Lá»—i Tá»•ng Há»£p

### Common Error Codes
| HTTP | Code | Message |
|---|---|---|
| 400 | `SYS_400` | Dá»¯ liá»‡u yÃªu cáº§u khÃ´ng há»£p lá»‡ |
| 401 | `AUTH_401` | ChÆ°a xÃ¡c thá»±c hoáº·c token khÃ´ng há»£p lá»‡ |
| 403 | `AUTH_403` | KhÃ´ng cÃ³ quyá»n truy cáº­p tÃ i nguyÃªn |
| 404 | `SYS_404` | KhÃ´ng tÃ¬m tháº¥y tÃ i nguyÃªn yÃªu cáº§u |
| 405 | `SYS_405` | PhÆ°Æ¡ng thá»©c HTTP khÃ´ng Ä‘Æ°á»£c há»— trá»£ |
| 409 | `SYS_409` | Xáº£y ra xung Ä‘á»™t tÃ i nguyÃªn |
| 422 | `SYS_422` | Dá»¯ liá»‡u khÃ´ng vÆ°á»£t qua rÃ ng buá»™c xÃ¡c thá»±c |
| 500 | `SYS_500` | Lá»—i mÃ¡y chá»§ ná»™i bá»™ khÃ´ng xÃ¡c Ä‘á»‹nh |

> GlobalExceptionHandler tráº£ `400 BAD_REQUEST` (khÃ´ng pháº£i 422) cho cáº£ `MethodArgumentNotValidException` vÃ  `ConstraintViolationException`.

### Auth Errors
| HTTP | Code | Message |
|---|---|---|
| 401 | `AUTH_401_CREDENTIALS` | Email hoáº·c máº­t kháº©u khÃ´ng chÃ­nh xÃ¡c |
| 401 | `AUTH_401_REFRESH_TOKEN` | Refresh token khÃ´ng há»£p lá»‡ hoáº·c Ä‘Ã£ háº¿t háº¡n |
| 403 | `AUTH_403_USER_DISABLED` | TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ bá»‹ khÃ³a hoáº·c táº¡m ngÆ°ng |
| 404 | `AUTH_404_ROLE` | Vai trÃ² yÃªu cáº§u khÃ´ng tá»“n táº¡i trÃªn há»‡ thá»‘ng |
| 409 | `AUTH_409_EMAIL` | Email nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½ trÃªn há»‡ thá»‘ng |
| 409 | `AUTH_409_PHONE` | Sá»‘ Ä‘iá»‡n thoáº¡i nÃ y Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng |

### User Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `USER_400_OLD_PASSWORD` | Máº­t kháº©u hiá»‡n táº¡i khÃ´ng chÃ­nh xÃ¡c |
| 400 | `USER_400_DELETE_DEFAULT` | KhÃ´ng thá»ƒ xÃ³a Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh khi cÃ²n Ä‘á»‹a chá»‰ khÃ¡c |
| 403 | `USER_403_ADDRESS_DENIED` | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p/chá»‰nh sá»­a Ä‘á»‹a chá»‰ nÃ y |
| 404 | `USER_404_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin ngÆ°á»i dÃ¹ng |
| 404 | `USER_404_ADDRESS` | KhÃ´ng tÃ¬m tháº¥y Ä‘á»‹a chá»‰ yÃªu cáº§u |

### Store Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `STORE_400_INVALID_STATUS` | Tráº¡ng thÃ¡i phÃª duyá»‡t gian hÃ ng khÃ´ng há»£p lá»‡ |
| 400 | `STORE_400_NOT_APPROVED` | Gian hÃ ng chÆ°a Ä‘Æ°á»£c phÃª duyá»‡t hoáº·c Ä‘ang bá»‹ táº¡m khÃ³a |
| 403 | `STORE_403_ACCESS_DENIED` | Báº¡n khÃ´ng cÃ³ quyá»n quáº£n lÃ½ gian hÃ ng nÃ y |
| 403 | `STORE_403_ADDRESS_ACCESS_DENIED` | Äá»‹a chá»‰ kho khÃ´ng thuá»™c quyá»n sá»Ÿ há»¯u cá»§a gian hÃ ng nÃ y |
| 404 | `STORE_404_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y thÃ´ng tin gian hÃ ng |
| 404 | `STORE_404_ADDRESS_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y Ä‘á»‹a chá»‰ kho cá»§a gian hÃ ng |
| 409 | `STORE_409_EXISTS` | Báº¡n Ä‘Ã£ cÃ³ gian hÃ ng trÃªn há»‡ thá»‘ng, khÃ´ng thá»ƒ Ä‘Äƒng kÃ½ thÃªm |
| 409 | `STORE_409_NAME_EXISTS` | TÃªn gian hÃ ng nÃ y Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng |

### Product / Category Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `PROD_400_VARIANTS_REQUIRED` | Sáº£n pháº©m pháº£i cÃ³ Ã­t nháº¥t má»™t biáº¿n thá»ƒ phÃ¢n loáº¡i (SKU) |
| 400 | `PROD_400_INVALID_TIER_VARIATION` | Sá»‘ lÆ°á»£ng biáº¿n thá»ƒ khÃ´ng khá»›p vá»›i cáº¥u hÃ¬nh phÃ¢n loáº¡i tier_variation_configs |
| 400 | `PROD_400_INVALID_PRICE` | GiÃ¡ bÃ¡n cá»§a biáº¿n thá»ƒ pháº£i lá»›n hÆ¡n 0 |
| 400 | `PROD_400_INVALID_STOCK` | Sá»‘ lÆ°á»£ng tá»“n kho khÃ´ng Ä‘Æ°á»£c nhá» hÆ¡n 0 |
| 400 | `PROD_400_DUPLICATE_SKU` | MÃ£ SKU khÃ´ng Ä‘Æ°á»£c trÃ¹ng láº·p trong cÃ¹ng sáº£n pháº©m |
| 403 | `PROD_403_ACCESS_DENIED` | Báº¡n khÃ´ng cÃ³ quyá»n quáº£n lÃ½ sáº£n pháº©m nÃ y |
| 403 | `PROD_403_STORE_NOT_ELIGIBLE` | Gian hÃ ng chÆ°a Ä‘Æ°á»£c phÃª duyá»‡t hoáº·c khÃ´ng Ä‘á»§ Ä‘iá»u kiá»‡n Ä‘Äƒng bÃ¡n |
| 404 | `PROD_404_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m |
| 404 | `PROD_404_VARIANT_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y biáº¿n thá»ƒ phÃ¢n loáº¡i sáº£n pháº©m |
| 409 | `PROD_409_SKU_EXISTS` | MÃ£ SKU nÃ y Ä‘Ã£ tá»“n táº¡i trong há»‡ thá»‘ng |
| 409 | `PROD_409_VARIANT_IN_ACTIVE_FLASH_SALE` | KhÃ´ng thá»ƒ chá»‰nh sá»­a giÃ¡ hoáº·c tá»“n kho cá»§a biáº¿n thá»ƒ Ä‘ang tham gia Flash Sale Ä‘ang hoáº¡t Ä‘á»™ng |
| 404 | `CAT_404_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y ngÃ nh hÃ ng yÃªu cáº§u |
| 409 | `CAT_409_NAME_EXISTS` | TÃªn ngÃ nh hÃ ng Ä‘Ã£ tá»“n táº¡i |
| 409 | `CAT_409_SLUG_EXISTS` | ÄÆ°á»ng dáº«n slug cá»§a ngÃ nh hÃ ng Ä‘Ã£ tá»“n táº¡i |

### Flash Sale Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `FS_400_SLOT_TIME_INVALID` | Thá»i gian báº¯t Ä‘áº§u pháº£i trÆ°á»›c thá»i gian káº¿t thÃºc |
| 400 | `FS_400_SLOT_NOT_ACTIVE` | Khung giá» Flash Sale hiá»‡n khÃ´ng hoáº¡t Ä‘á»™ng |
| 400 | `FS_400_SLOT_ALREADY_ENDED` | Khung giá» Flash Sale Ä‘Ã£ káº¿t thÃºc |
| 400 | `FS_400_ITEM_NOT_PENDING` | Má»¥c Flash Sale khÃ´ng á»Ÿ tráº¡ng thÃ¡i chá» duyá»‡t |
| 400 | `FS_400_INVALID_PRICE` | GiÃ¡ Flash Sale pháº£i lá»›n hÆ¡n 0 vÃ  nhá» hÆ¡n giÃ¡ gá»‘c cá»§a biáº¿n thá»ƒ |
| 400 | `FS_400_INVALID_ALLOCATED_STOCK` | Sá»‘ lÆ°á»£ng tá»“n kho phÃ¢n bá»• cho Flash Sale khÃ´ng há»£p lá»‡ hoáº·c vÆ°á»£t quÃ¡ tá»“n kho gá»‘c |
| 400 | `FS_400_INVALID_PURCHASE_LIMIT` | Giá»›i háº¡n mua cá»§a ngÆ°á»i dÃ¹ng pháº£i lá»›n hÆ¡n 0 |
| 400 | `FS_400_IDEMPOTENCY_KEY_MISSING` | YÃªu cáº§u thiáº¿u Idempotency-Key |
| 403 | `FS_403_STORE_NOT_APPROVED` | Gian hÃ ng chÆ°a Ä‘Æ°á»£c duyá»‡t, khÃ´ng thá»ƒ tham gia Flash Sale |
| 403 | `FS_403_NOT_STORE_OWNER` | Báº¡n khÃ´ng cÃ³ quyá»n quáº£n lÃ½ sáº£n pháº©m hoáº·c gian hÃ ng nÃ y |
| 403 | `FS_403_ADDRESS_INVALID` | Äá»‹a chá»‰ giao hÃ ng khÃ´ng há»£p lá»‡ hoáº·c khÃ´ng thuá»™c vá» ngÆ°á»i dÃ¹ng |
| 404 | `FS_404_SLOT_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y khung giá» Flash Sale |
| 404 | `FS_404_ITEM_NOT_FOUND` | KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong Flash Sale |
| 409 | `FS_409_SLOT_OVERLAP` | Khung giá» Flash Sale bá»‹ trÃ¹ng láº·p vá»›i khung giá» Ä‘Ã£ tá»“n táº¡i |
| 409 | `FS_409_ITEM_ALREADY_REGISTERED` | Biáº¿n thá»ƒ sáº£n pháº©m nÃ y Ä‘Ã£ Ä‘Æ°á»£c Ä‘Äƒng kÃ½ trong khung giá» |
| 409 | `FS_409_INSUFFICIENT_BASE_STOCK` | Tá»“n kho gá»‘c cá»§a sáº£n pháº©m khÃ´ng Ä‘á»§ Ä‘á»ƒ phÃ¢n bá»• cho Flash Sale |
| 409 | `FS_409_OUT_OF_STOCK` | Sáº£n pháº©m Flash Sale Ä‘Ã£ háº¿t hÃ ng tá»“n kho |
| 409 | `FS_409_PURCHASE_LIMIT_EXCEEDED` | Báº¡n Ä‘Ã£ vÆ°á»£t quÃ¡ giá»›i háº¡n sá»‘ lÆ°á»£ng mua cho sáº£n pháº©m nÃ y trong phiÃªn Flash Sale |
| 409 | `FS_409_IDEMPOTENCY_CONFLICT` | YÃªu cáº§u vá»›i Idempotency-Key nÃ y Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½, vui lÃ²ng khÃ´ng gá»­i láº·p láº¡i |
| 500 | `FS_500_ORDER_FAILED` | Há»‡ thá»‘ng báº­n khi khá»Ÿi táº¡o Ä‘Æ¡n hÃ ng Flash Sale |

### Cart Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `CART_400_1` (`INSUFFICIENT_STOCK`) | Sá»‘ lÆ°á»£ng tá»“n kho sáº£n pháº©m khÃ´ng Ä‘á»§ |
| 400 | `CART_400_2` (`INVALID_QUANTITY`) | Sá»‘ lÆ°á»£ng sáº£n pháº©m thÃªm vÃ o giá» pháº£i lá»›n hÆ¡n 0 |
| 403 | `CART_403` (`CART_ITEM_ACCESS_DENIED`) | Báº¡n khÃ´ng cÃ³ quyá»n thao tÃ¡c trÃªn má»¥c giá» hÃ ng nÃ y |
| 404 | `CART_404` (`CART_NOT_FOUND`) | KhÃ´ng tÃ¬m tháº¥y giá» hÃ ng cá»§a ngÆ°á»i dÃ¹ng |
| 404 | `CART_ITEM_404` (`CART_ITEM_NOT_FOUND`) | KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m trong giá» hÃ ng |

### Order Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `ORDER_400_1` (`EMPTY_ORDER_ITEMS`) | ÄÆ¡n hÃ ng pháº£i chá»©a Ã­t nháº¥t má»™t sáº£n pháº©m |
| 400 | `ORDER_400_2` (`INSUFFICIENT_VARIANT_STOCK`) | Sá»‘ lÆ°á»£ng tá»“n kho sáº£n pháº©m khÃ´ng Ä‘á»§ Ä‘á»ƒ Ä‘áº·t hÃ ng |
| 400 | `ORDER_400_3` (`INVALID_STATUS_TRANSITION`) | Tráº¡ng thÃ¡i chuyá»ƒn Ä‘á»•i cá»§a Ä‘Æ¡n hÃ ng khÃ´ng há»£p lá»‡ |
| 400 | `ORDER_400_4` (`STORE_NOT_APPROVED`) | Gian hÃ ng chÆ°a Ä‘Æ°á»£c duyá»‡t hoáº·c Ä‘ang bá»‹ khÃ³a, khÃ´ng thá»ƒ Ä‘áº·t hÃ ng |
| 403 | `ORDER_403` (`ORDER_ACCESS_DENIED`) | Báº¡n khÃ´ng cÃ³ quyá»n truy cáº­p hoáº·c thao tÃ¡c trÃªn Ä‘Æ¡n hÃ ng nÃ y |
| 404 | `ORDER_404` (`ORDER_NOT_FOUND`) | KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng |

### Voucher Errors
| HTTP | Code | Message |
|---|---|---|
| 400 | `VOUCHER_400_1` (`EXPIRED`) | MÃ£ giáº£m giÃ¡ Ä‘Ã£ háº¿t háº¡n sá»­ dá»¥ng |
| 400 | `VOUCHER_400_2` (`NOT_STARTED`) | MÃ£ giáº£m giÃ¡ chÆ°a Ä‘áº¿n thá»i gian hiá»‡u lá»±c |
| 400 | `VOUCHER_400_3` (`OUT_OF_STOCK`) | MÃ£ giáº£m giÃ¡ Ä‘Ã£ háº¿t lÆ°á»£t sá»­ dá»¥ng |
| 400 | `VOUCHER_400_4` (`USER_LIMIT_EXCEEDED`) | Báº¡n Ä‘Ã£ dÃ¹ng háº¿t lÆ°á»£t cho phÃ©p |
| 400 | `VOUCHER_400_5` (`MIN_AMOUNT_NOT_MET`) | GiÃ¡ trá»‹ Ä‘Æ¡n hÃ ng chÆ°a Ä‘áº¡t má»©c tá»‘i thiá»ƒu Ã¡p dá»¥ng mÃ£ |
| 400 | `VOUCHER_400_6` (`INACTIVE`) | MÃ£ giáº£m giÃ¡ Ä‘ang bá»‹ táº¡m khÃ³a |
| 400 | `VOUCHER_400_7` (`INVALID_DATES`) | Thá»i gian káº¿t thÃºc pháº£i sau thá»i gian báº¯t Ä‘áº§u |
| 400 | `VOUCHER_400_8` (`INVALID_DISCOUNT_PERCENT`) | Tá»· lá»‡ giáº£m giÃ¡ theo % khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 100% |
| 403 | `VOUCHER_403` (`STORE_MISMATCH`) | MÃ£ giáº£m giÃ¡ cá»§a gian hÃ ng khÃ´ng Ã¡p dá»¥ng cho Ä‘Æ¡n hÃ ng gian hÃ ng khÃ¡c |
| 404 | `VOUCHER_404` (`VOUCHER_NOT_FOUND`) | KhÃ´ng tÃ¬m tháº¥y mÃ£ giáº£m giÃ¡ |
| 409 | `VOUCHER_409` (`VOUCHER_CODE_EXISTS`) | MÃ£ giáº£m giÃ¡ Ä‘Ã£ tá»“n táº¡i trÃªn há»‡ thá»‘ng |

---

## PhÃ¢n Quyá»n Truy Cáº­p

### Public Endpoints
- `POST /auth/{register,login,refresh-token,logout}`
- `GET /categories`, `/categories/{id}`, `/categories/slug/{slug}`
- `GET /products`, `/products/{id}`
- `GET /stores/{id}`
- `GET /flash-sales/slots`
- `GET /vouchers/platform`, `/vouchers/store/{storeId}`
- `WS /ws/**` (auth xá»­ lÃ½ á»Ÿ interceptor)
- `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**`

### Authenticated (cáº§n JWT)
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
- CORS: enable (`CorsConfig` riÃªng)
- CSRF: disable (stateless API)
- Session: STATELESS
- BCrypt password encoder
- JWT filter cháº¡y trÆ°á»›c `UsernamePasswordAuthenticationFilter`
- 401/403 â†’ tráº£ JSON `ApiResponse` format chuáº©n
