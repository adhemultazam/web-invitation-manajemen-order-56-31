
// Order Type
export interface Order {
  id: string;
  clientName: string;
  customerName: string;
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
}

// Vendor Type
export interface Vendor {
  id: string;
  name: string;
  code: string;
  color: string;
  commission?: number; // Added commission property
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  address?: string;
  notes?: string;
}

// Work Status Type
export interface WorkStatus {
  id: string;
  name: string;
  color: string;
  order: number; // This property was already defined but missing in implementations
}

// Addon Type
export interface Addon {
  id: string;
  name: string;
  color: string;
  price?: number;
  description?: string;
}

// Theme Type
export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
  price?: number; // Added price property
  description?: string; // Added description property
}

// Package Type
export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: string[];
}

// Invoice Type
export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor: string;
  dateIssued: string;
  dateDue: string;
  dueDate?: string; // Added dueDate property
  orders: {
    orderId: string;
    clientName: string;
    orderDate: string;
    amount: number;
  }[];
  totalAmount: number;
  status: "Paid" | "Unpaid";
  notes?: string;
}

// Invoice Filter Type
export interface InvoiceFilter {
  vendor?: string;
  status: 'Paid' | 'Unpaid' | 'All';
  sortBy: 'dueDate' | 'amount';
  sortDirection: 'asc' | 'desc';
}

// Bank Account Type
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];
