
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterBarProps {
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  selectedYear: string;
  selectedMonth: string;
  className?: string;
}

const years = ["Semua Data", "2023", "2024", "2025"];
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
