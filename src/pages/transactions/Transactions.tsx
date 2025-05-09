
import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Wallet, ArrowDownCircle, ArrowUpCircle, Plus } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
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
  
  // Get order data based on filters for saldo calculation
  const { orders } = useOrdersData(selectedYear, selectedMonth);
  
  // Get transaction data from localStorage
  const { 
    transactions, 
    addTransaction,
    totalFixedExpenses,
    totalVariableExpenses
  } = useTransactionsData(selectedYear, selectedMonth);
  
  // Calculate total revenue/saldo from orders
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => {
      const amount = typeof order.paymentAmount === 'number' 
        ? order.paymentAmount 
        : parseFloat(String(order.paymentAmount).replace(/[^\d.-]/g, '') || '0');
      
      return sum + (Number.isNaN(amount) ? 0 : amount);
    }, 0);
  }, [orders]);
  
  // Calculate remaining saldo after expenses
  const remainingSaldo = totalRevenue - totalFixedExpenses - totalVariableExpenses;
  
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
      
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          title="Total Saldo Bulanan"
          value={formatCurrency(totalRevenue)}
          icon={<Wallet className="h-3 w-3 text-white" />}
          description={getFilterDescription()}
        />
        <StatCard
          title="Pengeluaran Tetap"
          value={formatCurrency(totalFixedExpenses)}
          icon={<ArrowDownCircle className="h-3 w-3 text-white" />}
          description="Biaya operasional tetap"
          type="warning"
        />
        <StatCard
          title="Pengeluaran Tidak Tetap"
          value={formatCurrency(totalVariableExpenses)}
          icon={<ArrowDownCircle className="h-3 w-3 text-white" />}
          description="Biaya tidak terencana"
          type="danger"
        />
        <StatCard
          title="Sisa Saldo"
          value={formatCurrency(remainingSaldo)}
          icon={<ArrowUpCircle className="h-3 w-3 text-white" />}
          description="Setelah pengeluaran"
          type={remainingSaldo >= 0 ? "success" : "danger"}
        />
      </div>
      
      <div className="space-y-6">
        <TransactionTable 
          transactions={transactions}
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
