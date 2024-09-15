export interface authState {
  isLoading: boolean;
  userInfo: User | null;
}

interface Preferences {
  style: string;
  favoriteColors: string[];
  preferredMaterials: string[];
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
  cart: any[]; // Specify type if needed
  orderHistory: any[]; // Specify type if needed
  paymentMethods: any[]; // Specify type if needed
  createdAt: string;
  updatedAt: string;
  __v: number;
}
