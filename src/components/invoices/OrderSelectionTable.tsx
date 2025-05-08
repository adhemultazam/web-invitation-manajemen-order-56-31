
import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/types";
import { InvoiceCurrency } from "./InvoiceCurrency";
import { cn } from "@/lib/utils";

interface OrderSelectionTableProps {
  orders: Order[];
  selectedOrders: string[];
  onOrderSelection: (orderId: string, checked: boolean) => void;
}

export function OrderSelectionTable({ 
  orders, 
  selectedOrders, 
  onOrderSelection 
}: OrderSelectionTableProps) {
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
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table className="w-full font-inter">
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="w-12 py-3 px-4"></TableHead>
            <TableHead className="py-3 px-4">ID</TableHead>
            <TableHead className="py-3 px-4">Client</TableHead>
            <TableHead className="py-3 px-4">Tgl Pesanan</TableHead>
            <TableHead className="py-3 px-4">Status</TableHead>
            <TableHead className="text-right py-3 px-4">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id} className="h-12">
                <TableCell className="py-2.5 px-4">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) =>
                      onOrderSelection(order.id, !!checked)
                    }
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell className={cn("font-mono text-xs py-2.5 px-4", "font-inter")}>
                  {order.id.substring(0, 8)}
                </TableCell>
                <TableCell className="py-2.5 px-4 text-sm">{order.clientName}</TableCell>
                <TableCell className="py-2.5 px-4 text-xs">
                  {format(new Date(order.orderDate), "dd MMM yyyy")}
                </TableCell>
                <TableCell className="py-2.5 px-4">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-[11px] py-0.5 px-2 font-medium">
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium py-2.5 px-4 text-xs">
                  <InvoiceCurrency amount={getNumericAmount(order.paymentAmount)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-5 text-muted-foreground">
                Tidak ada pesanan untuk vendor ini
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
