
import { Transaction } from "@/types/types";
import { indonesianMonths } from "./monthUtils";

// Get filter description for stat cards
export const getFilterDescription = (selectedYear: string, selectedMonth: string): string => {
  if (selectedYear === "Semua Data" && selectedMonth === "Semua Data") {
    return "Semua Data";
  } else if (selectedMonth === "Semua Data") {
    return `Tahun ${selectedYear}`;
  } else if (selectedYear === "Semua Data") {
    return `Bulan ${selectedMonth}`;
  } else {
    return `${selectedMonth} ${selectedYear}`;
  }
};

// Get previous month description
export const getPreviousMonthDescription = (selectedMonth: string, selectedYear: string): string => {
  if (selectedMonth === "Semua Data" || selectedYear === "Semua Data") {
    return "bulan sebelumnya";
  }
  
  const monthNames = indonesianMonths.map(m => m.charAt(0).toUpperCase() + m.slice(1));
  const currentMonthIndex = monthNames.findIndex(m => m.toLowerCase() === selectedMonth.toLowerCase());
  
  if (currentMonthIndex === -1) return "bulan sebelumnya";
  
  let prevMonthIndex = currentMonthIndex - 1;
  let prevYear = selectedYear;
  
  if (prevMonthIndex < 0) {
    prevMonthIndex = 11; // December
    prevYear = (parseInt(selectedYear) - 1).toString();
  }
  
  const prevMonth = monthNames[prevMonthIndex];
  return `${prevMonth} ${prevYear}`;
};

// Calculate fixed expense status
export const calculateFixedExpenseStatus = (transactions: Transaction[]) => {
  const fixedExpenses = transactions.filter(t => t.type === "fixed");
  const paidCount = fixedExpenses.filter(t => t.isPaid).length;
  return {
    paid: paidCount,
    total: fixedExpenses.length,
    percent: fixedExpenses.length > 0 ? (paidCount / fixedExpenses.length) * 100 : 0
  };
};
