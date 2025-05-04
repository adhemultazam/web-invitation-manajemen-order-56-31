
import { Vendor } from "@/types/types";

// Initial vendor data
export const initialVendors: Vendor[] = [
  {
    id: "1",
    name: "Vendor Utama",
    code: "MAIN",
    commission: 10,
    color: "#6366f1" // Default color - indigo
  },
  {
    id: "2",
    name: "Reseller Premium",
    code: "PREM",
    commission: 15,
    color: "#3b82f6" // Default color - blue
  }
];

// Load vendors from localStorage
export const loadVendors = (): Vendor[] => {
  try {
    const storedVendors = localStorage.getItem('vendors');
    if (storedVendors) {
      return JSON.parse(storedVendors);
    }
  } catch (e) {
    console.error("Error parsing vendors:", e);
  }
  return initialVendors;
};

// Save vendors to localStorage
export const saveVendors = (vendors: Vendor[]): void => {
  localStorage.setItem('vendors', JSON.stringify(vendors));
};
