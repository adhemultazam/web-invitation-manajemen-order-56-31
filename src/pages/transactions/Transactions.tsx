
import { useState, useMemo } from "react";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { TransactionHeader } from "@/components/transactions/TransactionHeader";
import { TransactionStats } from "@/components/transactions/TransactionStats";
import { UnpaidExpensesAlert } from "@/components/transactions/UnpaidExpensesAlert";
import { calculateFixedExpenseStatus, getPreviousMonthDescription } from "@/utils/transactionUtils";

export default function Transactions() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString('id-ID', { month: 'long' })
  );
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  
  // Get transaction data from localStorage with the updated hook
  const { 
    transactions, 
    addTransaction,
    updateTransaction,
    deleteTransaction,
    togglePaymentStatus,
    totalFixedExpenses,
    totalVariableExpenses,
    budgetVsActual,
    previousMonthBalance,
    remainingBalance,
    unpaidFixedExpenses
  } = useTransactionsData(selectedYear, selectedMonth);
  
  // Handle modal states
  const handleOpenAddTransactionModal = () => setIsAddTransactionModalOpen(true);
  const handleCloseAddTransactionModal = () => setIsAddTransactionModalOpen(false);

  // Calculate fixed expense status
  const fixedExpenseStatus = useMemo(() => 
    calculateFixedExpenseStatus(transactions), 
  [transactions]);

  // Get previous month description for display
  const previousMonthDesc = useMemo(() => 
    getPreviousMonthDescription(selectedMonth, selectedYear), 
  [selectedMonth, selectedYear]);

  // Handle marking an expense as paid
  const handleMarkAsPaid = (id: string) => {
    togglePaymentStatus(id);
  };

  // Determine if we should show the unpaid expenses alert
  const showUnpaidExpensesAlert = selectedMonth !== "Semua Data" && 
                                 selectedYear !== "Semua Data" &&
                                 unpaidFixedExpenses.length > 0;

  return (
    <div className="space-y-6">
      <TransactionHeader
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onAddTransactionClick={handleOpenAddTransactionModal}
      />
      
      <TransactionStats
        previousMonthBalance={previousMonthBalance}
        totalFixedExpenses={totalFixedExpenses}
        totalVariableExpenses={totalVariableExpenses}
        remainingBalance={remainingBalance}
        fixedExpenseStatus={fixedExpenseStatus}
        budgetVsActual={budgetVsActual}
        previousMonthDescription={previousMonthDesc}
      />
      
      <UnpaidExpensesAlert 
        unpaidExpenses={unpaidFixedExpenses}
        onMarkAsPaid={handleMarkAsPaid}
        showAlert={showUnpaidExpensesAlert}
      />
      
      <div className="space-y-6">
        <TransactionTable 
          transactions={transactions}
          onEdit={updateTransaction}
          onDelete={deleteTransaction}
          onTogglePaymentStatus={togglePaymentStatus}
        />
      </div>
      
      {isAddTransactionModalOpen && (
        <AddTransactionModal
          isOpen={isAddTransactionModalOpen}
          onClose={handleCloseAddTransactionModal}
          onAddTransaction={(transaction) => {
            addTransaction(transaction);
            handleCloseAddTransactionModal();
          }}
        />
      )}
    </div>
  );
}
