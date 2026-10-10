/**
 * ProductCard – shared types (Modern Clean, Vibe Mart v2.5)
 * Tách riêng để dễ test + reuse cho cả Storefront & Mobile adaptations.
 *
 * Tokens: dùng CSS variables đã khai báo trong src/app/globals.css
 *   --color-brand (#0284C7), --color-sale (#E11D48), --color-seller (#10B981),
 *   --color-line (#E2E8F0), --color-card (#FFFFFF), --color-ink (#0F172A), ...
 */

import type { ReactNode } from "react";

export type ProductCardVariant =
  | "default"
  | "discount"
  | "voucher"
  | "freeship"
  | "saleVoucher"
  | "flashSale"
  | "almostSoldOut"
  | "soldOut"
  | "upcoming"
  | "skeleton"
  | "hover"
  | "focus"
  | "mobile"
  | "mobileHorizontal"
  | "mini";

export interface ProductCardBaseProps {
  /** URL ảnh sản phẩm (1:1 square). */
  imageUrl: string;
  /** Mô tả ảnh tiếng Việt cho a11y. */
  imageAlt?: string;
  /** Tên sản phẩm. Clamp 2 dòng (40px). */
  title: string;
  /** Giá bán hiện tại — server là source of truth (rule §7). */
  price: number;
  /** Giá gốc trước khi giảm (optional). */
  originalPrice?: number | undefined;
  /** % giảm (vd: 25 = -25%). Optional — nếu không truyền sẽ tự tính. */
  discountPercent?: number;
  /** Điểm đánh giá (0–5). */
  rating?: number;
  /** Số lượt đã bán. */
  soldCount?: number;
  /** Tỉnh/thành phố hiển thị dưới rating. */
  location?: string;
  /** Callback click vào card (rule §10 — card là button/a). */
  onClick?: () => void;
  /** Callback khi click "Thêm vào giỏ" (slide-up bar trong hover state). */
  onAddToCart?: () => void;
  /** Callback toggle yêu thích. */
  onToggleWishlist?: () => void;
  /** Custom class cho wrapper ngoài. */
  className?: string;
}

export interface ProductCardFlashSaleProps extends ProductCardBaseProps {
  /** % tồn kho đã bán (0–100). */
  soldPercent: number;
  /** Số lượng còn lại. */
  stockLeft: number;
  /** Giới hạn mua / khách (vd: 2). */
  purchaseLimit: number;
  /** Callback khi click "Mua ngay". */
  onBuy?: () => void;
}

export interface ProductCardUpcomingProps extends ProductCardBaseProps {
  /** Giờ bắt đầu (vd: "15:00"). */
  startsAt: string;
  /** Callback khi click "Nhắc tôi". */
  onRemind?: () => void;
}

export interface ProductCardMobileProps {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  price: number;
  rating?: number;
  soldCount?: number;
  voucherLabel?: string;
  className?: string;
}

export interface ProductCardMobileHorizontalProps {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  price: number;
  originalPrice?: number;
  soldPercent: number;
  onBuy?: () => void;
  className?: string;
}

export interface ProductCardMiniProps {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  price: number;
  className?: string;
}

export interface ProductCardProps extends ProductCardBaseProps {
  variant: ProductCardVariant;
  // Flash sale fields (optional, dùng khi variant = flashSale | almostSoldOut)
  soldPercent?: number;
  stockLeft?: number;
  purchaseLimit?: number;
  onBuy?: () => void;
  // Upcoming fields
  startsAt?: string;
  onRemind?: () => void;
  // Voucher
  voucherLabel?: string;
  // Wishlist (cho hover state)
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  // Misc slot cho nhét custom content
  children?: ReactNode;
}
