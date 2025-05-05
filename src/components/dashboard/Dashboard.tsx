import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, ChartPie, Wallet, Package, Layers, Check, DollarSign } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { ChartData, MultiBarChartData } from "@/types/types";
import { format, isAfter, parseISO } from "date-fns";
import { useVendorsData } from "@/hooks/useVendorsData";

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua Data");
  
  // Ambil data pesanan berdasarkan filter
  const { orders, isLoading } = useOrdersData(selectedYear, selectedMonth);
  const { vendors } = useVendorsData();
  
  // Hitung statistik dari data pesanan
  const stats = useMemo(() => {
    // Map vendor ID to vendor name
    const vendorMap = new Map(vendors.map(vendor => [vendor.id, vendor.name]));
    
    // Total Pesanan
    const totalOrders = orders.length;
    
    // Reset accumulated values
    let totalRevenue = 0;
    
    // Calculate total revenue correctly
    orders.forEach(order => {
      // Parse to float to ensure we're dealing with numbers, not strings
      const amount = parseFloat(order.paymentAmount as any) || 0;
      
      if (!isNaN(amount) && isFinite(amount)) {
        totalRevenue += amount;
      }
    });
    
    // Pesanan yang dibayar
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas");
    const paidOrdersCount = paidOrders.length;
    
    // Calculate paid revenue correctly
    let paidRevenue = 0;
    paidOrders.forEach(order => {
      // Parse to float to ensure we're dealing with numbers, not strings
      const amount = parseFloat(order.paymentAmount as any) || 0;
      
      if (!isNaN(amount) && isFinite(amount)) {
        paidRevenue += amount;
      }
    });
    
    // Pesanan yang belum dibayar
    const pendingOrders = orders.filter(order => order.paymentStatus === "Pending");
    const pendingOrdersCount = pendingOrders.length;
    
    // Calculate pending revenue correctly
    let pendingRevenue = 0;
    pendingOrders.forEach(order => {
      // Parse to float to ensure we're dealing with numbers, not strings
      const amount = parseFloat(order.paymentAmount as any) || 0;
      
      if (!isNaN(amount) && isFinite(amount)) {
        pendingRevenue += amount;
      }
    });
    
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
      { name: "Lunas", value: paidOrdersCount },
      { name: "Pending", value: pendingOrdersCount },
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
    const vendorOrdersMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.vendor) {
        // Use vendor name instead of ID
        const vendorName = vendorMap.get(order.vendor) || order.vendor;
        vendorOrdersMap.set(vendorName, (vendorOrdersMap.get(vendorName) || 0) + 1);
      }
    });
    
    const vendorData: ChartData[] = Array.from(vendorOrdersMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    // Data untuk chart pembayaran per vendor dengan status pembayaran
    const vendorPaymentMap = new Map<string, { paid: number; pending: number }>();
    
    orders.forEach(order => {
      if (order.vendor) {
        // Use vendor name instead of ID
        const vendorName = vendorMap.get(order.vendor) || order.vendor;
        
        // Initialize if not exists
        if (!vendorPaymentMap.has(vendorName)) {
          vendorPaymentMap.set(vendorName, { paid: 0, pending: 0 });
        }
        
        const vendorStats = vendorPaymentMap.get(vendorName)!;
        
        // Add amount to appropriate payment status
        if (order.paymentStatus === "Lunas") {
          vendorStats.paid += order.paymentAmount;
        } else {
          vendorStats.pending += order.paymentAmount;
        }
      }
    });
    
    const vendorPaymentData: MultiBarChartData[] = Array.from(vendorPaymentMap.entries())
      .map(([name, stats]) => ({ 
        name, 
        paid: stats.paid, 
        pending: stats.pending 
      }));
    
    // Data untuk chart tema terlaris
    const themeMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.theme) {
        themeMap.set(order.theme, (themeMap.get(order.theme) || 0) + 1);
      }
    });
    
    // Sortir tema berdasarkan jumlah pesanan (descending)
    const sortedThemeEntries = Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Ambil 5 tema teratas
    
    const topThemesData: ChartData[] = sortedThemeEntries
      .map(([name, value]) => ({ name, value }));
    
    // Data untuk chart paket terlaris
    const packageMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.package) {
        packageMap.set(order.package, (packageMap.get(order.package) || 0) + 1);
      }
    });
    
    // Sortir paket berdasarkan jumlah pesanan (descending)
    const sortedPackageEntries = Array.from(packageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Ambil 5 paket teratas
    
    const topPackagesData: ChartData[] = sortedPackageEntries
      .map(([name, value]) => ({ name, value }));
    
    // Data untuk chart pesanan per bulan
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    // Create monthly orders data synchronized with the selected year/month
    const generateMonthlyOrdersData = () => {
      if (selectedMonth === "Semua Data") {
        // For year view, create a map for each month with 0 as default value
        const monthlyOrdersMap = new Map<number, number>();
        
        // Initialize all months with 0
        monthNames.forEach((_, index) => {
          monthlyOrdersMap.set(index, 0);
        });

        // Process each order
        orders.forEach(order => {
          try {
            const orderDate = new Date(order.orderDate);
            // Only count orders from selected year or all years if "Semua Data"
            if (selectedYear === "Semua Data" || orderDate.getFullYear().toString() === selectedYear) {
              const month = orderDate.getMonth(); // 0-11
              monthlyOrdersMap.set(month, (monthlyOrdersMap.get(month) || 0) + 1);
            }
          } catch (e) {
            console.error("Error parsing date:", order.orderDate);
          }
        });

        // Create chart data from the map for all 12 months
        return monthNames.map((month, index) => ({
          name: month,
          value: monthlyOrdersMap.get(index) || 0
        }));
      } else {
        // If a specific month is selected, show daily data for that month
        const monthIndex = monthNames.findIndex(m => 
          m.toLowerCase() === selectedMonth.substring(0, 3).toLowerCase()
        );
        
        if (monthIndex === -1) return [];
        
        const year = parseInt(selectedYear !== "Semua Data" ? selectedYear : new Date().getFullYear().toString());
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        
        // Initialize all days with 0
        const dailyOrdersMap = new Map<number, number>();
        for (let i = 1; i <= daysInMonth; i++) {
          dailyOrdersMap.set(i, 0);
        }
        
        orders.forEach(order => {
          try {
            const orderDate = new Date(order.orderDate);
            if (orderDate.getMonth() === monthIndex && 
                (selectedYear === "Semua Data" || orderDate.getFullYear().toString() === selectedYear)) {
              const day = orderDate.getDate(); // 1-31
              dailyOrdersMap.set(day, (dailyOrdersMap.get(day) || 0) + 1);
            }
          } catch (e) {
            console.error("Error parsing date:", order.orderDate);
          }
        });
        
        // Create chart data for each day of the selected month
        return Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => ({
          name: day.toString(),
          value: dailyOrdersMap.get(day) || 0
        }));
      }
    };
    
    const monthlyOrdersData = generateMonthlyOrdersData();
    
    return {
      totalOrders,
      totalRevenue,
      paidOrdersCount,
      paidRevenue,
      pendingOrdersCount,
      pendingRevenue,
      urgentOrdersCount,
      paymentStatusData,
      workStatusData,
      vendorData,
      vendorPaymentData,
      monthlyOrdersData,
      topThemesData,
      topPackagesData
    };
  }, [orders, selectedYear, selectedMonth, vendors]);
  
  // Format currency untuk Rupiah
  const formatCurrency = (amount: number): string => {
    // Add safety check to prevent invalid formatting
    if (!isFinite(amount) || isNaN(amount)) {
      return "Rp 0";
    }
    
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
              title="Total Omset"
              value={stats.totalRevenue}
              icon={<DollarSign className="h-4 w-4" />}
              description={`${stats.totalOrders} pesanan`}
            />
            <StatCard
              title="Sudah Lunas"
              value={`${stats.paidOrdersCount}`}
              icon={<Check className="h-4 w-4" />}
              description={stats.paidRevenue}
              type="success"
            />
            <StatCard
              title="Belum Lunas"
              value={`${stats.pendingOrdersCount}`}
              icon={<CreditCard className="h-4 w-4" />}
              description={stats.pendingRevenue}
              type="danger"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title={selectedMonth === "Semua Data" ? "Pesanan Per Bulan" : `Pesanan Harian (${selectedMonth})`}
              data={stats.monthlyOrdersData}
              type="bar"
            />
            <ChartCard
              title="Status Pembayaran"
              data={stats.paymentStatusData}
              type="pie"
              colors={["#0EA5E9", "#F97316"]} // Blue for paid, Orange for pending
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

          {/* New charts for top themes and packages */}
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Tema Terlaris"
              description="5 tema paling banyak dipesan"
              data={stats.topThemesData}
              type="bar"
              colors={["#8B5CF6", "#9333EA", "#A855F7", "#C084FC", "#D8B4FE"]} // Purple colors
              icon={<Layers className="h-4 w-4" />}
            />
            <ChartCard
              title="Paket Terlaris"
              description="5 paket paling banyak dipesan"
              data={stats.topPackagesData}
              type="bar"
              colors={["#1EAEDB", "#38BDF8", "#7DD3FC", "#BAE6FD", "#E0F2FE"]} // Blue colors
              icon={<Package className="h-4 w-4" />}
            />
          </div>

          {/* Chart for vendor payment statistics with payment status colors */}
          <div className="grid gap-4">
            <ChartCard
              title="Pembayaran Per Vendor"
              data={stats.vendorPaymentData}
              type="multiBar"
              isCurrency={true}
              barKeys={[
                { key: "paid", color: "#0EA5E9" }, // Blue for paid
                { key: "pending", color: "#F97316" } // Orange for pending
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
