# QUY ĐỊNH CODE GIAO DIỆN – VIBE MART (Frontend)

> Tài liệu này là "luật" cho mọi người và mọi AI (Claude Code, Cursor, Copilot, v0…) khi viết code giao diện cho dự án.
> Đặt file ở thư mục gốc của repo frontend với tên `CLAUDE.md` (Claude Code), `AGENTS.md` hoặc `.cursorrules` (Cursor).
> AI phải đọc toàn bộ file này trước khi viết code. Khi một yêu cầu mâu thuẫn với quy định ở đây, hãy HỎI LẠI thay vì tự quyết.

---

## 0. Bối cảnh dự án

- **Vibe Mart**: sàn TMĐT B2C đa người bán (multi-vendor), tính năng nổi bật là **Flash Sale** chống bán vượt kho (over-selling). Đồ án Kỹ thuật Phần mềm – UTC2.
- **3 khu vực giao diện** trong cùng một ứng dụng Next.js:
  - **Storefront** (người mua): desktop + mobile, màu chủ đạo xanh biển.
  - **Seller Center** (người bán): chỉ desktop, màu mint.
  - **Admin Console** (quản trị sàn): chỉ desktop, sidebar xám than.
- **Backend**: Spring Boot (REST + JWT), PostgreSQL, Redis, WebSocket STOMP. Frontend KHÔNG chứa logic nghiệp vụ quan trọng (tính tiền, trừ kho, kiểm tra voucher, phân quyền thật) – mọi thứ đó do backend quyết định.
- **Thanh toán**: ZaloPay QR (giữ hàng 5 phút) và COD. **Đăng nhập**: email/mật khẩu, Google, Facebook, GitHub.
- Toàn bộ chữ hiển thị là **tiếng Việt có dấu**.

---

## 1. Tech stack (cố định – không tự ý thêm thư viện)

| Mục | Dùng | Ghi chú |
|---|---|---|
| Framework | Next.js (App Router) + React + TypeScript `strict` | Không dùng Pages Router |
| Style | Tailwind CSS | Không CSS-in-JS, không file `.css` riêng trừ `globals.css` |
| UI primitives | shadcn/ui (Radix) + icon `lucide-react` | Copy component vào `components/ui`, không cài bộ UI khác |
| Dữ liệu server | TanStack Query | Không gọi `fetch` trực tiếp trong component |
| State client | Zustand | Chỉ cho state thật sự toàn cục (auth, giỏ hàng tạm) |
| Form | react-hook-form + zod | Mọi form đều có schema zod |
| Realtime | `@stomp/stompjs` (+ SockJS nếu backend bật) | Chỉ qua hook `useStomp` |
| Biểu đồ | Recharts | Chỉ ở Dashboard Seller/Admin |
| Ngày giờ | `date-fns` (locale `vi`) | Không dùng moment |

Muốn thêm thư viện mới → phải hỏi trước và nêu lý do.

---

## 2. Cấu trúc thư mục

```
src/
  app/
    (auth)/            dang-nhap, dang-ky, quen-mat-khau, ...
    (storefront)/      trang-chu (/) , flash-sale, san-pham/[slug], tim-kiem, gio-hang,
                       thanh-toan, don-hang, tai-khoan, kho-voucher, shop/[slug], dang-ky-ban-hang
    seller/            layout có SellerSidebar: tong-quan, san-pham, don-hang, flash-sale, ...
    admin/             layout có AdminSidebar: tong-quan, nguoi-dung, gian-hang, khung-gio, ...
    bao-tri/           trang "Tính năng đang bảo trì"
    not-found.tsx, forbidden/
  components/
    ui/                shadcn primitives (Button, Input, Dialog, Table, ...)
    common/            dùng chung mọi portal (StatusBadge, PriceText, EmptyState, Pagination, ...)
    storefront/        Header, Footer, ProductCard, FlashSaleCard, VoucherTicket, ...
    seller/  admin/    component riêng từng portal
  features/            logic theo nghiệp vụ: auth, cart, checkout, flash-sale, orders, vouchers, ...
    <feature>/api.ts       hàm gọi API
    <feature>/hooks.ts     useQuery/useMutation
    <feature>/types.ts     kiểu dữ liệu khớp DTO backend
    <feature>/schemas.ts   zod schema
  lib/                 api-client.ts, format.ts, constants.ts, stomp.ts, utils.ts (cn)
  stores/              zustand stores
  middleware.ts        chặn route theo vai trò
```

