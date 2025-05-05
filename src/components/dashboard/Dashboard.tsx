
import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  ShoppingBag, 
  ShoppingCart, 
  CreditCard, 
  TrendingUp, 
  Plus
} from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { ChartData, MultiBarChartData } from "@/types/types";
import { format, isAfter, parseISO } from "date-fns";
import { useVendorsData } from "@/hooks/useVendorsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua Data");
  
  // Fetch orders data based on filters
  const { orders, isLoading } = useOrdersData(selectedYear, selectedMonth);
  const { vendors } = useVendorsData();
  
  // Calculate stats from orders data
  const stats = useMemo(() => {
    // Map vendor ID to vendor name
    const vendorMap = new Map(vendors.map(vendor => [vendor.id, vendor.name]));
    
    // Total Orders
    const totalOrders = orders.length;
    
    // Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.paymentAmount || 0), 0);
    
    // Paid Orders
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas").length;
    const paidAmount = orders
      .filter(order => order.paymentStatus === "Lunas")
      .reduce((sum, order) => sum + (order.paymentAmount || 0), 0);
    
    // Pending Orders
    const pendingOrders = orders.filter(order => order.paymentStatus === "Pending").length;
    
    // Urgent orders (with event date within 14 days)
    const urgentOrdersCount = orders.filter(order => {
      if (!order.eventDate) return false;
      
      const today = new Date();
      const eventDate = parseISO(order.eventDate);
      const differenceInDays = Math.round((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return differenceInDays >= 0 && differenceInDays <= 14;
    }).length;
    
    // Payment status chart data
    const paymentStatusData: ChartData[] = [
      { name: "Lunas", value: paidOrders },
      { name: "Pending", value: pendingOrders },
    ];
    
    // Work status chart data
    const workStatusMap = new Map<string, number>();
    
    orders.forEach(order => {
      const status = order.workStatus;
      if (status) {
        workStatusMap.set(status, (workStatusMap.get(status) || 0) + 1);
      }
    });
    
    const workStatusData: ChartData[] = Array.from(workStatusMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    // Vendor distribution chart data
    const vendorOrdersMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.vendor) {
        const vendorName = vendorMap.get(order.vendor) || order.vendor;
        vendorOrdersMap.set(vendorName, (vendorOrdersMap.get(vendorName) || 0) + 1);
      }
    });
    
    const vendorData: ChartData[] = Array.from(vendorOrdersMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    // Vendor payment data with payment status
    const vendorPaymentMap = new Map<string, { paid: number; pending: number }>();
    
    orders.forEach(order => {
      if (order.vendor) {
        const vendorName = vendorMap.get(order.vendor) || order.vendor;
        
        if (!vendorPaymentMap.has(vendorName)) {
          vendorPaymentMap.set(vendorName, { paid: 0, pending: 0 });
        }
        
        const vendorStats = vendorPaymentMap.get(vendorName)!;
        
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
    
    // Top themes data
    const themeMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.theme) {
        themeMap.set(order.theme, (themeMap.get(order.theme) || 0) + 1);
      }
    });
    
    const sortedThemeEntries = Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const topThemesData: ChartData[] = sortedThemeEntries
      .map(([name, value]) => ({ name, value }));
    
    // Top packages data
    const packageMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.package) {
        packageMap.set(order.package, (packageMap.get(order.package) || 0) + 1);
      }
    });
    
    const sortedPackageEntries = Array.from(packageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const topPackagesData: ChartData[] = sortedPackageEntries
      .map(([name, value]) => ({ name, value }));
    
    // Monthly orders data
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    
    const generateMonthlyOrdersData = () => {
      if (selectedMonth === "Semua Data") {
        const monthlyOrdersMap = new Map<number, number>();
        const monthlyRevenueMap = new Map<number, number>();
        
        monthNames.forEach((_, index) => {
          monthlyOrdersMap.set(index, 0);
          monthlyRevenueMap.set(index, 0);
        });

        orders.forEach(order => {
          try {
            const orderDate = new Date(order.orderDate);
            if (selectedYear === "Semua Data" || orderDate.getFullYear().toString() === selectedYear) {
              const month = orderDate.getMonth();
              monthlyOrdersMap.set(month, (monthlyOrdersMap.get(month) || 0) + 1);
              monthlyRevenueMap.set(month, (monthlyRevenueMap.get(month) || 0) + order.paymentAmount);
            }
          } catch (e) {
            console.error("Error parsing date:", order.orderDate);
          }
        });

        return {
          orders: monthNames.map((month, index) => ({
            name: month,
            value: monthlyOrdersMap.get(index) || 0
          })),
          revenue: monthNames.map((month, index) => ({
            name: month,
            value: monthlyRevenueMap.get(index) || 0
          }))
        };
      } else {
        // Daily data for selected month
        const monthIndex = monthNames.findIndex(m => 
          m.toLowerCase() === selectedMonth.substring(0, 3).toLowerCase()
        );
        
        if (monthIndex === -1) return { orders: [], revenue: [] };
        
        const year = parseInt(selectedYear !== "Semua Data" ? selectedYear : new Date().getFullYear().toString());
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        
        const dailyOrdersMap = new Map<number, number>();
        const dailyRevenueMap = new Map<number, number>();

        for (let i = 1; i <= daysInMonth; i++) {
          dailyOrdersMap.set(i, 0);
          dailyRevenueMap.set(i, 0);
        }
        
        orders.forEach(order => {
          try {
            const orderDate = new Date(order.orderDate);
            if (orderDate.getMonth() === monthIndex && 
                (selectedYear === "Semua Data" || orderDate.getFullYear().toString() === selectedYear)) {
              const day = orderDate.getDate();
              dailyOrdersMap.set(day, (dailyOrdersMap.get(day) || 0) + 1);
              dailyRevenueMap.set(day, (dailyRevenueMap.get(day) || 0) + order.paymentAmount);
            }
          } catch (e) {
            console.error("Error parsing date:", order.orderDate);
          }
        });
        
        return {
          orders: Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => ({
            name: day.toString(),
            value: dailyOrdersMap.get(day) || 0
          })),
          revenue: Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => ({
            name: day.toString(),
            value: dailyRevenueMap.get(day) || 0
          }))
        };
      }
    };
    
    const { orders: monthlyOrdersData, revenue: monthlyRevenueData } = generateMonthlyOrdersData();
    
    // Calculate month-to-month changes
    const calculateChange = () => {
      // For now, just mock these values based on existing data
      const totalOrdersChange = 15; // percentage
      const totalRevenueChange = 25; // percentage
      const paidOrdersChange = 20; // percentage
      const pendingOrdersChange = -10; // percentage
      
      return {
        totalOrdersChange,
        totalRevenueChange, 
        paidOrdersChange,
        pendingOrdersChange
      };
    };
    
    const changes = calculateChange();
    
    // Top 5 themes as packages for display in the table
    const topThemes = sortedThemeEntries.slice(0, 5).map(([name, count]) => ({
      name,
      count,
      id: Math.floor(Math.random() * 1000) + 1000, // Mock ID for demonstration
      type: "Tema Undangan"
    }));
    
    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      paidAmount,
      pendingOrders,
      urgentOrdersCount,
      paymentStatusData,
      workStatusData,
      vendorData,
      vendorPaymentData,
      monthlyOrdersData,
      monthlyRevenueData,
      topThemesData,
      topPackagesData,
      changes,
      topThemes
    };
  }, [orders, selectedYear, selectedMonth, vendors]);
  
  // Format currency to IDR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
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
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            className="w-auto"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Pesanan"
              value={`${stats.totalOrders}`}
              icon={<ShoppingBag className="h-5 w-5 text-white" />}
              iconBg="#B87333" // Bronze color for shopping bag
              change={stats.changes.totalOrdersChange}
              description="Dibandingkan bulan lalu"
            />
            <StatCard
              title="Total Penjualan"
              value={formatCurrency(stats.totalRevenue)}
              icon={<ShoppingCart className="h-5 w-5 text-white" />}
              iconBg="#3182CE" // Blue color for shopping cart
              change={stats.changes.totalRevenueChange}
              description="Dibandingkan bulan lalu"
            />
            <StatCard
              title="Pembayaran Lunas"
              value={formatCurrency(stats.paidAmount)}
              icon={<CreditCard className="h-5 w-5 text-white" />}
              iconBg="#38A169" // Green color for credit card
              change={stats.changes.paidOrdersChange}
              description="Dibandingkan bulan lalu"
            />
            <StatCard
              title="Keuntungan"
              value={formatCurrency(stats.totalRevenue * 0.3)} // Assuming 30% profit margin
              icon={<TrendingUp className="h-5 w-5 text-white" />}
              iconBg="#805AD5" // Purple color for trend up
              change={stats.changes.totalRevenueChange}
              description="Dibandingkan bulan lalu"
            />
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
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
                  data={stats.monthlyRevenueData}
                  type="area"
                  isCurrency={true}
                  height={300}
                  showValues={true}
                />
              </CardContent>
            </Card>

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
                  data={stats.topThemesData}
                  type="pie"
                  colors={["#38B2AC", "#4FD1C5", "#81E6D9", "#B2F5EA", "#E6FFFA"]} 
                  height={300}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-xl">Produk Terlaris</CardTitle>
                <CardDescription>
                  Tema dan paket dengan pesanan terbanyak
                </CardDescription>
              </div>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Tambah Produk</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>ID Produk</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Jumlah Pesanan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.topThemes.length > 0 ? (
                      stats.topThemes.map((theme) => (
                        <TableRow key={theme.id}>
                          <TableCell className="font-medium">{theme.name}</TableCell>
                          <TableCell>#{theme.id}</TableCell>
                          <TableCell>Tema Undangan Digital</TableCell>
                          <TableCell>{theme.type}</TableCell>
                          <TableCell>{theme.count}</TableCell>
                          <TableCell className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">Hapus</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          Tidak ada data produk
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
