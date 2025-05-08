
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MonthYearSelector } from "./MonthYearSelector";
import { getMonthTranslation } from "@/utils/monthlyOrdersUtils";

interface MonthlyOrdersHeaderProps {
  month?: string;
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  onAddOrder: () => void;
}

export function MonthlyOrdersHeader({
  month,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  onAddOrder
}: MonthlyOrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Pesanan {month && getMonthTranslation(month)}
          </h2>
          <p className="text-sm text-muted-foreground">
            Data pesanan undangan digital
          </p>
        </div>
        
        {/* Year and Month Filter */}
        <MonthYearSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
        />
      </div>
      
      <Button onClick={onAddOrder}>
        <Plus className="mr-2 h-4 w-4" /> Tambah Pesanan
      </Button>
    </div>
  );
}
