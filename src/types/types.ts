
// Extending the existing types file by adding any missing types

// Order type
export type Order = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  eventName: string;
  brideAndGroom: string;
  eventDate: string;
  orderDate: string;
  package: string;
  theme: string;
  workStatus: string;
  vendor: string;
  addons: string[];
  paymentAmount: number | string;
  paymentStatus: "Lunas" | "Pending";
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
};

// WorkStatus type
export type WorkStatus = {
  id: string;
  name: string;
};

// Package type
export type Package = {
  id: string;
  name: string;
};

// Addon type
export type Addon = {
  id: string;
  name: string;
  color: string;
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
  logo?: string;
  companyName?: string;
  email?: string;
};
