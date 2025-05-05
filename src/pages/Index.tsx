
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, BarChart3, Banknote, Package2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { Button } from "@/components/ui/button";
import { Order, ChartDataArray } from "@/types/types";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear().toString();
  const currentMonthIndex = new Date().getMonth();
  
  // Define month names
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const currentMonthName = monthNames[currentMonthIndex];
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    upcomingEvents: 0,
  });
  
  // Chart data states
  const [monthlyOrdersData, setMonthlyOrdersData] = useState<ChartDataArray>([]);
  const [packageDistribution, setPackageDistribution] = useState<ChartDataArray>([]);
  const [vendorDistribution, setVendorDistribution] = useState<ChartDataArray>([]);
  const [workStatusDistribution, setWorkStatusDistribution] = useState<ChartDataArray>([]);

  // Mapping between month names in Indonesian and their indices
  const monthMapping: Record<string, number> = {
    "Januari": 0,
    "Februari": 1,
    "Maret": 2,
    "April": 3,
    "Mei": 4,
    "Juni": 5,
    "Juli": 6,
    "Agustus": 7,
    "September": 8,
    "Oktober": 9,
    "November": 10,
    "Desember": 11,
    "Semua Data": -1,
  };

  // Load all orders from all months
  useEffect(() => {
    const months = [
      "januari", "februari", "maret", "april", "mei", "juni",
      "juli", "agustus", "september", "oktober", "november", "desember"
    ];
    
    const allOrders: Order[] = [];
    
    months.forEach(month => {
      try {
        const storageKey = `orders_${month}`;
        const ordersFromStorage = localStorage.getItem(storageKey);
        if (ordersFromStorage) {
          const ordersData = JSON.parse(ordersFromStorage);
          if (Array.isArray(ordersData)) {
            allOrders.push(...ordersData);
          }
        }
      } catch (error) {
        console.error(`Error loading orders for ${month}:`, error);
      }
    });
    
    setOrders(allOrders);
    console.log(`Loaded ${allOrders.length} orders from all months`);
  }, []);

  // Filter orders based on selected year and month
  const filteredOrders = orders.filter(order => {
    if (!order.orderDate) return false;
    
    const orderDate = new Date(order.orderDate);
    const orderYear = orderDate.getFullYear().toString();
    const orderMonth = orderDate.getMonth();
    
    // Year filter
    const yearMatch = selectedYear === "Semua Data" || orderYear === selectedYear;
    
    // Month filter
    const monthMatch = selectedMonth === "Semua Data" || orderMonth === monthMapping[selectedMonth];
    
    return yearMatch && monthMatch;
  });

  // Calculate stats based on filtered orders
  useEffect(() => {
    if (filteredOrders.length === 0) {
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        upcomingEvents: 0,
      });
      
      // Reset chart data as well
      setMonthlyOrdersData([]);
      setPackageDistribution([]);
      setVendorDistribution([]);
      setWorkStatusDistribution([]);
      return;
    }
    
    const totalOrders = filteredOrders.length;
    
    const totalRevenue = filteredOrders.reduce((sum, order) => {
      return sum + (order.paymentAmount || 0);
    }, 0);
    
    const pendingPayments = filteredOrders.filter(
      order => order.paymentStatus === "Pending"
    ).length;
    
    const now = new Date();
    const upcomingEvents = filteredOrders.filter(order => {
      if (!order.eventDate) return false;
      const eventDate = new Date(order.eventDate);
      return eventDate > now && eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }).length;
    
    setStats({
      totalOrders,
      totalRevenue,
      pendingPayments,
      upcomingEvents,
    });
  }, [filteredOrders]);

  // Prepare chart data
  useEffect(() => {
    if (filteredOrders.length === 0) {
      setMonthlyOrdersData([]);
      setPackageDistribution([]);
      setVendorDistribution([]);
      setWorkStatusDistribution([]);
      return;
    }
    
    // Monthly orders data
    const ordersByMonth: Record<string, number> = {};
    const monthNamesShort = [
      "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
      "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
    ];
    
    filteredOrders.forEach(order => {
      if (!order.orderDate) return;
      
      const date = new Date(order.orderDate);
      const monthIdx = date.getMonth();
      const monthName = monthNamesShort[monthIdx];
      
      if (!ordersByMonth[monthName]) {
        ordersByMonth[monthName] = 0;
      }
      
      ordersByMonth[monthName]++;
    });
    
    const monthlyData = Object.entries(ordersByMonth)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const monthOrder = monthNamesShort.indexOf(a.name) - monthNamesShort.indexOf(b.name);
        return monthOrder;
      });
    
    setMonthlyOrdersData(monthlyData);
    
    // Package distribution
    const packageCounts: Record<string, number> = {};
    
    filteredOrders.forEach(order => {
      const packageName = order.package || "Tidak ada paket";
      
      if (!packageCounts[packageName]) {
        packageCounts[packageName] = 0;
      }
      
      packageCounts[packageName]++;
    });
    
    const packageData = Object.entries(packageCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setPackageDistribution(packageData);
    
    // Vendor distribution
    const vendorCounts: Record<string, number> = {};
    
    filteredOrders.forEach(order => {
      const vendorName = order.vendor || "Tidak ada vendor";
      
      if (!vendorCounts[vendorName]) {
        vendorCounts[vendorName] = 0;
      }
      
      vendorCounts[vendorName]++;
    });
    
    const vendorData = Object.entries(vendorCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setVendorDistribution(vendorData);
    
    // Work status distribution
    const statusCounts: Record<string, number> = {};
    
    filteredOrders.forEach(order => {
      const status = order.workStatus || "Tidak ada status";
      
      if (!statusCounts[status]) {
        statusCounts[status] = 0;
      }
      
      statusCounts[status]++;
    });
    
    const statusData = Object.entries(statusCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    setWorkStatusDistribution(statusData);
    
  }, [filteredOrders]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const navigateToMonth = (month: string) => {
    navigate(`/bulan/${month.toLowerCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan pesanan dan pendapatan undangan digital
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => navigateToMonth("januari")}>
            Lihat Pesanan
          </Button>
        </div>
      </div>

      <FilterBar
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        className="bg-muted p-4 rounded-lg"
      />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold">Belum Ada Data</h2>
          <p className="text-muted-foreground mb-6">
            Belum ada pesanan untuk periode yang dipilih
          </p>
          <Button onClick={() => toast.info("Tambahkan pesanan baru di halaman bulan")}>
            Tambah Pesanan
          </Button>
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Pesanan"
              value={stats.totalOrders.toString()}
              icon={<Calendar className="h-4 w-4" />}
              description={`${selectedYear}${selectedMonth !== "Semua Data" ? ` - ${selectedMonth}` : ''}`}
            />
            <StatCard
              title="Total Pendapatan"
              value={formatCurrency(stats.totalRevenue)}
              icon={<Banknote className="h-4 w-4" />}
              description={`${selectedYear}${selectedMonth !== "Semua Data" ? ` - ${selectedMonth}` : ''}`}
            />
            <StatCard
              title="Pembayaran Tertunda"
              value={stats.pendingPayments.toString()}
              icon={<Package2 className="h-4 w-4" />}
              description="Pesanan dengan status Pending"
            />
            <StatCard
              title="Acara dalam 30 Hari"
              value={stats.upcomingEvents.toString()}
              icon={<Calendar className="h-4 w-4" />}
              description="Acara dalam 30 hari ke depan"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Pesanan per Bulan"
              type="bar"
              data={monthlyOrdersData}
            />
            <ChartCard
              title="Distribusi Paket"
              type="pie"
              data={packageDistribution}
              colors={["#7484D3", "#8F9AD9", "#AAB0DF", "#C5C9E5", "#E0E2EB"]}
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <ChartCard
              title="Distribusi Vendor"
              type="pie"
              data={vendorDistribution}
              colors={["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF", "#A0C4FF", "#BDB2FF", "#FFC6FF"]}
            />
            <ChartCard
              title="Status Pengerjaan"
              type="pie"
              data={workStatusDistribution}
              colors={["#FFD700", "#FF7A00", "#FF0060", "#00C853", "#6A7FDB", "#8338EC"]}
            />
          </div>
        </>
      )}
    </div>
  );
}
