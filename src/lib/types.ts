export type MemberStatus = "active" | "expired";
export type PlanType = "monthly" | "quarterly" | "six_months" | "yearly";
export type PaymentMethod = "cash" | "card" | "transfer" | "other";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
}

export interface Member {
  id: string;
  name: string;
  phone: string | null;
  photo_url: string | null;
  subscription_start: string | null;
  subscription_end: string | null;
  status: MemberStatus;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  member_id: string;
  plan_type: PlanType;
  start_date: string;
  end_date: string;
  status: MemberStatus;
  amount: number;
  created_at: string;
  member?: Member;
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  method: PaymentMethod;
  notes: string | null;
  created_at: string;
  member?: Member;
}

export interface Attendance {
  id: string;
  member_id: string;
  check_in: string;
  created_at: string;
  member?: Member;
}

export interface DashboardStats {
  totalMembers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  monthlyRevenue: number;
  totalProducts?: number;
  pendingOrders?: number;
  shopRevenue?: number;
}

export type PaymentUrgency = "expired" | "warning" | "active";

export interface LatePaymentItem {
  member: Member;
  subscription_id: string | null;
  subscription_start: string | null;
  end_date: string;
  days_remaining: number;
  urgency: PaymentUrgency;
  status_label: string;
  amount: number;
  plan_type: PlanType | null;
  total_days?: number | null;
  days_elapsed?: number | null;
  subscription_progress?: number | null;
}

export interface LatePaymentsResponse {
  items: LatePaymentItem[];
  summary: {
    expiredCount: number;
    expiringSoonCount: number;
    revenueLost: number;
  };
}

export type ProductCategory =
  | "protein"
  | "creatine"
  | "pre-workout"
  | "mass-gainer"
  | "vitamins"
  | "accessories";

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: ProductCategory;
  featured: boolean;
  best_seller: boolean;
  stock: number;
  rating?: number;
  reviews?: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  status: OrderStatus;
  total: number;
  payment_method: "cod";
  notes: string | null;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}
