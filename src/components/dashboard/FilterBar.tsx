
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

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
    if (selectedYear === "Semua Data" || !selectedYear) {
      const currentYear = new Date().getFullYear().toString();
      if (years.includes(currentYear)) {
        onYearChange(currentYear);
      }
    }
    
    if (selectedMonth === "Semua Data" || !selectedMonth) {
      const currentMonthIndex = new Date().getMonth();
      onMonthChange(months[currentMonthIndex + 1]); // +1 because index 0 is "Semua Data"
    }
  }, []);

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Tahun:</span>
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="w-[140px]">
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
        <span className="text-sm font-medium">Bulan:</span>
        <Select
          value={selectedMonth}
          onValueChange={onMonthChange}
        >
          <SelectTrigger className="w-[140px]">
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