- Tên file component: `PascalCase.tsx`; hook: `useXxx.ts`; còn lại `kebab-case.ts`.
- Đường dẫn URL dùng **tiếng Việt không dấu, gạch ngang** (`/don-hang`, `/kho-voucher`).
- Mỗi component một file, **tối đa ~200 dòng**; dài hơn thì tách.

---

## 3. Design tokens (design system "Ocean Mint")

Khai báo một lần trong `tailwind.config.ts`. **Cấm viết mã màu hex trực tiếp trong component** – luôn dùng tên token.

| Token Tailwind | Giá trị | Dùng cho |
|---|---|---|
| `brand` / `brand-hover` / `brand-soft` | `#0284C7` / `#0369A1` / `#E0F2FE` | Storefront, nút chính Admin |
| `seller` / `seller-hover` / `seller-soft` | `#10B981` / `#059669` / `#D1FAE5` | Seller Center |
| `admin` / `admin-2` | `#1E293B` / `#334155` | Sidebar Admin |
| `sale` / `sale-soft` | `#E11D48` / `#FFE4E6` | CHỈ Flash Sale, giá giảm, badge -%, cảnh báo hết hạn |
| `page` / `card` / `line` | `#F8FAFC` / `#FFFFFF` / `#E2E8F0` | Nền trang, nền card, viền |
| `ink` / `ink-2` / `ink-3` | `#0F172A` / `#64748B` / `#94A3B8` | Chữ chính / phụ / mờ |
| `success` / `warning` / `danger` / `info` | `#16A34A` / `#F59E0B` / `#DC2626` / `#0284C7` | Trạng thái |
| `star` | `#F59E0B` | Sao đánh giá |

- Font: **Be Vietnam Pro** qua `next/font/google` (subset `vietnamese`), weight 400/500/600.
- Cỡ chữ: H1 28px/600, H2 22px/600, H3 18px/600, body 14–15px, caption 12px. Giá tiền: 600 + `tabular-nums`.
- Bo góc: card `rounded-xl` (12px), nút/input `rounded-lg` (8px), badge `rounded-md` (6px).
- Khoảng cách theo lưới 8px. Shadow tối đa `shadow-sm`; ưu tiên viền 1px `border-line`.
- Nút cao 40px (nhỏ 32px). Icon lucide 20px (16px trong nút nhỏ).
- **Chỉ Light mode.** Không viết class `dark:`.

---

## 4. Quy tắc chống rối mắt (bắt buộc)

1. Mỗi màn chỉ có **MỘT** nút `variant="primary"`; hành động khác dùng `secondary` / `ghost`.
2. Không gradient, không hoạ tiết trang trí, không animation chớp nháy (trừ chấm "live" nhỏ).
3. Một vùng nhìn tối đa 3 màu: trắng/xám + màu portal + (nếu có) đỏ `sale`.
4. Lưới sản phẩm: desktop tối đa 5 cột, tablet 3–4, mobile 2.
5. Bảng dữ liệu: hàng cao 56px, viền ngang mảnh, không sọc ngựa vằn, hành động gom vào menu `⋯` cuối hàng.
6. Form dài chia thành nhiều card section có tiêu đề; label nằm trên input.
7. Popup (`Dialog`) chỉ dùng cho thao tác ngắn: xác nhận, chọn địa chỉ, chọn voucher, viết đánh giá. Form dài dùng trang hoặc `Sheet` trượt phải.
8. Mọi danh sách đều có đủ 4 trạng thái: **đang tải (skeleton) – rỗng (EmptyState) – lỗi (có nút Thử lại) – có dữ liệu**.

---

## 5. Component dùng chung – BẮT BUỘC tái sử dụng

Trước khi tạo component mới, tìm trong `components/` xem đã có chưa. **Không được copy-paste một header/footer/thẻ thứ hai.**

