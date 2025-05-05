
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

export function DashboardHeader({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Input
            placeholder="Cari Pesanan..."
            className="w-60 pl-10"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <FilterBar
          onYearChange={onYearChange}
          onMonthChange={onMonthChange}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          className="w-auto"
        />
      </div>
    </div>
  );
}
