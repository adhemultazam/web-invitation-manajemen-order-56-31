
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
