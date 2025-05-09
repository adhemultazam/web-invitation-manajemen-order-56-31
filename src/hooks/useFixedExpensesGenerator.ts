
import { useEffect } from "react";
import { Transaction, TransactionCategory } from "@/types/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

export function useFixedExpensesGenerator(
  year: string, 
  month: string, 
  transactions: Transaction[], 
  categories: TransactionCategory[],
  updateTransactions: (newTransactions: Transaction[]) => void
) {
  // Auto-generate fixed expenses based on categories
  useEffect(() => {
    if (!categories.length || month === "Semua Data" || year === "Semua Data") {
      return;
    }

    const fixedCategories = categories.filter(c => c.type === "fixed" && c.isActive);
    
    // Skip if no fixed categories
    if (fixedCategories.length === 0) {
      return;
    }
    
    // Check if current month already has transactions
    const existingTransactions = transactions.filter(t => t.type === "fixed");
    
    // Get all fixed expense categories that are not yet in this month's transactions
    const missingCategories = fixedCategories.filter(category => 
      !existingTransactions.some(t => t.category === category.name)
    );
    
    if (missingCategories.length > 0) {
      // Create new transactions for missing categories
      const newTransactions = missingCategories.map(category => ({
        id: uuidv4(),
        date: new Date().toISOString(),
        type: "fixed" as const,
        description: `${category.name} ${month} ${year}`,
        amount: 0, // Start with zero, will need to be updated by user
        category: category.name,
        budget: category.defaultBudget || 0,
        isPaid: false
      }));
      
      // Add new transactions to existing ones
      const updatedTransactions = [...transactions, ...newTransactions];
      updateTransactions(updatedTransactions);
      
      // Show notification
      toast.info(`${newTransactions.length} pengeluaran tetap otomatis ditambahkan untuk bulan ini`);
    }
  }, [categories, month, year, transactions]);
}
