
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/stats/DashboardStats";
import { SalesReportChart } from "@/components/dashboard/charts/SalesReportChart";
import { TopThemesChart } from "@/components/dashboard/charts/TopThemesChart";
import { TopProductsTable } from "@/components/dashboard/products/TopProductsTable";
import { useOrdersData } from "@/hooks/useOrdersData";

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua Data");
  
  // Fetch orders data to check for loading state
  const { isLoading } = useOrdersData(selectedYear, selectedMonth);

  return (
    <div className="space-y-6">
      <DashboardHeader
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-primary"></div>
        </div>
      ) : (
        <>
          <DashboardStats
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
          />

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <SalesReportChart
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
            <TopThemesChart
              selectedYear={selectedYear}
              selectedMonth={selectedMonth}
            />
          </div>

          <TopProductsTable />
        </>
      )}
    </div>
  );
}
