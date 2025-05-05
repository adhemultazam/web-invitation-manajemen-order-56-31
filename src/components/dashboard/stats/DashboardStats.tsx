
import { useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ShoppingBag, ShoppingCart, CreditCard, TrendingUp } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { useVendorsData } from "@/hooks/useVendorsData";

interface DashboardStatsProps {
  selectedYear: string;
  selectedMonth: string;
}

export function DashboardStats({ selectedYear, selectedMonth }: DashboardStatsProps) {
  // Fetch orders data based on filters
  const { orders, isLoading } = useOrdersData(selectedYear, selectedMonth);
  const { vendors } = useVendorsData();

  // Calculate stats from orders data
  const stats = useMemo(() => {
    // Total Orders
    const totalOrders = orders.length;
    
    // Total Revenue
    const totalRevenue = orders.reduce((sum, order) => sum + (order.paymentAmount || 0), 0);
    
    // Paid Orders
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas").length;
    const paidAmount = orders
      .filter(order => order.paymentStatus === "Lunas")
      .reduce((sum, order) => sum + (order.paymentAmount || 0), 0);
    
    // Calculate month-to-month changes (mock values for now)
    const totalOrdersChange = 15; // percentage
    const totalRevenueChange = 25; // percentage
    const paidOrdersChange = 20; // percentage
    
    return {
      totalOrders,
      totalRevenue,
      paidAmount,
      changes: {
        totalOrdersChange,
        totalRevenueChange,
        paidOrdersChange,
      }
    };
  }, [orders]);
  
  // Format currency to IDR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-primary"></div>
      </div>
    );
  }

  return (
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
  );
}
