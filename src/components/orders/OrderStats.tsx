
import React from "react";
import { Order } from "@/types/types";
import { ShoppingCart, DollarSign, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface OrderStatsProps {
  orders: Order[];
  formatCurrency: (amount: number) => string;
}

const OrderStats: React.FC<OrderStatsProps> = ({ orders, formatCurrency }) => {
  // Ensure we convert strings to numbers before adding
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

  // Calculate statistics
  const totalOrders = orders.length;
  
  // Properly calculate total revenue by ensuring numeric values
  let totalRevenue = 0;
  orders.forEach(order => {
    totalRevenue += getNumericAmount(order.paymentAmount);
  });
  
  const paidOrders = orders.filter(order => order.paymentStatus.toLowerCase() === "lunas");
  
  // Calculate paid amount properly
  let paidAmount = 0;
  paidOrders.forEach(order => {
    paidAmount += getNumericAmount(order.paymentAmount);
  });
  
  const unpaidOrders = orders.filter(order => order.paymentStatus.toLowerCase() !== "lunas");
  
  // Calculate unpaid amount properly
  let unpaidAmount = 0;
  unpaidOrders.forEach(order => {
    unpaidAmount += getNumericAmount(order.paymentAmount);
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
      {/* Total Pesanan Card */}
      <div className="rounded-lg p-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex justify-between mb-1">
          <h3 className="text-xs text-blue-700 dark:text-blue-300 font-medium">Total Pesanan</h3>
          <div className="rounded-full w-4 h-4 flex items-center justify-center bg-blue-500 dark:bg-blue-400">
            <ShoppingCart className="w-2 h-2 text-white" />
          </div>
        </div>
        <p className="text-sm md:text-lg font-bold text-blue-800 dark:text-blue-200">{totalOrders}</p>
      </div>
      
      {/* Total Omset Card */}
      <div className="rounded-lg p-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 shadow-sm">
        <div className="flex justify-between mb-1">
          <h3 className="text-xs text-purple-700 dark:text-purple-300 font-medium">Total Omset</h3>
          <div className="rounded-full w-4 h-4 flex items-center justify-center bg-purple-500 dark:bg-purple-400">
            <DollarSign className="w-2 h-2 text-white" />
          </div>
        </div>
        <p className="text-sm md:text-lg font-bold text-purple-800 dark:text-purple-200">{formatCurrency(totalRevenue)}</p>
      </div>
      
      {/* Sudah Lunas Card */}
      <div className="rounded-lg p-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 shadow-sm">
        <div className="flex justify-between mb-1">
          <h3 className="text-xs text-green-700 dark:text-green-300 font-medium">Sudah Lunas</h3>
          <div className="rounded-full w-4 h-4 flex items-center justify-center bg-green-500 dark:bg-green-400">
            <Check className="w-2 h-2 text-white" />
          </div>
        </div>
        <p className="text-xs md:text-sm font-bold text-green-800 dark:text-green-200">
          {paidOrders.length} <span className="text-[10px] md:text-xs font-medium">({formatCurrency(paidAmount)})</span>
        </p>
      </div>
      
      {/* Belum Lunas Card */}
      <div className="rounded-lg p-2 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="flex justify-between mb-1">
          <h3 className="text-xs text-red-700 dark:text-red-300 font-medium">Belum Lunas</h3>
          <div className="rounded-full w-4 h-4 flex items-center justify-center bg-red-500 dark:bg-red-400">
            <X className="w-2 h-2 text-white" />
          </div>
        </div>
        <p className="text-xs md:text-sm font-bold text-red-800 dark:text-red-200">
          {unpaidOrders.length} <span className="text-[10px] md:text-xs font-medium">({formatCurrency(unpaidAmount)})</span>
        </p>
      </div>
    </div>
  );
};

export default OrderStats;
