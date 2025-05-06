
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { format, formatDistance, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface CompactOrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  compact?: boolean;
}

export function CompactOrdersTable({
  orders,
  onEditOrder,
  onDeleteOrder,
  compact = true,
}: CompactOrdersTableProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderStatuses, setOrderStatuses] = useState<{[key: string]: string}>({});

  // Update current time every minute to refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Every minute
    return () => clearInterval(timer);
  }, []);
  
  // Calculate countdown for each order when current time changes
  useEffect(() => {
    const statuses: {[key: string]: string} = {};
    
    orders.forEach(order => {
      if (order.eventDate) {
        try {
          const eventDate = parseISO(order.eventDate);
          const today = new Date();
          
          // Calculate days difference
          const differenceInDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (differenceInDays < 0) {
            // Past event
            statuses[order.id] = "Selesai";
          } else if (differenceInDays === 0) {
            // Today
            statuses[order.id] = "Hari ini";
          } else if (differenceInDays <= 3) {
            // Urgent (3 days or less)
            statuses[order.id] = `${differenceInDays}h`;
          } else if (differenceInDays <= 14) {
            // Warning (14 days or less)
            statuses[order.id] = `${differenceInDays}h`;
          } else {
            // Normal
            statuses[order.id] = `${differenceInDays}h`;
          }
        } catch (error) {
          console.error("Error parsing event date:", error);
          statuses[order.id] = "-";
        }
      } else {
        statuses[order.id] = "-";
      }
    });
    
    setOrderStatuses(statuses);
  }, [orders, currentTime]);

  // Helper function to get the appropriate CSS class for the countdown badge
  const getCountdownClass = (orderId: string) => {
    const status = orderStatuses[orderId];
    if (!status || status === "-") return "bg-gray-100 text-gray-500";
    
    if (status === "Selesai") return "bg-gray-100 text-gray-500";
    if (status === "Hari ini") return "bg-red-100 text-red-800";
    
    // Extract the number part from strings like "3h"
    const daysMatch = status.match(/^(\d+)h/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      if (days <= 3) return "bg-red-100 text-red-800";
      if (days <= 14) return "bg-amber-100 text-amber-800";
    }
    
    return "bg-green-100 text-green-800";
  };

  // Format currency for payment amount
  const formatCurrency = (amount: any): string => {
    // Ensure we have a number
    if (typeof amount === 'number' && !isNaN(amount)) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    }
    
    if (typeof amount === 'string') {
      try {
        const numericAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
        if (!isNaN(numericAmount)) {
          return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(numericAmount);
        }
      } catch (e) {
        console.error("Error formatting currency:", e);
      }
    }
    
    return "Rp -";
  };

  // Sort orders by date 
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
    const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
    return dateB - dateA; // Descending (newest first)
  });
  
  return (
    <div className="compact-table">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Tema</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Pembayaran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.length > 0 ? (
            sortedOrders.map((order) => (
              <TableRow key={order.id} className="h-12">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{order.clientName}</span>
                    <span className="text-xs text-muted-foreground">
                      {order.orderDate ? format(new Date(order.orderDate), "dd MMM yyyy") : "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm">{order.theme || "-"}</span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Badge 
                      variant="outline" 
                      className={`${getCountdownClass(order.id)} text-[9px] px-1.5 py-0.5 min-w-[24px]`}
                    >
                      {orderStatuses[order.id] || "-"}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground mt-0.5">
                      {order.workStatus || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-medium">
                      {formatCurrency(order.paymentAmount)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`text-[9px] px-1.5 py-0.5 mt-0.5 ${
                        order.paymentStatus === "Lunas" 
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
