
// Types for the wedding digital order management system
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
  addons?: string[];
  bonuses?: string[];
  paymentStatus: "Lunas" | "Pending";
  paymentAmount: number;
  workStatus: string;
  postPermission: boolean;
  notes?: string;
}

export interface Theme {
  id: string;
  name: string;
  thumbnail?: string;
  category?: string;
  price?: number;
  description?: string;
}

export interface Addon {
  id: string;
  name: string;
  price?: number; // Made optional since there are addons without price
  color?: string;
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  color: string;
  commission?: number; // Added commission property
}

export interface WorkStatus {
  id: string;
  name: string;
  color: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: string[]; // Added features property
}

export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendor: string;
  vendorId: string;
  dateIssued: string;
  dueDate: string;
  status: "Paid" | "Unpaid";
  totalAmount: number;
  orders: {
    orderId: string;
    clientName: string;
    orderDate: string;
    amount: number;
  }[];
  notes?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

export interface InvoiceFilter {
  vendor: string | undefined;
  status: 'Paid' | 'Unpaid' | 'All';
  sortBy: 'dueDate' | 'amount';
  sortDirection: 'asc' | 'desc';
}
