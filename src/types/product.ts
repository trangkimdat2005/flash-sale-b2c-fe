export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  commissionRate: number;
  description: string | null;
}

export interface StoreResponse {
  id: number;
  userId: number;
  storeName: string;
  logoUrl: string | null;
  description: string | null;
  defaultCommissionRate: number;
  status: "PENDING" | "APPROVED" | "BANNED";
  createdAt: string;
}

export interface TierVariationConfig {
  name: string;
  options: string[];
}

export interface ProductVariantResponse {
  id: number;
  productId: number;
  sku: string;
  variantName: string;
  attributes: Record<string, string> | null;
  originalPrice: string;
  stockQuantity: number;
  imageUrl: string | null;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  version?: number;
  createdAt: string;
}

export interface ProductSummaryResponse {
  id: number;
  storeId: number;
  storeName: string;
  categoryId: number;
  categoryName: string;
  name: string;
  imageUrl: string | null;
  minPrice: string;
  maxPrice: string;
  totalStock: number;
  status: string;
  createdAt: string;
}

export interface ProductDetailResponse extends ProductSummaryResponse {
  description: string | null;
  tierVariationConfigs: TierVariationConfig[] | null;
  variants: ProductVariantResponse[];
}

export interface ProductFilterRequest {
  categoryId?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: unknown;
}