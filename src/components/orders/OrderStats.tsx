
import React from "react";
import { Order } from "@/types/types";
import { DollarSign, Check, X } from "lucide-react";

interface OrderStatsProps {
  orders: Order[];
  formatCurrency: (amount: number) => string;
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders, formatCurrency }) => {
  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((total, order) => total + order.paymentAmount, 0);
  
  const paidOrders = orders.filter(order => order.paymentStatus.toLowerCase() === "lunas");
  const paidAmount = paidOrders.reduce((total, order) => total + order.paymentAmount, 0);
  
  const unpaidOrders = orders.filter(order => order.paymentStatus.toLowerCase() !== "lunas");
  const unpaidAmount = unpaidOrders.reduce((total, order) => total + order.paymentAmount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      {/* Total Pesanan Card */}
      <div className="bg-white dark:bg-gray-800 border rounded-md p-4 flex flex-col">
        <div className="text-sm text-muted-foreground mb-1">Total Pesanan</div>
        <div className="text-2xl font-bold">{totalOrders}</div>
      </div>
      
      {/* Total Omset Card */}
      <div className="bg-white dark:bg-gray-800 border rounded-md p-4 flex flex-col">
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div className="text-sm text-muted-foreground">Total Omset</div>
        </div>
        <div className="text-2xl font-bold text-wedding-primary">{formatCurrency(totalRevenue)}</div>
      </div>
      
      {/* Sudah Lunas Card */}
      <div className="bg-white dark:bg-gray-800 border rounded-md p-4 flex flex-col">
        <div className="flex items-center gap-1">
          <Check className="h-4 w-4 text-green-500" />
          <div className="text-sm text-muted-foreground">Sudah Lunas</div>
        </div>
        <div className="text-2xl font-bold text-green-500">
          {paidOrders.length} ({formatCurrency(paidAmount)})
        </div>
      </div>
      
      {/* Belum Lunas Card */}
      <div className="bg-white dark:bg-gray-800 border rounded-md p-4 flex flex-col">
        <div className="flex items-center gap-1">
          <X className="h-4 w-4 text-red-500" />
          <div className="text-sm text-muted-foreground">Belum Lunas</div>
        </div>
        <div className="text-2xl font-bold text-red-500">
          {unpaidOrders.length} ({formatCurrency(unpaidAmount)})
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
