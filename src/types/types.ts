
// Define types for the wedding application

// Vendor type
export interface Vendor {
  id: string;
  name: string;
  code?: string;
  color?: string;
  contactPerson?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  commission?: number; // Adding the missing commission property
}

// WorkStatus type
export interface WorkStatus {
  id: string;
  name: string;
  color: string;
  description?: string;
}

// Theme type
export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  price?: number; // Adding missing price property
  backgroundColor?: string; // Adding missing backgroundColor property
  description?: string; // Adding missing description property
}

// Package type
export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string; // Adding missing description property
  features?: string[];
}

// Addon type
export interface Addon {
  id: string;
  name: string;
  price?: number;
  color?: string;
  description?: string;
}

// Order type
export interface Order {
  id: string;
  customerName: string;
  clientName: string;
  clientUrl?: string;
  orderDate: string;
  eventDate: string;
  countdownDays: number;
  vendor: string;
  package: string;
  theme: string;
  addons: string[];
  bonuses?: string[];
  paymentStatus: "Lunas" | "Pending";
  paymentAmount: number;
  workStatus: string;
  postPermission: boolean;
  notes?: string;
  deleted?: boolean; // Added the deleted property as optional
}

// Chart data types
export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];

// Bank Account type for invoice settings
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

// Invoice Order item
export interface InvoiceOrderItem {
  orderId: string;
  clientName: string;
  orderDate: string;
  amount: number;
}

// Invoice type
export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor?: string;
  dateIssued: string;
  dueDate: string;
  orders: InvoiceOrderItem[];
  totalAmount: number;
  status: "Paid" | "Unpaid";
  paidDate?: string;
  notes?: string;
}

// Invoice Filter type
export interface InvoiceFilter {
  vendor: string | undefined;
  status: "Paid" | "Unpaid" | "All";
  sortBy: "dueDate" | "amount";
  sortDirection: "asc" | "desc";
}

// Invoice Settings type
export interface InvoiceSettings {
  logoUrl?: string;
  brandName?: string;
  businessAddress?: string;
  contactEmail?: string;
  contactPhone?: string;
  bankAccounts?: BankAccount[];
  invoiceFooter?: string;
}

// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}
