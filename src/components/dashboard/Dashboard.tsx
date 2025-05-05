
import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ClockIcon, ChartPie, ChartLine } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { ChartData } from "@/types/types";
import { format, isAfter, parseISO } from "date-fns";

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua Data");
  
  // Ambil data pesanan berdasarkan filter
  const { orders, isLoading } = useOrdersData(selectedYear, selectedMonth);
  
  // Hitung statistik dari data pesanan
  const stats = useMemo(() => {
    // Total Pesanan
    const totalOrders = orders.length;
    
    // Total Pendapatan
    const totalRevenue = orders.reduce((sum, order) => sum + (order.paymentAmount || 0), 0);
    
    // Pesanan yang dibayar
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas").length;
    
    // Pesanan yang belum dibayar
    const pendingOrders = orders.filter(order => order.paymentStatus === "Pending").length;
    
    // Pesanan yang perlu diselesaikan (dengan event date dalam 14 hari)
    const urgentOrdersCount = orders.filter(order => {
      if (!order.eventDate) return false;
      
      const today = new Date();
      const eventDate = parseISO(order.eventDate);
      const differenceInDays = Math.round((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return differenceInDays >= 0 && differenceInDays <= 14;
    }).length;
    
    // Data untuk chart status pembayaran
    const paymentStatusData: ChartData[] = [
      { name: "Lunas", value: paidOrders },
      { name: "Pending", value: pendingOrders },
    ];
    
    // Data untuk chart status pengerjaan
    const workStatusMap = new Map<string, number>();
    
    orders.forEach(order => {
      const status = order.workStatus;
      if (status) {
        workStatusMap.set(status, (workStatusMap.get(status) || 0) + 1);
      }
    });
    
    const workStatusData: ChartData[] = Array.from(workStatusMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    // Data untuk chart distribusi vendor
    const vendorMap = new Map<string, number>();
    
    orders.forEach(order => {
      const vendor = order.vendor;
      if (vendor) {
        vendorMap.set(vendor, (vendorMap.get(vendor) || 0) + 1);
      }
    });
    
    const vendorData: ChartData[] = Array.from(vendorMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    // Data untuk chart pesanan per bulan
    const monthlyOrdersMap = new Map<string, number>();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    orders.forEach(order => {
      try {
        const date = new Date(order.orderDate);
        const monthName = monthNames[date.getMonth()];
        monthlyOrdersMap.set(monthName, (monthlyOrdersMap.get(monthName) || 0) + 1);
      } catch (e) {
        console.error("Error parsing date:", order.orderDate);
      }
    });
    
    const monthlyOrdersData: ChartData[] = monthNames
      .map(month => ({
        name: month,
        value: monthlyOrdersMap.get(month) || 0
      }));
    
    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      pendingOrders,
      urgentOrdersCount,
      paymentStatusData,
      workStatusData,
      vendorData,
      monthlyOrdersData
    };
  }, [orders]);
  
  // Format currency untuk Rupiah
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <FilterBar
          onYearChange={setSelectedYear}
          onMonthChange={setSelectedMonth}
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          className="w-full md:w-auto"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Pesanan"
              value={`${stats.totalOrders}`}
              icon={<Calendar className="h-4 w-4" />}
              description="Keseluruhan pesanan"
            />
            <StatCard
              title="Total Pendapatan"
              value={formatCurrency(stats.totalRevenue)}
              icon={<ChartLine className="h-4 w-4" />}
              description={`${stats.paidOrders} pesanan telah lunas`}
            />
            <StatCard
              title="Menunggu Pembayaran"
              value={`${stats.pendingOrders}`}
              icon={<ClockIcon className="h-4 w-4" />}
              description="Pesanan dengan status Pending"
            />
            <StatCard
              title="Pesanan Mendesak"
              value={`${stats.urgentOrdersCount}`}
              icon={<Calendar className="h-4 w-4" />}
              description="Acara dalam 14 hari kedepan"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Pesanan Per Bulan"
              data={stats.monthlyOrdersData}
              type="bar"
            />
            <ChartCard
              title="Status Pembayaran"
              data={stats.paymentStatusData}
              type="pie"
              colors={["#10b981", "#f59e0b"]}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Distribusi Vendor"
              data={stats.vendorData}
              type="pie"
            />
            <ChartCard
              title="Status Pengerjaan"
              data={stats.workStatusData}
              type="pie"
            />
          </div>
        </>
      )}
    </div>
  );
}
