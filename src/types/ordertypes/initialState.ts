import { User } from "../authState/initialState";
import { IProductFrontend } from "../productState/product.type";

export interface orderState {
  isLoading: boolean;
  orderinfo: IOrder | null;
  Myorders: IOrder[];
  pagination: paginationInfo | null;
  ordersPagination: paginationInfo | null;
  orders: IOrder[];
  singleOrder: IOrder | null;
}
export interface paginationInfo {
  totalOrders: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}
export interface selectProductsForOrder {
  productId: string;
  variantId: string;
  quantity: number;
  priceAtPurchase: number;
  discount: number;
  size: string;
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
export interface RefundOrders {
  productId: string;
  variantId: string;
  quantity: number;
  size: string;
  priceAtPurchase: number;
  discount: number;
  discountByCoupon: number;
}
export interface ReplacementFormData {
  orderId: string;
  replaceItems: orderproduct[];
  reason: string;
}
export interface ProcessReplcementData {
  orderId: string;
  replacementItems: orderproduct[];
  status: string;
}
export interface orderproduct {
  productId: string;
  variantId: string;
  quantity: number;
  size: string;
  priceAtPurchase: number;
  discount: number;
  discountByCoupon: number;
  isReplaceable: boolean;
  isReturnable: boolean;
  refund?: {
    requested: boolean;
    amount: number;
    status: "pending" | "completed" | "failed";
    requestDate?: Date;
    completionDate?: Date;
  };
  replacement?: {
    requested: boolean;
    reason?: string;
    status?: "pending" | "approved" | "rejected";
    requestDate?: Date;
    responseDate?: Date;
  };
}
export interface OrderProductWithProduct {
  productId: IProductFrontend;
  variantId: string;
  quantity: number;
  size: string;
  priceAtPurchase: number;
  discount: number;
  discountByCoupon: number;
  isReplaceable: boolean;
  isReturnable: boolean;
  refund?: {
    requested: boolean;
    amount: number;
    status: "pending" | "completed" | "failed";
    requestDate?: Date;
    completionDate?: Date;
  };
  replacement?: {
    requested: boolean;
    reason?: string;
    status?: "pending" | "approved" | "rejected";
    requestDate?: Date;
    responseDate?: Date;
  };
}
export interface IOrder {
  _id: string;
  user: string | User;
  products: OrderProductWithProduct[];
  totalAmount: number;
  discountAmount?: number;
  couponCode?: string;
  taxAmount?: number;
  finalAmount: number;
  deliveryType: "standard" | "express";
  deliveryCharge?: number;
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
  payment: {
    paymentId: string; // Payment provider ID (e.g., Razorpay, Stripe)
    provider: string; // Payment provider (e.g., Razorpay, Stripe, PayPal)
    paymentMethod: string; // Payment method (e.g., card, UPI, bank transfer)
    paymentStatus: "pending" | "completed" | "failed" | "refunded";
    paymentDate?: Date; // Date of successful payment
  };
  cancellationDate: Date;
  cancelReason: string;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
  replacementRequest?: {
    productId: string;
    variantId: string;
    quantity: number;
    requested: boolean;
    reason?: string;
    status?: "pending" | "approved" | "rejected";
    requestDate?: Date;
    responseDate?: Date;
  }[];
  refund?: {
    requested: boolean;
    amount: number;
    status: "pending" | "completed" | "failed";
    requestDate?: Date;
    completionDate?: Date;
  };
  auditLog: {
    action: string;
    actor: string;
    timestamp: Date;
    description?: string;
  }[];

  loyaltyPointsUsed?: number;
  isGiftOrder?: boolean;
  giftMessage?: string;
}
export interface FilterOrderParams {
  orderStatus?: string[];
  productId?: string;
  variantId?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
  couponCode?: string;
  isGiftOrder?: boolean;
  city?: string;
  country?: string;
  minTotalAmount?: number;
  maxTotalAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}
export interface OrderQueryParams {
  deliveryType?: string;
  orderStatus?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  productId?: string;
  page: number;
  limit?: number;
  searchTerm?: string;
}
export interface updateStatus {
  orderId: string;
  status: string;
  cancelReason?: string;
}
