export interface orderState {
  isLoading: boolean;
}
export interface selectProductsForOrder {
  productId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
  discount: number;
}
