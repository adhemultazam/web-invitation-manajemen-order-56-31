
import { Addon, Vendor, WorkStatus } from "@/types/types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  // Updated format to be dd/mm/yyyy
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).replace(/-/g, '/');
  } catch (error) {
    return dateString;
  }
};

export const isPastDate = (dateString: string) => {
  const eventDate = new Date(dateString);
  const today = new Date();
  return eventDate < today;
};

export const getVendorColorStyle = (vendor: string, vendorColors: Record<string, string>) => {
  const color = vendorColors[vendor] || '#6366f1';
  return {
    backgroundColor: color,
    color: '#fff'
  };
};

export const getAddonStyle = (addonName: string, addonStyles: Record<string, {color: string}>) => {
  const addonStyle = addonStyles[addonName];
  return {
    backgroundColor: addonStyle?.color || "#6366f1",
    color: '#fff'
  };
};

export const loadVendorsFromStorage = (): Vendor[] => {
  try {
    const storedVendors = localStorage.getItem('vendors');
    if (storedVendors) {
      return JSON.parse(storedVendors);
    }
  } catch (e) {
    console.error("Error parsing vendors:", e);
  }
  return [];
};

export const loadAddonsFromStorage = (): Addon[] => {
  try {
    const storedAddons = localStorage.getItem('addons');
    if (storedAddons) {
      return JSON.parse(storedAddons);
    }
  } catch (e) {
    console.error("Error parsing addons:", e);
  }
  return [];
};

export const loadWorkStatusesFromStorage = (): WorkStatus[] => {
  try {
    const storedWorkStatuses = localStorage.getItem('workStatuses');
    if (storedWorkStatuses) {
      return JSON.parse(storedWorkStatuses);
    }
  } catch (e) {
    console.error("Error parsing work statuses:", e);
  }
  
  // Default work statuses if none are stored
  const defaultWorkStatuses: WorkStatus[] = [
    { id: "1", name: "Selesai", color: "#22c55e" },
    { id: "2", name: "Progress", color: "#3b82f6" },
    { id: "3", name: "Review", color: "#f59e0b" },
    { id: "4", name: "Revisi", color: "#f97316" },
    { id: "5", name: "Data Belum", color: "#ef4444" }
  ];
  
  return defaultWorkStatuses;
};

export const getPaymentStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'lunas':
      return 'bg-green-500';
    case 'pending':
      return 'bg-amber-500';
    default:
      return 'bg-red-500';
  }
};
