
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Plus } from "lucide-react";

interface TransactionHeaderProps {
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  selectedMonth: string;
  onAddTransactionClick: () => void;
}

export const TransactionHeader: FC<TransactionHeaderProps> = ({
  onYearChange,
  onMonthChange,
  selectedYear,
  selectedMonth,
  onAddTransactionClick,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Catatan Transaksi Pengeluaran</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Pantau dan lacak pengeluaran bulanan bisnis Anda
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        <FilterBar
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          className="w-full lg:w-auto"
        />
        <Button 
          className="bg-wedding-primary hover:bg-wedding-accent" 
          onClick={onAddTransactionClick}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>
    </div>
  );
};
