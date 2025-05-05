
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
  // Add debug log
  console.log("OrderSelectionTable rendering with orders:", orders.length);
  
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
      <Table compact className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Tgl Pesanan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id} className="h-10">
                <TableCell className="py-1.5">
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) =>
                      onOrderSelection(order.id, !!checked)
                    }
                    className="h-4 w-4"
                  />
                </TableCell>
                <TableCell className="font-mono text-xs py-1.5">{order.id.substring(0, 8)}</TableCell>
                <TableCell className="py-1.5 text-xs">{order.clientName}</TableCell>
                <TableCell className="py-1.5 text-xs">{format(new Date(order.orderDate), "dd MMM yyyy")}</TableCell>
                <TableCell className="py-1.5">
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 text-[11px] py-0.5 px-2">
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium py-1.5 text-xs">
                  <InvoiceCurrency amount={getNumericAmount(order.paymentAmount)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                Tidak ada pesanan untuk vendor ini
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
