
import { FC } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Wallet, ArrowDownCircle, ArrowUpCircle, CreditCard, Check, ListCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface TransactionStatsProps {
  previousMonthBalance: number;
  totalFixedExpenses: number;
  totalVariableExpenses: number;
  remainingBalance: number;
  fixedExpenseStatus: {
    paid: number;
    total: number;
    percent: number;
  };
  budgetVsActual: {
    totalBudget: number;
    difference: number;
  };
  previousMonthDescription: string;
}

export const TransactionStats: FC<TransactionStatsProps> = ({
  previousMonthBalance,
  totalFixedExpenses,
  totalVariableExpenses,
  remainingBalance,
  fixedExpenseStatus,
  budgetVsActual,
  previousMonthDescription,
}) => {
  return (
    <div className="grid gap-1.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <StatCard
        title="Saldo Awal"
        value={formatCurrency(previousMonthBalance)}
        icon={<Wallet className="h-2.5 w-2.5 text-white" />}
        description={`Dari ${previousMonthDescription} (Lunas)`}
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
  );
};
