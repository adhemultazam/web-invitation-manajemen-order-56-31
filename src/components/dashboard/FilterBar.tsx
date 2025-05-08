
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";

interface FilterBarProps {
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  selectedMonth: string;
  className?: string;
}

const generateYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  return ["Semua Data", (currentYear - 1).toString(), currentYear.toString(), (currentYear + 1).toString()];
};

const months = [
  "Semua Data",
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function FilterBar({
  onYearChange,
  onMonthChange,
  selectedYear,
  selectedMonth,
  className = "",
}: FilterBarProps) {
  const years = generateYearOptions();
  
  // Set default year and month on initial render if not already set
  useEffect(() => {
    if (!selectedYear && onYearChange) {
      const currentYear = new Date().getFullYear().toString();
      if (years.includes(currentYear)) {
        onYearChange(currentYear);
      }
    }
    
    if (!selectedMonth && onMonthChange) {
      onMonthChange("Semua Data");
    }
  }, [selectedYear, selectedMonth, onYearChange, onMonthChange, years]);

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <SelectValue placeholder="Pilih Tahun" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={selectedMonth}
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <SelectValue placeholder="Pilih Bulan" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
