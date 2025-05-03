
export interface ChartData {
  name: string;
  value: number;
}

export interface ChartDataArray extends Array<ChartData> {}

export interface Order {
  id: string;
  orderDate: string;
  eventDate: string;
  customerName: string;
  clientName: string;
  clientUrl?: string;
  vendor: string;
  package: string;
  theme: string;
  paymentStatus: 'Lunas' | 'Pending';
  paymentAmount: number;
  workStatus: string;
  countdownDays: number;
  postPermission?: boolean;
  notes?: string;
  addons: string[];
  bonuses: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  description: string;
  features: string[];
}

export interface InvoiceFilter {
  vendor?: string;
  status: 'Paid' | 'Unpaid' | 'All';
  sortBy: 'dueDate' | 'amount';
  sortDirection: 'asc' | 'desc';
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  commission?: number;
}

export interface WorkStatus {
  id: string;
  name: string;
  color: string;
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
  vendor: string;
  vendorId: string;
  dateIssued: string;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
  totalAmount: number;
  orders: {
    orderId: string;
    orderDate: string;
    clientName: string;
    amount: number;
  }[];
}

export interface Addon {
  id: string;
  name: string;
  color: string;
}
