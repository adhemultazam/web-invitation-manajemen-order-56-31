
import { useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Order } from "@/types/types";
import { ShoppingCart, DollarSign, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MonthlyStatsProps {
  orders: Order[];
  month: string;
}

export function MonthlyStats({ orders, month }: MonthlyStatsProps) {
  // Helper function to ensure values are numeric
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
  
  // Calculate statistics based on orders data
  const stats = useMemo(() => {
    // Total orders
    const totalOrders = orders.length;
    
    // Reset the accumulated values
    let totalRevenue = 0;
    
    // Calculate total revenue properly, ensuring we use valid numbers
    orders.forEach(order => {
      totalRevenue += getNumericAmount(order.paymentAmount);
    });
    
    // Paid orders
    const paidOrders = orders.filter(order => order.paymentStatus === "Lunas");
    const paidOrdersCount = paidOrders.length;
    
    // Total revenue from paid orders
    let paidRevenue = 0;
    paidOrders.forEach(order => {
      paidRevenue += getNumericAmount(order.paymentAmount);
    });
    
    // Unpaid orders
    const unpaidOrders = orders.filter(order => order.paymentStatus === "Pending");
    const unpaidOrdersCount = unpaidOrders.length;
    
    // Total unpaid revenue
    let unpaidRevenue = 0;
    unpaidOrders.forEach(order => {
      unpaidRevenue += getNumericAmount(order.paymentAmount);
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
    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mb-4">
      <StatCard
        title="Total Pesanan"
        value={stats.totalOrders}
        icon={<ShoppingCart className="h-3 w-3 text-white" />}
        description={`Bulan ${month}`}
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
        value={stats.unpaidOrdersCount}
        icon={<X className="h-3 w-3 text-white" />}
        description={formatCurrency(stats.unpaidRevenue)}
        type="danger"
      />
    </div>
  );
}
