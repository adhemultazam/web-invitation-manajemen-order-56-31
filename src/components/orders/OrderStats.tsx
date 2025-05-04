
import React from "react";
import { Order } from "@/types/types";
import { DollarSign, Check, X, ShoppingCart } from "lucide-react";

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
    <div className="grid grid-cols-4 gap-3 mb-4">
      {/* Total Pesanan Card */}
      <div className="rounded-lg p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800 shadow-sm">
        <div className="flex justify-between mb-2">
          <h3 className="text-xs text-blue-700 dark:text-blue-300 font-medium">Total Pesanan</h3>
          <div className="rounded-full w-6 h-6 flex items-center justify-center bg-blue-500 dark:bg-blue-400">
            <ShoppingCart className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalOrders}</p>
      </div>
      
      {/* Total Omset Card */}
      <div className="rounded-lg p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800 shadow-sm">
        <div className="flex justify-between mb-2">
          <h3 className="text-xs text-purple-700 dark:text-purple-300 font-medium">Total Omset</h3>
          <div className="rounded-full w-6 h-6 flex items-center justify-center bg-purple-500 dark:bg-purple-400">
            <DollarSign className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{formatCurrency(totalRevenue)}</p>
      </div>
      
      {/* Sudah Lunas Card */}
      <div className="rounded-lg p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800 shadow-sm">
        <div className="flex justify-between mb-2">
          <h3 className="text-xs text-green-700 dark:text-green-300 font-medium">Sudah Lunas</h3>
          <div className="rounded-full w-6 h-6 flex items-center justify-center bg-green-500 dark:bg-green-400">
            <Check className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xl font-bold text-green-800 dark:text-green-200">
          {paidOrders.length} <span className="text-sm font-medium">({formatCurrency(paidAmount)})</span>
        </p>
      </div>
      
      {/* Belum Lunas Card */}
      <div className="rounded-lg p-3 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800 shadow-sm">
        <div className="flex justify-between mb-2">
          <h3 className="text-xs text-red-700 dark:text-red-300 font-medium">Belum Lunas</h3>
          <div className="rounded-full w-6 h-6 flex items-center justify-center bg-red-500 dark:bg-red-400">
            <X className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-xl font-bold text-red-800 dark:text-red-200">
          {unpaidOrders.length} <span className="text-sm font-medium">({formatCurrency(unpaidAmount)})</span>
        </p>
      </div>
    </div>
  );
};

export default OrderStats;
