
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

  // Load transactions from localStorage
  useEffect(() => {
    try {
      // First, handle loading transactions based on filters
      const storageKey = getStorageKey();
      console.log(`Loading transactions with key: ${storageKey}`);
      
      if (month === "Semua Data" || year === "Semua Data") {
        // Handle "All Months" filter case
        const allTransactions: Transaction[] = [];
        const monthNames = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
        const years = [
          (new Date().getFullYear() - 5).toString(),
          (new Date().getFullYear() - 4).toString(),
          (new Date().getFullYear() - 3).toString(),
          (new Date().getFullYear() - 2).toString(),
          (new Date().getFullYear() - 1).toString(),
          new Date().getFullYear().toString(),
          (new Date().getFullYear() + 1).toString()
        ];
        
        // If only month is "All Data", filter by the selected year
        if (month === "Semua Data" && year !== "Semua Data") {
          monthNames.forEach(monthName => {
            const monthKey = `transactions_${year}_${monthName}`;
            const storedData = localStorage.getItem(monthKey);
            if (storedData) {
              try {
                const parsedData = JSON.parse(storedData);
                allTransactions.push(...parsedData);
              } catch (error) {
                console.error(`Error parsing data for ${monthKey}:`, error);
              }
            }
          });
        }
        // If only year is "All Data", filter by the selected month
        else if (year === "Semua Data" && month !== "Semua Data") {
          years.forEach(yearVal => {
            const monthKey = `transactions_${yearVal}_${month.toLowerCase()}`;
            const storedData = localStorage.getItem(monthKey);
            if (storedData) {
              try {
                const parsedData = JSON.parse(storedData);
                allTransactions.push(...parsedData);
              } catch (error) {
                console.error(`Error parsing data for ${monthKey}:`, error);
              }
            }
          });
        }
        // If both are "All Data", load everything
        else if (year === "Semua Data" && month === "Semua Data") {
          years.forEach(yearVal => {
            monthNames.forEach(monthName => {
              const monthKey = `transactions_${yearVal}_${monthName}`;
              const storedData = localStorage.getItem(monthKey);
              if (storedData) {
                try {
                  const parsedData = JSON.parse(storedData);
                  allTransactions.push(...parsedData);
                } catch (error) {
                  console.error(`Error parsing data for ${monthKey}:`, error);
                }
              }
            });
          });
        }
        
        console.log(`Found ${allTransactions.length} transactions for all months`);
        setTransactions(allTransactions);
      } else {
        // Standard case: specific month and year
        const storedTransactions = localStorage.getItem(storageKey);
        
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        } else {
          setTransactions([]);
        }
      }

      // Load categories
      const storedCategories = localStorage.getItem("transactionCategories");
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      }
      
      // Load previous month's balance from orders
      if (month !== "Semua Data" && year !== "Semua Data") {
        const monthNames = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
        const currentMonthIndex = monthNames.findIndex(m => m.toLowerCase() === month.toLowerCase());
        
        if (currentMonthIndex !== -1) {
          // Calculate previous month and year
          let prevMonthIndex = currentMonthIndex - 1;
          let prevYear = year;
          
          if (prevMonthIndex < 0) {
            prevMonthIndex = 11; // December
            prevYear = (parseInt(year) - 1).toString();
          }
          
          const prevMonth = monthNames[prevMonthIndex];
          const prevMonthKey = `orders_${prevYear}_${prevMonth}`;
          
          console.log(`Checking previous month balance from: ${prevMonthKey}`);
          const ordersData = localStorage.getItem(prevMonthKey);
          
          if (ordersData) {
            try {
              const orders = JSON.parse(ordersData);
              console.log(`Found ${orders.length} orders for previous month ${prevMonthKey}`);
              
              // Calculate total from paid orders only (with status "Lunas")
              const paidOrders = orders.filter((order: any) => order.paymentStatus === "Lunas");
              console.log(`Found ${paidOrders.length} paid orders for previous month`);
              
              let paidTotal = 0;
              paidOrders.forEach((order: any) => {
                // Clean and parse the payment amount
                let amount = 0;
                if (typeof order.paymentAmount === 'number') {
                  amount = order.paymentAmount;
                } else if (typeof order.paymentAmount === 'string') {
                  // Remove non-numeric characters except decimal point
                  const cleanAmount = String(order.paymentAmount).replace(/[^\d.-]/g, '');
                  amount = parseFloat(cleanAmount || '0');
                }
                
                if (!isNaN(amount)) {
                  paidTotal += amount;
                }
              });
              
              console.log(`Previous month (${prevMonthKey}) paid orders total:`, paidTotal);
              setPreviousMonthBalance(paidTotal);
            } catch (error) {
              console.error("Error parsing previous month orders:", error);
              setPreviousMonthBalance(0);
            }
          } else {
            console.log(`No orders data found for previous month (${prevMonthKey})`);
            setPreviousMonthBalance(0);
          }
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
