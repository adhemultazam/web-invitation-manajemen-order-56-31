
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { useOrdersData } from "@/hooks/useOrdersData";

interface TopThemesChartProps {
  selectedYear: string;
  selectedMonth: string;
}

export function TopThemesChart({ selectedYear, selectedMonth }: TopThemesChartProps) {
  // Fetch orders data based on filters
  const { orders } = useOrdersData(selectedYear, selectedMonth);

  // Generate top themes data
  const topThemesData = useMemo(() => {
    const themeMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.theme) {
        themeMap.set(order.theme, (themeMap.get(order.theme) || 0) + 1);
      }
    });
    
    const sortedThemeEntries = Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return sortedThemeEntries.map(([name, value]) => ({ name, value }));
  }, [orders]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Tema Terlaris</CardTitle>
          <CardDescription>
            {selectedMonth !== "Semua Data" ? selectedMonth : "Semua bulan"} {selectedYear !== "Semua Data" ? `tahun ${selectedYear}` : ""}
          </CardDescription>
        </div>
        <div className="text-sm text-muted-foreground">
          Bulan Ini
        </div>
      </CardHeader>
      <CardContent>
        <ChartCard
          title=""
          data={topThemesData}
          type="pie"
          colors={["#38B2AC", "#4FD1C5", "#81E6D9", "#B2F5EA", "#E6FFFA"]} 
          height={300}
        />
      </CardContent>
    </Card>
  );
}
