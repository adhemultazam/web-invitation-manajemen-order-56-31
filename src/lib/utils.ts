
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Helper function for conditional class merging
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency to IDR
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}
