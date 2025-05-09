
import { useState, useEffect, useMemo } from "react";
import { Transaction, TransactionCategory } from "@/types/types";
import { v4 as uuidv4 } from "uuid";
import { usePreviousMonthBalance } from "./usePreviousMonthBalance";
import { useFixedExpensesGenerator } from "./useFixedExpensesGenerator";
import { 
  loadTransactions, 
  saveTransactions, 
  normalizeTransactionAmounts 
} from "@/utils/transactionStorageUtils";

export function useTransactionsData(year: string, month: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  
  // Use the extracted hooks
  const previousMonthBalance = usePreviousMonthBalance(year, month);
  
  // Update transactions handler for the fixed expenses generator
  const updateTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    saveTransactions(newTransactions, year, month);
  };
  
  // Use the fixed expense generator hook
  useFixedExpensesGenerator(year, month, transactions, categories, updateTransactions);
  
  // Load transactions and categories from localStorage
  useEffect(() => {
    try {
      const loadedTransactions = loadTransactions(year, month);
      setTransactions(loadedTransactions || []);

      // Load categories
      const storedCategories = localStorage.getItem("transactionCategories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setTransactions([]);
    }
  }, [year, month]);
  
  // Add a new transaction
  const addTransaction = (transaction: Transaction) => {
    const normalizedTransaction = normalizeTransactionAmounts(transaction);
    const newTransactions = [...transactions, normalizedTransaction];
    setTransactions(newTransactions);
    saveTransactions(newTransactions, year, month);
  };
  
  // Update a transaction
  const updateTransaction = (updatedTransaction: Transaction) => {
    const normalizedTransaction = normalizeTransactionAmounts(updatedTransaction);
    const newTransactions = transactions.map(t => 
      t.id === normalizedTransaction.id ? normalizedTransaction : t
    );
    setTransactions(newTransactions);
    saveTransactions(newTransactions, year, month);
  };
  
  // Toggle payment status
  const togglePaymentStatus = (id: string) => {
    const newTransactions = transactions.map(t => 
      t.id === id ? { ...t, isPaid: !t.isPaid } : t
    );
    setTransactions(newTransactions);
    saveTransactions(newTransactions, year, month);
  };
  
  // Delete a transaction
  const deleteTransaction = (id: string) => {
    const newTransactions = transactions.filter(t => t.id !== id);
    setTransactions(newTransactions);
    saveTransactions(newTransactions, year, month);
  };
  
  // Calculate totals and stats using memoization
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

  // Get active categories by type
  const activeCategories = useMemo(() => {
    return categories.filter(c => c.isActive);
  }, [categories]);

  const fixedCategories = useMemo(() => {
    return categories.filter(c => c.type === "fixed" && c.isActive);
  }, [categories]);

  const variableCategories = useMemo(() => {
    return categories.filter(c => c.type === "variable" && c.isActive);
  }, [categories]);

  // Get reminders for fixed expenses not yet paid
  const unpaidFixedExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === "fixed" && !t.isPaid)
      .sort((a, b) => (a.budget || 0) - (b.budget || 0));
  }, [transactions]);
  
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
    remainingBalance,
    unpaidFixedExpenses
  };
}