| Component | Vị trí | Ghi chú |
|---|---|---|
| `StorefrontHeader` | storefront | Prop `activeNav` để tô đúng mục đang chọn (xem bảng mục 9); prop `variant="compact"` cho Giỏ hàng/Checkout/ZaloPay |
| `StorefrontFooter` | storefront | Một bản duy nhất cho mọi trang người mua |
| `MobileBottomNav` | storefront | 4 tab: Trang chủ, Flash Sale, Đơn hàng, Tôi; prop `active` |
| `SellerSidebar`, `AdminSidebar`, `PortalTopbar` | seller / admin | Menu khai báo trong một mảng cấu hình, không viết cứng nhiều nơi |
| `ProductCard` | storefront | Biến thể: `default`, `discount`, `voucher`, `skeleton`, `mini`. Chiều cao cố định, tên luôn giữ chỗ 2 dòng; tag voucher/freeship ĐÈ lên ảnh góc dưới trái, không làm đổi kích thước thẻ |
| `FlashSaleCard` | storefront | Trạng thái: `live`, `almost-sold-out` (>90%), `sold-out`, `upcoming` |
| `StockBar` | storefront | Thanh "ĐÃ BÁN X" / "SẮP CHÁY HÀNG" |
| `Countdown` | common | Nhận `endsAt` (ISO từ server), tự trừ độ lệch giờ server |
| `PriceText` | common | Hiện giá, giá gốc gạch ngang, badge % |
| `StatusBadge` | common | Nhận `type` + `status` enum, tự tra nhãn và màu (mục 6) |
| `VoucherTicket` | common | Thẻ voucher dạng vé, dùng ở trang chủ, kho voucher, checkout |
| `Pagination` | common | Biến thể `full`, `compact` ("1/42 ‹ ›"), `table` (kèm "Hiển thị 1–20 trong 248"), `mobile` |
| `EmptyState`, `ErrorState` | common | Icon outline + 1 câu + 1 nút |
| `ConfirmDialog` | common | Mọi thao tác xoá/huỷ/khoá phải qua đây |
| `AddressPicker` | storefront | Popup chọn địa chỉ, có bản đồ ghim GPS |

---

## 6. Ngôn ngữ, định dạng và nhãn trạng thái

- Tiền: `formatVND(1290000)` → `1.290.000₫`. Không tự nối chuỗi `"đ"`.
- Số lớn rút gọn: `1,2k`, `12,3k`, `1,28 tỷ₫`.
- Ngày giờ: `14:00 – 01/10/2026`; thời gian tương đối: "5 phút trước".
- Mã đơn hiển thị nguyên văn từ backend (`FS-261001-A7K2Q`).
- Văn phong: ngắn, rõ, không dùng "Vui lòng" thừa, không dấu `!`. Nút bắt đầu bằng động từ: "Mua ngay", "Thêm vào giỏ", "Lưu thay đổi".
- **Không hiển thị enum tiếng Anh cho người dùng.** Tất cả nằm trong `lib/constants.ts`:

| Enum (backend) | Nhãn hiển thị | Màu badge |
|---|---|---|
| Order `PENDING_PAYMENT` | Chờ thanh toán | warning |
| Order `PAID` | Đã thanh toán | info |
| Order `CONFIRMED` | Đã xác nhận | info |
| Order `SHIPPING` | Đang giao | info |
| Order `COMPLETED` | Hoàn thành | success |
| Order `CANCELLED_TIMEOUT` | Đã huỷ – quá hạn thanh toán | neutral |
| Order `CANCELLED_USER` | Đã huỷ | neutral |
| Payment `PENDING` / `SUCCESS` / `FAILED` / `EXPIRED` / `REFUNDED` | Đang chờ / Thành công / Thất bại / Hết hạn / Đã hoàn tiền | warning / success / danger / neutral / info |
| Slot `UPCOMING` / `ACTIVE` / `ENDED` | Sắp diễn ra / Đang diễn ra / Đã kết thúc | info / sale / neutral |
| FlashSaleItem `PENDING_APPROVAL` / `APPROVED` / `REJECTED` / `ENDED` | Chờ duyệt / Đã duyệt / Từ chối / Đã kết thúc | warning / success / danger / neutral |
| Store `PENDING` / `APPROVED` / `BANNED` | Chờ duyệt / Đã duyệt / Đã cấm | warning / success / danger |
| User `ACTIVE` / `LOCKED` / `SUSPENDED` | Hoạt động / Đã khoá / Tạm đình chỉ | success / danger / warning |
| Product `ACTIVE` / `INACTIVE` / `OUT_OF_STOCK` | Đang bán / Đã ẩn / Hết hàng | success / neutral / warning |
| Voucher `ACTIVE` / `EXPIRED` / `EXHAUSTED` / `DISABLED` | Đang diễn ra / Hết hạn / Hết lượt / Đã tắt | success / neutral / warning / neutral |
| Review `VISIBLE` / `HIDDEN` | Hiển thị / Đã ẩn | success / neutral |

