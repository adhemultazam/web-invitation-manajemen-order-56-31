
import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

export function useTransactionsData(year: string, month: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Get the storage key based on year and month
  const getStorageKey = (): string => {
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
  
  // Load transactions from localStorage
  useEffect(() => {
    try {
      const storageKey = getStorageKey();
      const storedTransactions = localStorage.getItem(storageKey);
      
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
    }
  }, [year, month]);
  
  // Save transactions to localStorage
  const saveTransactions = (transactions: Transaction[]) => {
    try {
      const storageKey = getStorageKey();
      localStorage.setItem(storageKey, JSON.stringify(transactions));
    } catch (error) {
      console.error("Error saving transactions:", error);
    }
  };
  
  // Add a new transaction
  const addTransaction = (transaction: Transaction) => {
    // Ensure amount is a number before saving
    const newTransaction = {
      ...transaction,
      amount: typeof transaction.amount === 'string' 
        ? parseFloat(String(transaction.amount).replace(/\./g, "")) 
        : transaction.amount
    };
    
    const newTransactions = [...transactions, newTransaction];
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };
  
  // Update a transaction
  const updateTransaction = (updatedTransaction: Transaction) => {
    // Ensure amount is a number before saving
    const transaction = {
      ...updatedTransaction,
      amount: typeof updatedTransaction.amount === 'string' 
        ? parseFloat(String(updatedTransaction.amount).replace(/\./g, ""))
        : updatedTransaction.amount
    };
    
    const newTransactions = transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };
  
  // Delete a transaction
  const deleteTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };
  
  // Calculate totals for fixed and variable expenses
  const totalFixedExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === "fixed")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  const totalVariableExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === "variable")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalFixedExpenses,
    totalVariableExpenses
  };
}
