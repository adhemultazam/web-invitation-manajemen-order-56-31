import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory } from "@/types/types";
import { v4 as uuidv4 } from "uuid";

export function useTransactionsData(year: string, month: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [previousMonthBalance, setPreviousMonthBalance] = useState<number>(0);
  
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

  // Helper to get previous month's storage key
  const getPreviousMonthStorageKey = (): string => {
    if (month === "Semua Data" || year === "Semua Data") {
      return ""; // Cannot determine previous month if viewing all data
    }
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const currentMonthIndex = monthNames.findIndex(m => m === month);
    
    if (currentMonthIndex === -1) return ""; // Invalid month
    
    // Calculate previous month and year
    let prevMonthIndex = currentMonthIndex - 1;
    let prevYear = year;
    
    if (prevMonthIndex < 0) {
      prevMonthIndex = 11; // December
      prevYear = (parseInt(year) - 1).toString();
    }
    
    const prevMonth = monthNames[prevMonthIndex].toLowerCase();
    return `orders_${prevYear}_${prevMonth}`;
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

      // Load categories
      const storedCategories = localStorage.getItem("transactionCategories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
      
      // Load previous month's balance
      const prevMonthKey = getPreviousMonthStorageKey();
      if (prevMonthKey) {
        const ordersData = localStorage.getItem(prevMonthKey);
        if (ordersData) {
          const orders = JSON.parse(ordersData);
          // Calculate total from paid orders only
          const paidTotal = orders
            .filter((order: any) => order.paymentStatus === "Lunas")
            .reduce((sum: number, order: any) => {
              const amount = typeof order.paymentAmount === 'number' 
                ? order.paymentAmount 
                : parseFloat(String(order.paymentAmount).replace(/[^\d.-]/g, '') || '0');
              
              return sum + (Number.isNaN(amount) ? 0 : amount);
            }, 0);
          
          setPreviousMonthBalance(paidTotal);
        } else {
          setPreviousMonthBalance(0);
        }
      } else {
        setPreviousMonthBalance(0);
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setTransactions([]);
      setPreviousMonthBalance(0);
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
    
    // If it's a fixed expense with budget, ensure budget is also a number
    if (transaction.type === 'fixed' && transaction.budget) {
      newTransaction.budget = typeof transaction.budget === 'string'
        ? parseFloat(String(transaction.budget).replace(/\./g, ""))
        : transaction.budget;
    }
    
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
    
    // If it's a fixed expense with budget, ensure budget is also a number
    if (transaction.type === 'fixed' && transaction.budget) {
      transaction.budget = typeof transaction.budget === 'string'
        ? parseFloat(String(transaction.budget).replace(/\./g, ""))
        : transaction.budget;
    }
    
    const newTransactions = transactions.map(t => 
      t.id === transaction.id ? transaction : t
    );
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  };
  
  // Toggle payment status
  const togglePaymentStatus = (id: string) => {
    const newTransactions = transactions.map(t => 
      t.id === id ? { ...t, isPaid: !t.isPaid } : t
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

  // Calculate budget vs actual for fixed expenses
  const budgetVsActual = useMemo(() => {
    const fixedExpenses = transactions.filter(t => t.type === "fixed");
    const totalBudget = fixedExpenses.reduce((sum, t) => sum + (t.budget || 0), 0);
    const totalActual = fixedExpenses.reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalBudget,
      totalActual,
      difference: totalBudget - totalActual
    };
  }, [transactions]);

  // Calculate remaining balance
  const remainingBalance = useMemo(() => {
    return previousMonthBalance - totalFixedExpenses - totalVariableExpenses;
  }, [previousMonthBalance, totalFixedExpenses, totalVariableExpenses]);

  // Get active categories
  const activeCategories = useMemo(() => {
    return categories.filter(c => c.isActive);
  }, [categories]);

  // Get fixed expense categories
  const fixedCategories = useMemo(() => {
    return categories.filter(c => c.type === "fixed" && c.isActive);
  }, [categories]);

  // Get variable expense categories  
  const variableCategories = useMemo(() => {
    return categories.filter(c => c.type === "variable" && c.isActive);
  }, [categories]);
  
  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    togglePaymentStatus,
    totalFixedExpenses,
    totalVariableExpenses,
    budgetVsActual,
    activeCategories,
    fixedCategories,
    variableCategories,
    previousMonthBalance,
    remainingBalance
  };
}
