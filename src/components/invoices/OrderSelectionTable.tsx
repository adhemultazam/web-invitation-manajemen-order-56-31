
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
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
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
              <TableCell className="text-right font-medium">
                <InvoiceCurrency amount={order.paymentAmount} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
