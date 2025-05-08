
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

// Indonesian months for various uses throughout the app
export const monthsInIndonesian = [
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember"
];
