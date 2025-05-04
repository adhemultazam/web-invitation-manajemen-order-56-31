
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const monthsInIndonesian = [
  "januari",
  "februari",
  "maret",
  "april",
  "mei",
  "juni",
  "juli",
  "agustus",
  "september",
  "oktober",
  "november",
  "desember",
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch (e) {
    console.error("Invalid date format:", dateString);
    return dateString;
  }
};

export const getMonthName = (monthIndex: number): string => {
  if (monthIndex >= 0 && monthIndex < monthsInIndonesian.length) {
    return monthsInIndonesian[monthIndex];
  }
  return "";
};

export const getMonthIndex = (monthName: string): number => {
  return monthsInIndonesian.findIndex(
    (month) => month.toLowerCase() === monthName.toLowerCase()
  );
};
