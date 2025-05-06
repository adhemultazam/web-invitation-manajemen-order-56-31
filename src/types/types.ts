
// Data types for the wedding digital order management system

export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];

export interface MultiBarChartData {
  name: string;
  paid?: number;
  pending?: number;
  [key: string]: any;
}

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

export interface Vendor {
  id: string;
  name: string;
  code: string;
  color: string;
  commission: number; // Added commission property
}

export interface WorkStatus {
  id: string;
  name: string;
  color: string;
  order: number; // Added order property
}

export interface Addon {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  price?: number; // Added price as optional
  description?: string; // Added description as optional
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  features: string[]; // Added features array
  themes?: string[]; // Added themes array to fix type errors
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor: string;
  dateIssued: string;
  dueDate: string;
  dateDue: string; // Added dateDue property
  totalAmount: number;
  status: "Paid" | "Unpaid";
  orders: {
    orderId: string;
    clientName: string;
    orderDate: string;
    amount: number;
  }[];
}

export interface InvoiceFilter {
  vendor?: string;
  status: "Paid" | "Unpaid" | "All";
  sortBy: "dueDate" | "amount";
  sortDirection: "asc" | "desc";
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}
