
// Data types for the wedding digital order management system

export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];

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
}

export interface WorkStatus {
  id: string;
  name: string;
  color: string;
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
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendor: string;
  dateIssued: string;
  dueDate: string;
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