---

## 7. Gọi API và xử lý dữ liệu

- Mọi request đi qua `lib/api-client.ts` (gắn JWT, base URL từ `NEXT_PUBLIC_API_URL`, chuẩn hoá lỗi). Không gọi API trực tiếp trong component – dùng hook trong `features/<x>/hooks.ts`.
- Kiểu dữ liệu trong `types.ts` phải **khớp DTO backend**; không dùng `any`. Chưa có API thì tạo mock trong `features/<x>/mock.ts` cùng kiểu dữ liệu, bật bằng `NEXT_PUBLIC_USE_MOCK=true`.
- Query key đặt theo mảng: `['orders', { status, page }]`. Sau khi mutation thành công phải `invalidateQueries` đúng key.
- Xử lý lỗi theo mã HTTP:
  - `401` → xoá phiên, chuyển `/dang-nhap?redirect=...`.
  - `403` do quyền bị **tắt tính năng** (feature toggle `is_active = false`) → chuyển `/bao-tri?feature=<mã quyền>`; 403 thường → trang "Không có quyền truy cập".
  - `409` / `422` → hiện thông báo nghiệp vụ từ backend (VD: "Sản phẩm đã hết hàng", "Bạn đã đạt giới hạn mua").
  - `5xx` / mất mạng → `ErrorState` có nút "Thử lại", không làm trắng trang.
- **Không tin dữ liệu phía client**: không tự tính tổng tiền cuối, phí sàn, mức giảm voucher để gửi lên; không gửi `slotId`/giá lên khi đặt Flash Sale – chỉ gửi `flashSaleItemId` + `quantity`. Số tiền hiển thị lấy từ response của backend.
- Thông báo kết quả bằng toast (góc phải trên), tối đa 1 dòng.

---

## 8. Flash Sale, giữ chỗ và thanh toán (phần cốt lõi – làm cẩn thận)

1. **Đồng hồ**: luôn tính theo giờ server. Khi tải trang lấy `serverTime`, lưu độ lệch `offset = serverTime - Date.now()`; `Countdown` dùng `Date.now() + offset`. Không đếm theo giờ máy người dùng.
2. **Tồn kho realtime**: subscribe STOMP topic tồn kho của phiên qua `useStomp`; cập nhật `StockBar` bằng `queryClient.setQueryData`, không refetch cả trang. Huỷ subscribe khi rời trang. Mất kết nối → hiện chip "Đang kết nối lại…" và tự kết nối lại.
3. **Nút "Mua ngay"**: bấm xong khoá nút ngay (loading) cho tới khi có phản hồi để chống bấm đúp; mỗi lần bấm gửi kèm header `Idempotency-Key` (uuid). Hết hàng/hết phiên → nút chuyển trạng thái "Đã hết", không ẩn đi.
4. **Giữ chỗ 5 phút**: thời điểm hết hạn lấy từ `expiresAt` của đơn (backend trả), không tự đặt 5 phút ở client. Hết giờ → chuyển sang màn "Đơn hàng đã hết hạn".
5. **ZaloPay QR**: hiển thị QR từ dữ liệu backend; kiểm tra trạng thái bằng STOMP hoặc polling 3 giây/lần; trạng thái thanh toán cuối cùng **chỉ tin theo backend** (webhook), không tin tham số trên URL trả về.
6. Giỏ hàng nhiều shop: hiển thị theo nhóm shop và ghi rõ "sẽ được tách thành N đơn hàng". QR gộp hiển thị danh sách các đơn con kèm tổng tiền.

---

## 9. Phân quyền, điều hướng và layout

