
import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus, ListCheck, Check, CreditCard } from "lucide-react";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { TransactionTable } from "@/components/transactions/TransactionTable";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { formatCurrency } from "@/lib/utils";

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
    remainingBalance
  } = useTransactionsData(selectedYear, selectedMonth);
  
  // Handle modal states
  const handleOpenAddTransactionModal = () => setIsAddTransactionModalOpen(true);
  const handleCloseAddTransactionModal = () => setIsAddTransactionModalOpen(false);

  // Get filter description for stat cards
  const getFilterDescription = () => {
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
  const getPreviousMonthDescription = () => {
    if (selectedMonth === "Semua Data" || selectedYear === "Semua Data") {
      return "bulan sebelumnya";
    }
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const currentMonthIndex = monthNames.findIndex(m => m === selectedMonth);
    
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

  // Calculate paid fixed expenses
  const fixedExpensesPaid = useMemo(() => {
    return transactions
      .filter(t => t.type === "fixed" && t.isPaid)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Count how many fixed expenses are paid vs total
  const fixedExpenseStatus = useMemo(() => {
    const fixedExpenses = transactions.filter(t => t.type === "fixed");
    const paidCount = fixedExpenses.filter(t => t.isPaid).length;
    return {
      paid: paidCount,
      total: fixedExpenses.length,
      percent: fixedExpenses.length > 0 ? (paidCount / fixedExpenses.length) * 100 : 0
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Catatan Transaksi Pengeluaran</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pantau dan lacak pengeluaran bulanan bisnis Anda
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <FilterBar
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            className="w-full lg:w-auto"
          />
          <Button 
            className="bg-wedding-primary hover:bg-wedding-accent" 
            onClick={handleOpenAddTransactionModal}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Tambah Transaksi
          </Button>
        </div>
      </div>
      
      <div className="grid gap-1.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Saldo Awal"
          value={formatCurrency(previousMonthBalance)}
          icon={<Wallet className="h-2.5 w-2.5 text-white" />}
          description={`Dari ${getPreviousMonthDescription()} (Lunas)`}
          className="col-span-1"
        />
        <StatCard
          title="Pengeluaran Tetap"
          value={formatCurrency(totalFixedExpenses)}
          icon={<ArrowDownCircle className="h-2.5 w-2.5 text-white" />}
          description="Biaya operasional"
          type="warning"
          className="col-span-1"
        />
        <StatCard
          title="Pengeluaran Variabel"
          value={formatCurrency(totalVariableExpenses)}
          icon={<ArrowDownCircle className="h-2.5 w-2.5 text-white" />}
          description="Biaya tidak tetap"
          type="danger"
          className="col-span-1"
        />
        <StatCard
          title="Sisa Saldo"
          value={formatCurrency(remainingBalance)}
          icon={<CreditCard className="h-2.5 w-2.5 text-white" />}
          description={`Setelah pengeluaran`}
          type={remainingBalance >= 0 ? "success" : "danger"}
          className="col-span-1"
        />
        <StatCard
          title="Status Pembayaran"
          value={`${fixedExpenseStatus.paid}/${fixedExpenseStatus.total}`}
          icon={<Check className="h-2.5 w-2.5 text-white" />}
          description={`${fixedExpenseStatus.percent.toFixed(0)}% sudah dibayar`}
          type="success"
          className="col-span-1"
        />
        <StatCard
          title="Anggaran vs Aktual"
          value={formatCurrency(budgetVsActual.difference)}
          icon={<ListCheck className="h-2.5 w-2.5 text-white" />}
          description={`Dari ${formatCurrency(budgetVsActual.totalBudget)}`}
          type={budgetVsActual.difference >= 0 ? "success" : "danger"}
          className="col-span-1"
        />
      </div>
      
      <div className="space-y-6">
        <TransactionTable 
          transactions={transactions}
          onEdit={updateTransaction}
          onDelete={deleteTransaction}
          onTogglePaymentStatus={togglePaymentStatus}
        />
      </div>
      
      {/* Transaction modal */}
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
