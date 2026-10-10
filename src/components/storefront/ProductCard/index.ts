/**
 * ProductCard – Bộ Component Thẻ Sản Phẩm – Modern Clean (Vibe Mart v2.5)
 *
 * Public API – 11+ biến thể + 1 root dispatcher theo Stitch "Bộ Component Thẻ Sản Phẩm - Biến thể 1".
 */

export {
  ProductCard,
  // 5 Storefront
  ProductCardDefault,
  ProductCardDiscount,
  ProductCardVoucher,
  ProductCardFreeship,
  ProductCardSaleVoucher,
  // 4 Flash Sale
  ProductCardFlashSale,
  ProductCardAlmostSoldOut,
  ProductCardSoldOut,
  ProductCardUpcoming,
  // States
  ProductCardSkeleton,
  ProductCardHover,
  ProductCardFocus,
  // 3 Mobile
  ProductCardMobile,
  ProductCardMobileHorizontal,
  ProductCardMini,
} from "./ProductCard";
export type {
  ProductCardProps,
  ProductCardBaseProps,
  ProductCardFlashSaleProps,
  ProductCardUpcomingProps,
  ProductCardVariant,
  ProductCardMobileProps,
  ProductCardMobileHorizontalProps,
  ProductCardMiniProps,
} from "./ProductCard.types";