- `middleware.ts` chặn route theo vai trò trong JWT: `/seller/**` cần `ROLE_SELLER` (store đã `APPROVED`), `/admin/**` cần `ROLE_ADMIN`. Chưa đăng nhập → `/dang-nhap`.
- Ẩn/hiện nút theo quyền bằng hook `useCan('product:update')` – chỉ là UX, backend vẫn kiểm tra thật.
- Seller có store `PENDING` → luôn chuyển về màn "Hồ sơ đang được xét duyệt".
- Mục điều hướng đang chọn (`activeNav` desktop / `active` mobile):

| Trang | Desktop | Mobile |
|---|---|---|
| Trang chủ | Trang chủ | Trang chủ |
| Flash Sale | Flash Sale | Flash Sale |
| Danh sách theo danh mục | Danh mục | Trang chủ |
| Tìm kiếm, Chi tiết SP, Trang gian hàng | (không tô) | Trang chủ |
| Kho voucher | Voucher | Tôi |
| Đơn hàng, Chi tiết đơn | (không tô) | Đơn hàng |
| Tài khoản, Đăng ký bán hàng | (không tô) | Tôi |
| Giỏ hàng, Checkout, ZaloPay, Kết quả | header `compact` | ẩn bottom nav |

---

## 10. Responsive và khả năng truy cập

- Breakpoint Tailwind mặc định; thiết kế mobile-first cho Storefront. Seller/Admin tối thiểu 1280px, dưới mức đó hiện thông báo "Vui lòng dùng máy tính".
- Container nội dung `max-w-[1200px] mx-auto px-4`.
- Ảnh dùng `next/image` có `alt` tiếng Việt, kích thước cố định để không nhảy layout.
- Nút chỉ có icon phải có `aria-label`. Mọi phần tử bấm được dùng `button`/`a`, có focus ring `ring-2 ring-brand`.
- Độ tương phản chữ đạt WCAG AA; không truyền tải thông tin chỉ bằng màu (badge luôn có chữ).

---

## 11. Quy ước viết code

- Mặc định **Server Component**; chỉ thêm `'use client'` khi cần state, effect, sự kiện hoặc STOMP.
- Không `any`, không `// @ts-ignore`. Props khai báo bằng `type XxxProps`.
- Gộp class bằng `cn()`; biến thể component dùng `cva`.
- Không để số "ma thuật": thời gian, giới hạn, kích thước trang đặt trong `lib/constants.ts`.
- Không để `console.log` khi commit. ESLint + Prettier phải sạch.
- Tên biến/hàm tiếng Anh; chữ hiển thị tiếng Việt.
- Commit theo Conventional Commits: `feat(storefront): thêm trang Flash Sale`, `fix(seller): sửa bảng SKU`.

---

## 12. Quy trình bắt buộc khi AI viết code

1. **Đọc trước khi viết**: đọc file này, các component liên quan trong `components/`, và `types.ts` của feature.
2. **Làm từng phần nhỏ**: mỗi lần chỉ một trang hoặc một component. Không sửa file ngoài phạm vi được yêu cầu.
3. **Tái sử dụng trước, tạo mới sau**: nếu cần component mới dùng chung, đặt vào `components/common` và báo lại.
4. **Không bịa API**: nếu chưa biết endpoint/DTO, dùng mock đúng kiểu và ghi `// TODO(api): ...`, rồi liệt kê trong báo cáo.
5. **Tự kiểm tra trước khi báo xong**:
   - [ ] `pnpm lint` và `pnpm tsc --noEmit` không lỗi
   - [ ] Không có mã màu hex trong component, chỉ dùng token
   - [ ] Đủ 4 trạng thái: tải / rỗng / lỗi / có dữ liệu
   - [ ] Đúng một nút primary trên màn
   - [ ] Mobile 375px không tràn ngang (với trang Storefront)
   - [ ] Mọi chữ hiển thị là tiếng Việt, enum đã đổi sang nhãn
   - [ ] Đã dùng lại Header/Footer/ProductCard/Pagination có sẵn, tô đúng mục điều hướng
6. **Báo cáo ngắn** sau mỗi lần làm: file đã tạo/sửa, component mới, các `TODO(api)` còn lại.
