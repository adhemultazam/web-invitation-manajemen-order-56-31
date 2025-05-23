// Extending the existing types file by adding any missing types

// Order type
export type Order = {
  id: string;
  clientName: string;
  customerName?: string;
  clientPhone?: string;
  clientEmail?: string;
  clientUrl?: string;
  eventName?: string;
  brideAndGroom?: string;
  eventDate: string;
  orderDate: string;
  package: string;
  theme: string;
  workStatus: string;
  vendor: string;
  addons: string[];
  bonuses?: string[];
  paymentAmount: number | string;
  paymentStatus: "Lunas" | "Pending";
  countdownDays?: number;
  postPermission?: boolean;
  notes?: string;
  // Add these fields needed for invoices
  orderId?: string; // For compatibility with invoice references
  amount?: number;  // For invoice amount calculations
  month?: string;   // For organizing orders by month
  user_id?: string; // For identifying the user who owns this order
};

// Add OrderFormData type for use in OrderForm component
export type OrderFormData = Omit<Order, "id">;

// Chart data types
export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];

export interface MultiBarChartData {
  name: string;
  [key: string]: string | number;
}

// Vendor type
export type Vendor = {
  id: string;
  name: string;
  code: string;
  color: string;
  landingPageUrl?: string;
  user_id?: string; // Add user_id for Supabase relationship
};

// WorkStatus type
export type WorkStatus = {
  id: string;
  name: string;
  color: string;
  order?: number;
  user_id?: string; // Add user_id for Supabase relationship
};

// Package type
export type Package = {
  id: string;
  name: string;
  price?: number | string;
  themes?: string[];
  user_id?: string; // Add user_id for Supabase relationship
};

// Addon type
export type Addon = {
  id: string;
  name: string;
  color: string;
  user_id?: string; // Add user_id for Supabase relationship
};

// Theme type
export type Theme = {
  id: string;
  name: string;
  thumbnail?: string;
  category?: string;
  user_id?: string; // Add user_id for Supabase relationship
};

// Invoice type
export interface Invoice {
  id: string;
  vendor: string;
  vendorId: string;
  invoiceNumber: string;
  dateIssued: string;
  dueDate: string;
  orders: Order[];
  totalAmount: number;
  status: "Paid" | "Unpaid";
  user_id?: string; // Add user_id for Supabase relationship
}

// Add InvoiceItem type definition
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  orderId?: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
  user_id?: string; // Add user_id for Supabase relationship
}

// Bank account type for invoice settings
export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
};

// InvoiceFilter type
export interface InvoiceFilter {
  vendor?: string;
  status: 'Paid' | 'Unpaid' | 'All';
  sortBy: 'dueDate' | 'amount';
  sortDirection: 'asc' | 'desc';
}

// User type
export type User = {
  name: string;
  email?: string;
  profileImage?: string; // Added missing property
};

// Transaction type
export interface Transaction {
  id: string;
  date: string;
  type: "fixed" | "variable";
  description: string;
  amount: number;
  category?: string;  // Added for custom categories
  isPaid?: boolean;   // Added for payment status
  budget?: number;    // Added for budget tracking
  year?: string; // Added for Supabase filtering
  month?: string; // Added for Supabase filtering
  user_id?: string; // Add user_id for Supabase relationship
}

// TransactionCategory type for managing expense categories
export interface TransactionCategory {
  id: string;
  name: string;
  type: "fixed" | "variable";
  defaultBudget?: number;
  description?: string;
  isActive: boolean;
}

// UserSetting type for managing user preferences in Supabase
export interface UserSetting {
  id: string;
  user_id: string;
  key: string;
  value: any;
  created_at?: string;
  updated_at?: string;
}
