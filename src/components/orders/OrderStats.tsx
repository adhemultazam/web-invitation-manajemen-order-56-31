
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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {/* Total Pesanan Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 flex flex-col shadow-sm border border-blue-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Pesanan</div>
          <div className="bg-blue-100 dark:bg-gray-600 p-1.5 rounded-lg">
            <ShoppingCart className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
          </div>
        </div>
        <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalOrders}</div>
      </div>
      
      {/* Total Omset Card */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 flex flex-col shadow-sm border border-purple-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Total Omset</div>
          <div className="bg-purple-100 dark:bg-gray-600 p-1.5 rounded-lg">
            <DollarSign className="h-3.5 w-3.5 text-purple-600 dark:text-purple-300" />
          </div>
        </div>
        <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(totalRevenue)}</div>
      </div>
      
      {/* Sudah Lunas Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 flex flex-col shadow-sm border border-green-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Sudah Lunas</div>
          <div className="bg-green-100 dark:bg-gray-600 p-1.5 rounded-lg">
            <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-300" />
          </div>
        </div>
        <div className="text-2xl font-bold text-green-700 dark:text-green-300">
          {paidOrders.length} <span className="text-sm font-medium">({formatCurrency(paidAmount)})</span>
        </div>
      </div>
      
      {/* Belum Lunas Card */}
      <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 flex flex-col shadow-sm border border-red-100 dark:border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">Belum Lunas</div>
          <div className="bg-red-100 dark:bg-gray-600 p-1.5 rounded-lg">
            <X className="h-3.5 w-3.5 text-red-600 dark:text-red-300" />
          </div>
        </div>
        <div className="text-2xl font-bold text-red-700 dark:text-red-300">
          {unpaidOrders.length} <span className="text-sm font-medium">({formatCurrency(unpaidAmount)})</span>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
