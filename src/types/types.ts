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
};

// WorkStatus type
export type WorkStatus = {
  id: string;
  name: string;
  color: string;
  order?: number;
};

// Package type
export type Package = {
  id: string;
  name: string;
  price?: number | string;
  themes?: string[];
};

// Addon type
export type Addon = {
  id: string;
  name: string;
  color: string;
};

// Theme type
export type Theme = {
  id: string;
  name: string;
  thumbnail?: string;
  category?: string;
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
}
