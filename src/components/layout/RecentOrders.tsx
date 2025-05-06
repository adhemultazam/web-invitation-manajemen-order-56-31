
import { useState, useEffect } from "react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactOrdersTable } from "@/components/orders/CompactOrdersTable";

interface RecentOrdersProps {
  className?: string;
}

export function RecentOrders({ className }: RecentOrdersProps) {
  const currentYear = new Date().getFullYear().toString();
  const { orders } = useOrdersData(currentYear, "Semua Data");
  
  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  return (
    <Card className={`shadow-card rounded-xl ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-800 font-poppins">Pesanan Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <CompactOrdersTable
          orders={recentOrders}
          onEditOrder={(order) => console.log("Edit order", order.id)}
          onDeleteOrder={(id) => console.log("Delete order", id)}
        />
      </CardContent>
    </Card>
  );
}
