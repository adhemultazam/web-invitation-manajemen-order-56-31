
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useOrdersData } from "@/hooks/useOrdersData";

interface SalesReportChartProps {
  selectedYear: string;
  selectedMonth: string;
}

export function SalesReportChart({ selectedYear, selectedMonth }: SalesReportChartProps) {
  // Fetch orders data based on filters
  const { orders } = useOrdersData(selectedYear, selectedMonth);

  // Generate monthly revenue data
  const monthlyRevenueData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    if (selectedMonth === "Semua Data") {
      const monthlyRevenueMap = new Map<number, number>();
      
      monthNames.forEach((_, index) => {
        monthlyRevenueMap.set(index, 0);
      });

      orders.forEach(order => {
        try {
          const orderDate = new Date(order.orderDate);
          if (selectedYear === "Semua Data" || orderDate.getFullYear().toString() === selectedYear) {
            const month = orderDate.getMonth();
            monthlyRevenueMap.set(month, (monthlyRevenueMap.get(month) || 0) + order.paymentAmount);
          }
        } catch (e) {
          console.error("Error parsing date:", order.orderDate);
        }
      });

      return monthNames.map((month, index) => ({
        name: month,
        value: monthlyRevenueMap.get(index) || 0
      }));
    } else {
      // Daily data for selected month
      const monthIndex = monthNames.findIndex(m => 
        m.toLowerCase() === selectedMonth.substring(0, 3).toLowerCase()
      );
      
      if (monthIndex === -1) return [];
      
      const year = parseInt(selectedYear !== "Semua Data" ? selectedYear : new Date().getFullYear().toString());
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      
      const dailyRevenueMap = new Map<number, number>();

      for (let i = 1; i <= daysInMonth; i++) {
        dailyRevenueMap.set(i, 0);
      }
      
      orders.forEach(order => {
        try {
          const orderDate = new Date(order.orderDate);
          if (orderDate.getMonth() === monthIndex && 
              (selectedYear === "Semua Data" || orderDate.getFullYear().toString() === selectedYear)) {
            const day = orderDate.getDate();
            dailyRevenueMap.set(day, (dailyRevenueMap.get(day) || 0) + order.paymentAmount);
          }
        } catch (e) {
          console.error("Error parsing date:", order.orderDate);
        }
      });
      
      return Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => ({
        name: day.toString(),
        value: dailyRevenueMap.get(day) || 0
      }));
    }
  }, [orders, selectedYear, selectedMonth]);

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Laporan Penjualan</CardTitle>
          <CardDescription>
            Data {selectedMonth !== "Semua Data" ? selectedMonth : "bulanan"} {selectedYear !== "Semua Data" ? `tahun ${selectedYear}` : ""}
          </CardDescription>
        </div>
        <div className="text-sm text-muted-foreground">
          Bulanan
        </div>
      </CardHeader>
      <CardContent className="px-1">
        <ChartCard
          title=""
          data={monthlyRevenueData}
          type="area"
          isCurrency={true}
          height={300}
          showValues={true}
        />
      </CardContent>
    </Card>
  );
}
