export interface orderState {
  isLoading: boolean;
}
export interface selectProductsForOrder {
  productId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
  discount: number;
  size:string;
}

export interface orderDataType {
  products: {
    productId: string;
    variantId: string;
    quantity: number;
    priceAtPurchase: number;
    discount: Number;
  }[];
  address: {
    name: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    type: "Home" | "University" | "Work" | "Hotel";
  };
  couponCode: string;
  loyaltyPointsUsed: number;
  isGiftOrder: boolean;
  giftMessage: string;
  deliveryType: string;
}
