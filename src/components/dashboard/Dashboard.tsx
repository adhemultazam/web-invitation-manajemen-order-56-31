import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ShoppingCart, DollarSign, Check, X, ChartPie, Wallet, Package, Layers } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { ChartData, MultiBarChartData } from "@/types/types";
import { format, isAfter, parseISO } from "date-fns";
import { useVendorsData } from "@/hooks/useVendorsData";
import { useOrderResources } from "@/hooks/useOrderResources";
import { Button } from "@/components/ui/button";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { formatCurrency } from "@/lib/utils";

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>("Semua Data");
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  
  // Get order data based on filters
  const { orders, isLoading, addOrder } = useOrdersData(selectedYear, selectedMonth);
  const { vendors } = useVendorsData();
  const { workStatuses, addons, themes, packages } = useOrderResources();
  
  // Helper function to ensure amounts are processed safely
  const getNumericAmount = (amount: any): number => {
    if (typeof amount === 'number' && !isNaN(amount)) {
      return amount;
    }
    if (typeof amount === 'string' && amount.trim() !== '') {
      const numericAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
      return !isNaN(numericAmount) ? numericAmount : 0;
    }
    return 0;
  };
  
  // Calculate statistics from order data
  const stats = useMemo(() => {
    // Map vendor ID to vendor name
    const vendorMap = new Map(vendors.map(vendor => [vendor.id, vendor.name]));
    
    // Total Orders
    const totalOrders = orders.length;
    
    // Calculate total revenue correctly
    let totalRevenue = 0;
    orders.forEach(order => {
      totalRevenue += getNumericAmount(order.paymentAmount);
    });
    
    // Paid orders
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas");
    const paidOrdersCount = paidOrders.length;
    
    // Calculate paid revenue correctly
    let paidRevenue = 0;
    paidOrders.forEach(order => {
      paidRevenue += getNumericAmount(order.paymentAmount);
    });
    
    // Pending orders
    const pendingOrders = orders.filter(order => order.paymentStatus === "Pending");
    const pendingOrdersCount = pendingOrders.length;
    
    // Calculate pending revenue correctly
    let pendingRevenue = 0;
    pendingOrders.forEach(order => {
      pendingRevenue += getNumericAmount(order.paymentAmount);
    });
    
    // Orders that need to be completed (with event date within 14 days)
    const urgentOrdersCount = orders.filter(order => {
      if (!order.eventDate) return false;
      
      const today = new Date();
      const eventDate = parseISO(order.eventDate);
      const differenceInDays = Math.round((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      return differenceInDays >= 0 && differenceInDays <= 14;
    }).length;
    
    // Data for payment status chart
    const paymentStatusData: ChartData[] = [
      { name: "Lunas", value: paidOrdersCount },
      { name: "Pending", value: pendingOrdersCount },
    ];
    
    // Data for work status chart
    const workStatusMap = new Map<string, number>();
    
    orders.forEach(order => {
      const status = order.workStatus;
      if (status) {
        workStatusMap.set(status, (workStatusMap.get(status) || 0) + 1);
      }
    });
    
    const workStatusData: ChartData[] = Array.from(workStatusMap.entries())
      .map(([name, value]) => ({ name, value }));
    
    // Data for vendor distribution chart
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
    
    // Data for vendor payment chart with payment status
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
        const numericAmount = getNumericAmount(order.paymentAmount);
        
        if (order.paymentStatus === "Lunas") {
          vendorStats.paid += numericAmount;
        } else {
          vendorStats.pending += numericAmount;
        }
      }
    });
    
    const vendorPaymentData: MultiBarChartData[] = Array.from(vendorPaymentMap.entries())
      .map(([name, stats]) => ({ 
        name, 
        paid: stats.paid, 
        pending: stats.pending 
      }));
    
    // Data for best selling themes
    const themeMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.theme) {
        themeMap.set(order.theme, (themeMap.get(order.theme) || 0) + 1);
      }
    });
    
    // Sort themes by order count (descending)
    const sortedThemeEntries = Array.from(themeMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Get top 5 themes
    
    const topThemesData: ChartData[] = sortedThemeEntries
      .map(([name, value]) => ({ name, value }));
    
    // Data for best selling packages
    const packageMap = new Map<string, number>();
    
    orders.forEach(order => {
      if (order.package) {
        packageMap.set(order.package, (packageMap.get(order.package) || 0) + 1);
      }
    });
    
    // Sort packages by order count (descending)
    const sortedPackageEntries = Array.from(packageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Get top 5 packages
    
    const topPackagesData: ChartData[] = sortedPackageEntries
      .map(([name, value]) => ({ name, value }));
    
    // Data for monthly orders chart
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
  
  // Handle modal states
  const handleOpenAddOrderModal = () => setIsAddOrderModalOpen(true);
  const handleCloseAddOrderModal = () => setIsAddOrderModalOpen(false);

  // Get recent orders (last 5)
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(0, 5);
  }, [orders]);

  // Get filter description for stat cards
  const getFilterDescription = () => {
    if (selectedYear === "Semua Data" && selectedMonth === "Semua Data") {
      return "Semua Data";
    } else if (selectedMonth === "Semua Data") {
      return `Tahun ${selectedYear}`;
    } else if (selectedYear === "Semua Data") {
      return `Bulan ${selectedMonth}`;
    } else {
      return `${selectedMonth} ${selectedYear}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview dari pesanan undangan digital Anda
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <FilterBar
            onYearChange={setSelectedYear}
            onMonthChange={setSelectedMonth}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            className="w-full lg:w-auto"
          />
          <Button className="bg-wedding-primary hover:bg-wedding-accent" onClick={handleOpenAddOrderModal}>
            Tambah Pesanan
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            <StatCard
              title="Total Pesanan"
              value={stats.totalOrders}
              icon={<ShoppingCart className="h-3 w-3 text-white" />}
              description={getFilterDescription()}
            />
            <StatCard
              title="Total Omset"
              value={formatCurrency(stats.totalRevenue)}
              icon={<DollarSign className="h-3 w-3 text-white" />}
              description={`${stats.totalOrders} pesanan`}
              type="warning"
            />
            <StatCard
              title="Sudah Lunas"
              value={stats.paidOrdersCount}
              icon={<Check className="h-3 w-3 text-white" />}
              description={formatCurrency(stats.paidRevenue)}
              type="success"
            />
            <StatCard
              title="Belum Lunas"
              value={stats.pendingOrdersCount}
              icon={<X className="h-3 w-3 text-white" />}
              description={formatCurrency(stats.pendingRevenue)}
              type="danger"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCard
                title={selectedMonth === "Semua Data" ? "Pesanan Per Bulan" : `Pesanan Harian (${selectedMonth})`}
                data={stats.monthlyOrdersData}
                type="line"
              />
            </div>
            <ChartCard
              title="Status Pembayaran"
              data={stats.paymentStatusData}
              type="pie"
              colors={["#9A84FF", "#F97316"]} // Primary for paid, Orange for pending
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Distribusi Vendor"
              data={stats.vendorData}
              type="pie"
              colors={["#9A84FF", "#A990FF", "#B89CFF", "#C7A8FF", "#D5B4FF"]}
              icon={<ChartPie className="h-4 w-4" />}
            />
            <ChartCard
              title="Status Pengerjaan"
              data={stats.workStatusData}
              type="pie"
              colors={["#9A84FF", "#60A5FA", "#F59E0B", "#EC4899"]}
            />
          </div>

          {/* Theme and package charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Tema Terlaris"
              description="5 tema paling banyak dipesan"
              data={stats.topThemesData}
              type="bar"
              colors={["#9A84FF", "#A990FF", "#B89CFF", "#C7A8FF", "#D5B4FF"]} 
              icon={<Layers className="h-4 w-4" />}
            />
            <ChartCard
              title="Paket Terlaris"
              description="5 paket paling banyak dipesan"
              data={stats.topPackagesData}
              type="bar"
              colors={["#9A84FF", "#A990FF", "#B89CFF", "#C7A8FF", "#D5B4FF"]} 
              icon={<Package className="h-4 w-4" />}
            />
          </div>

          {/* Vendor payment chart */}
          <div className="grid gap-4">
            <ChartCard
              title="Pembayaran Per Vendor"
              data={stats.vendorPaymentData}
              type="multiBar"
              isCurrency={true}
              barKeys={[
                { key: "paid", color: "#9A84FF" }, // Primary for paid
                { key: "pending", color: "#F97316" } // Orange for pending
              ]}
              icon={<Wallet className="h-4 w-4" />}
            />
          </div>
        </>
      )}
      
      {/* Order modal */}
      {isAddOrderModalOpen && (
        <AddOrderModal
          isOpen={isAddOrderModalOpen}
          onClose={handleCloseAddOrderModal}
          onAddOrder={(order) => {
            addOrder(order);
            handleCloseAddOrderModal();
          }}
          vendors={vendors.map(v => v.id)}
          workStatuses={workStatuses.map(ws => ws.name)}
          addons={addons}
          themes={themes}
          packages={packages}
        />
      )}
    </div>
  );
}
