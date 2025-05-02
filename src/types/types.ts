
export interface Order {
  id: string;
  orderDate: string;
  eventDate: string;
  countdownDays: number;
  customerName: string;
  clientName: string;
  vendor: string;
  package: string;
  addons: string[];
  bonuses: string[];
  theme: string;
  paymentStatus: 'Lunas' | 'Pending' | 'Belum Bayar';
  paymentAmount: number;
  workStatus: string;
  postPermission: boolean;
  notes: string;
  clientUrl?: string; // Added clientUrl property as optional
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  commission: number;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

export interface WorkStatus {
  id: string;
  name: string;
  color: string;
}

export interface FilterOptions {
  year: string;
  month: string;
}

export type ChartData = {
  name: string;
  value: number;
}[];

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  dateIssued: string;
  dueDate: string;
  orders: InvoiceOrder[];
  status: 'Paid' | 'Unpaid';
  totalAmount: number;
}

export interface InvoiceOrder {
  orderId: string;
  clientName: string;
  orderDate: string;
  amount: number;
}

export interface InvoiceFilter {
  vendor?: string;
  status?: 'Paid' | 'Unpaid' | 'All';
  sortBy?: 'dueDate' | 'amount';
  sortDirection?: 'asc' | 'desc';
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

// Authentication types
export interface User {
  username: string;
  name: string;
  role: 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
