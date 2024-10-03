export interface deliveryState {
  isLoading: boolean;
  mydeliveries: OrderData;
  WeeklyData: WeeklyData;
  weeklyDataLoading: boolean;
  deliveryPerformanceData: DeliveryPerformanceData | null;
}
export interface DeliveryPerformanceData {
  totalDeliveries: number;
  onTimeDeliveries: number;
  onTimePercentage: number;
  lastWeekPercentage: number;
  performanceDifference: string;
  message: string;
}
interface Address {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  type: string;
}

interface Payment {
  paymentId: string;
  provider: string;
  paymentMethod: string;
  paymentStatus: string;
}

interface Refund {
  requested: boolean;
  status: string;
}

interface Replacement {
  requested: boolean;
}

interface Product {
  refund: Refund;
  replacement: Replacement;
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  priceAtPurchase: number;
  discount: number;
  discountByCoupon: number;
  isReplaceable: boolean;
  isReturnable: boolean;
  _id: string;
}

interface AuditLog {
  action: string;
  actor: string;
  timestamp: string;
  description: string;
  _id: string;
}

interface PendingOrder {
  _id: string;
  user: string;
  address: Address;
  payment: Payment;
  products: Product[];
  totalAmount: number;
  discountAmount: number;
  couponCode: string;
  taxAmount: number;
  finalAmount: number;
  deliveryType: string;
  deliveryCharge: number;
  orderStatus: string;
  auditLog: AuditLog[];
  loyaltyPointsUsed: number;
  isGiftOrder: boolean;
  giftMessage: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DeliveryCounts {
  completed: number;
  pending: number;
}

interface OrderData {
  deliveryCounts: DeliveryCounts;
  pendingOrders: PendingOrder[];
}

interface WeeklyData {
  labels: string[]; // Array of strings representing the days of the week
  datasets: Dataset[]; // Array of datasets, where each dataset has its own properties
}

interface Dataset {
  label: string; // Label for the dataset
  data: number[]; // Array of numbers representing the delivery counts for each day
  backgroundColor: string; // Background color for the dataset
  borderColor: string; // Border color for the dataset
  borderWidth: number; // Border width for the dataset
}
