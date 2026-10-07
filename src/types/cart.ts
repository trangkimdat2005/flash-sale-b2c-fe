export interface CartItemResponse {
  id: number;
  variantId: number;
  sku: string;
  productName: string;
  variantName: string;
  imageUrl: string | null;
  price: string;
  stockQuantity: number;
  quantity: number;
  itemSubtotal: string;
  storeId: number;
  storeName: string;
}

export interface CartStoreGroup {
  storeId: number;
  storeName: string;
  items: CartItemResponse[];
  storeSubtotal: string;
}

export interface CartResponse {
  id: number;
  userId: number;
  storeGroups: CartStoreGroup[];
  totalItems: number;
  grandTotal: string;
}

export interface AddToCartRequest {
  variantId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}