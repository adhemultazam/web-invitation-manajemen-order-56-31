
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface MonthYearSelectorProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

export function MonthYearSelector({ 
  selectedYear, 
  selectedMonth, 
  onYearChange, 
  onMonthChange 
}: MonthYearSelectorProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleMonthChange = (month: string) => {
    // Always update the selected month state first
    onMonthChange(month);
    
    // Only navigate if we're on an orders route
    if (location.pathname.includes('/pesanan')) {
      setTimeout(() => {
        if (month === "Semua Data") {
          // Navigate to all orders page
          navigate("/pesanan");
        } else {
          // Convert month name to URL parameter format
          const monthParam = month.toLowerCase();
          navigate(`/pesanan/${monthParam}`);
        }
      }, 0); // Use setTimeout to ensure state update before navigation
    }
  };
  
  // Sync the URL with the selected month
  useEffect(() => {
    // Only sync if we're on an orders route
    if (location.pathname.includes('/pesanan')) {
      const pathParts = location.pathname.split('/');
      const monthParam = pathParts[pathParts.length - 1];
      
      // If we're on /pesanan route without month param, set selectedMonth to "Semua Data"
      if (pathParts[1] === "pesanan" && !pathParts[2]) {
        if (selectedMonth !== "Semua Data") {
          onMonthChange("Semua Data");
        }
      }
    }
  }, [location.pathname, selectedMonth, onMonthChange]);
  
  const generateYearOptions = (previousYears: number = 5): string[] => {
    const currentYear = new Date().getFullYear();
    const years = ["Semua Data"];
    
    // Add previous years
    for (let i = previousYears; i >= 1; i--) {
      years.push((currentYear - i).toString());
    }
    
    // Add current year and next year
    years.push(currentYear.toString());
    years.push((currentYear + 1).toString());
    
    return years;
  };
  
  const yearOptions = generateYearOptions(5); // Show 5 previous years by default
  
  return (
    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
      <Select
        value={selectedYear}
        onValueChange={onYearChange}
      >
        <SelectTrigger className="w-[120px] h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <SelectValue placeholder="Pilih Tahun" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800">
          {yearOptions.map(year => (
            <SelectItem key={year} value={year}>
              {year === "Semua Data" ? "Semua Tahun" : year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={selectedMonth}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <SelectValue placeholder="Pilih Bulan" />
        </SelectTrigger>
        <SelectContent className="z-50 bg-white dark:bg-gray-800">
          <SelectItem value="Semua Data">Semua Bulan</SelectItem>
          <SelectItem value="Januari">Januari</SelectItem>
          <SelectItem value="Februari">Februari</SelectItem>
          <SelectItem value="Maret">Maret</SelectItem>
          <SelectItem value="April">April</SelectItem>
          <SelectItem value="Mei">Mei</SelectItem>
          <SelectItem value="Juni">Juni</SelectItem>
          <SelectItem value="Juli">Juli</SelectItem>
          <SelectItem value="Agustus">Agustus</SelectItem>
          <SelectItem value="September">September</SelectItem>
          <SelectItem value="Oktober">Oktober</SelectItem>
          <SelectItem value="November">November</SelectItem>
          <SelectItem value="Desember">Desember</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
