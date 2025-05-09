
import { Transaction } from "@/types/types";

// Get the storage key based on year and month
export const getTransactionStorageKey = (year: string, month: string): string => {
  if (year === "Semua Data" && month === "Semua Data") {
    return "transactions_all";
  }
  if (year === "Semua Data") {
    return `transactions_${month.toLowerCase()}`;
  }
  if (month === "Semua Data") {
    return `transactions_${year}`;
  }
  return `transactions_${year}_${month.toLowerCase()}`;
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[], year: string, month: string): void => {
  try {
    const storageKey = getTransactionStorageKey(year, month);
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions:", error);
  }
};

// Load transactions from localStorage
export const loadTransactions = (year: string, month: string): Transaction[] => {
  try {
    const storageKey = getTransactionStorageKey(year, month);
    const storedTransactions = localStorage.getItem(storageKey);
    
    if (storedTransactions) {
      return JSON.parse(storedTransactions);
    }
  } catch (error) {
    console.error("Error loading transactions:", error);
  }
  return [];
};

// Ensure amount values are proper numbers
export const normalizeTransactionAmounts = (transaction: Transaction): Transaction => {
  const normalized = { ...transaction };
  
  // Ensure amount is a number
  normalized.amount = typeof transaction.amount === 'string' 
    ? parseFloat(String(transaction.amount).replace(/\./g, "")) 
    : transaction.amount;
  
  // If it's a fixed expense with budget, ensure budget is also a number
  if (transaction.type === 'fixed' && transaction.budget) {
    normalized.budget = typeof transaction.budget === 'string'
      ? parseFloat(String(transaction.budget).replace(/\./g, ""))
      : transaction.budget;
  }
  
  return normalized;
};
