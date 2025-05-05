
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
    
    // Reset the accumulated values
    let totalRevenue = 0;
    
    // Calculate total revenue properly, ensuring we use valid numbers
    orders.forEach(order => {
      // Parse to float to ensure we're dealing with numbers, not strings
      const amount = parseFloat(order.paymentAmount as any) || 0;
      
      // Make sure we're adding a valid number
      if (!isNaN(amount) && isFinite(amount)) {
        totalRevenue += amount;
      }
    });
    
    // Pesanan yang sudah lunas
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas");
    const paidOrdersCount = paidOrders.length;
    
    // Total pendapatan dari pesanan yang sudah lunas
    let paidRevenue = 0;
    paidOrders.forEach(order => {
      // Parse to float to ensure we're dealing with numbers, not strings
      const amount = parseFloat(order.paymentAmount as any) || 0;
      
      if (!isNaN(amount) && isFinite(amount)) {
        paidRevenue += amount;
      }
    });
    
    // Pesanan yang belum lunas
    const unpaidOrders = orders.filter(order => order.paymentStatus === "Pending");
    const unpaidOrdersCount = unpaidOrders.length;
    
    // Total pendapatan yang belum diterima
    let unpaidRevenue = 0;
    unpaidOrders.forEach(order => {
      // Parse to float to ensure we're dealing with numbers, not strings
      const amount = parseFloat(order.paymentAmount as any) || 0;
      
      if (!isNaN(amount) && isFinite(amount)) {
        unpaidRevenue += amount;
      }
    });
    
    return {
      totalOrders,
      totalRevenue,
      paidOrdersCount,
      paidRevenue,
      unpaidOrdersCount,
      unpaidRevenue
    };
  }, [orders]);
  
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
        value={stats.totalRevenue}
        icon={<DollarSign className="h-4 w-4" />}
        description={`${stats.totalOrders} pesanan`}
      />
      <StatCard
        title="Sudah Lunas"
        value={`${stats.paidOrdersCount}`}
        icon={<Check className="h-4 w-4" />}
        description={stats.paidRevenue > 0 ? stats.paidRevenue : "(Rp 0)"}
        type="success"
      />
      <StatCard
        title="Belum Lunas"
        value={`${stats.unpaidOrdersCount}`}
        icon={<CreditCard className="h-4 w-4" />}
        description={stats.unpaidRevenue > 0 ? stats.unpaidRevenue : "(Rp 0)"}
        type="danger"
      />
    </div>
  );
}
