import {
  IProductFrontend,
  IProductVariantFrontend,
} from "../productState/product.type";

export interface authState {
  isLoading: boolean;
  userInfo: User | null;
  carts:CartItem[];
}

interface Preferences {
  style: string;
  favoriteColors: string[];
  preferredMaterials: string[];
}
export interface cart {
  productId: IProductFrontend;
  quantity: number;
  variantId: IProductVariantFrontend;
  _id: string;
}
interface User {
  preferences: Preferences;
  _id: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpiry: string;
  Role: string;
  wishlist: any[]; // You can specify the type if wishlist has a structure
  loyaltyPoints: number;
  browsingHistory: any[]; // Specify type if needed
  tryOnHistory: any[]; // Specify type if needed
  cart: cart[]; // Specify type if needed
  orderHistory: any[]; // Specify type if needed
  paymentMethods: any[]; // Specify type if needed
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface Discount {
  discountPercentage: number;
  validFrom: string; // ISO date string
  validUntil: string; // ISO date string
  _id: string;
}

interface ReturnPolicy {
  eligible: boolean;
  refundDays: number;
  terms: string;
  _id: string;
}

interface ReplacementPolicy {
  eligible: boolean;
  replacementDays: number;
  terms: string;
  validReason: any[]; // Adjust the type as necessary
  _id: string;
}

interface CartItem {
  title: string;
  quantity: number;
  price: number;
  image: string;
  discount: Discount;
  returnPolicy: ReturnPolicy;
  replacementPolicy: ReplacementPolicy;
  loyaltyPoints: number;
}


