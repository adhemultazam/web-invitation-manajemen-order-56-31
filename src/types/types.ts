
export type PaymentStatus = "Lunas" | "Pending";

export interface Order {
  id: string;
  customerName: string;
  clientName: string;
  clientUrl: string;
  orderDate: string;
  eventDate: string;
  countdownDays: number;
  vendor: string;
  vendorId?: string; // Optional vendorId to directly link to vendors
  package: string;
  theme: string;
  addons: string[];
  bonuses?: string[];
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  workStatus: string;
  postPermission: boolean;
  notes?: string;
}

export interface WorkStatus {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface Theme {
  id: string;
  name: string;
  thumbnail: string;
  category?: string;
  price?: number;
  backgroundColor?: string;
  description?: string;
}

export interface Addon {
  id: string;
  name: string;
  color: string;
  price?: number;
  description?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

export interface ChartData {
  name: string;
  value: number;
}

export type ChartDataArray = ChartData[];

export interface Vendor {
  id: string;
  name: string;
  code: string;
  color?: string;
  contact?: string;
  email?: string;
  address?: string;
  commission?: number;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
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
  paidDate?: string;
  notes?: string;
}

export interface InvoiceFilter {
  vendor: string | undefined;
  status: "Paid" | "Unpaid" | "All";
  sortBy: "dueDate" | "amount";
  sortDirection: "asc" | "desc";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface InvoiceSettings {
  logoUrl: string;
  brandName: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  bankAccounts: BankAccount[];
  invoiceFooter: string;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}
