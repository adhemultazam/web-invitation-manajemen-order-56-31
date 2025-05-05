
import { useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Order } from "@/types/types";
import { Calendar, CreditCard, DollarSign, Check } from "lucide-react";

interface MonthlyStatsProps {
  orders: Order[];
  month: string;
}

export function MonthlyStats({ orders, month }: MonthlyStatsProps) {
  // Hitung statistik berdasarkan data pesanan
  const stats = useMemo(() => {
    // Total pesanan
    const totalOrders = orders.length;
    
    // Total pendapatan berdasarkan paymentAmount di setiap pesanan
    const totalRevenue = orders.reduce((total, order) => total + (order.paymentAmount || 0), 0);
    
    // Pesanan yang sudah lunas
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas");
    const paidOrdersCount = paidOrders.length;
    
    // Total pendapatan dari pesanan yang sudah lunas
    const paidRevenue = paidOrders.reduce((total, order) => total + (order.paymentAmount || 0), 0);
    
    // Pesanan yang belum lunas
    const unpaidOrders = orders.filter(order => order.paymentStatus === "Pending");
    const unpaidOrdersCount = unpaidOrders.length;
    
    // Total pendapatan yang belum diterima
    const unpaidRevenue = unpaidOrders.reduce((total, order) => total + (order.paymentAmount || 0), 0);
    
    return {
      totalOrders,
      totalRevenue,
      paidOrdersCount,
      paidRevenue,
      unpaidOrdersCount,
      unpaidRevenue
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <StatCard
        title="Total Pesanan"
        value={`${stats.totalOrders}`}
        icon={<Calendar className="h-4 w-4" />}
        description={`Bulan ${month}`}
      />
      <StatCard
        title="Total Omset"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="h-4 w-4" />}
        description={`${stats.totalOrders} pesanan`}
      />
      <StatCard
        title="Sudah Lunas"
        value={`${stats.paidOrdersCount}`}
        icon={<Check className="h-4 w-4" />}
        description={`(${formatCurrency(stats.paidRevenue)})`}
      />
      <StatCard
        title="Belum Lunas"
        value={`${stats.unpaidOrdersCount}`}
        icon={<CreditCard className="h-4 w-4" />}
        description={`(${formatCurrency(stats.unpaidRevenue)})`}
        type="danger"
      />
    </div>
  );
}
