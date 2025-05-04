
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
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
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
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(order.id)}
                    onCheckedChange={(checked) =>
                      onOrderSelection(order.id, !!checked)
                    }
                  />
                </TableCell>
                <TableCell>{order.id.substring(0, 8)}</TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell>{format(new Date(order.orderDate), "dd MMM yyyy")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  <InvoiceCurrency amount={order.paymentAmount} />
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
