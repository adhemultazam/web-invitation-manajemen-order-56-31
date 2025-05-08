
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

// Chart data types
export type ChartData = {
  name: string;
  value: number;
};

export type ChartDataArray = ChartData[];

export type MultiBarChartData = {
  name: string;
  [key: string]: string | number;
};

// Vendor type
export type Vendor = {
  id: string;
  name: string;
  code?: string;
  color?: string;
  commission?: number; // Added missing field
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
export type Invoice = {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor: string; // Vendor name, kept for backwards compatibility
  dateIssued: string;
  dueDate: string;
  status: "Paid" | "Unpaid";
  totalAmount: number;
  orders: {
    orderId: string;
    clientName: string;
    orderDate: string;
    amount: number;
    package?: string;
    addons?: string[] | string; // Supporting both array and string formats
  }[];
};

// Bank account type for invoice settings
export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
};

// InvoiceFilter type
export type InvoiceFilter = {
  vendor?: string;
  status: "Paid" | "Unpaid" | "All";
  sortBy: "dueDate" | "amount";
  sortDirection: "asc" | "desc";
};

// User type
export type User = {
  name: string;
  email?: string;
  profileImage?: string; // Added missing property
};

