
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Order } from "@/types/types";
import { format } from "date-fns";
import { InvoiceCurrency } from "./InvoiceCurrency";

interface OrderSelectionTableProps {
  orders: Order[];
  selectedOrders: Order[];
  onOrderSelection: (order: Order) => void;
}

export function OrderSelectionTable({ orders, selectedOrders, onOrderSelection }: OrderSelectionTableProps) {
  // Check if an order is selected
  const isSelected = (order: Order): boolean => {
    return selectedOrders.some(selected => selected.id === order.id);
  };

  // Format date to readable format
  const formatOrderDate = (date: string): string => {
    return format(new Date(date), "dd MMM yyyy");
  };

  // Format payment amount
  const formatPaymentAmount = (amount: number | string): number => {
    if (typeof amount === 'string') {
      return parseFloat(amount) || 0;
    }
    return amount;
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Paket</TableHead>
            <TableHead>Addons</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 cursor-pointer">
                <TableCell className="p-2">
                  <Checkbox
                    checked={isSelected(order)}
                    onCheckedChange={() => onOrderSelection(order)}
                    aria-label={`Select order for ${order.clientName}`}
                  />
                </TableCell>
                <TableCell className="text-xs">
                  {formatOrderDate(order.orderDate)}
                </TableCell>
                <TableCell>{order.clientName}</TableCell>
                <TableCell className="text-xs">{order.package || "-"}</TableCell>
                <TableCell className="text-xs">
                  {order.addons && order.addons.length > 0 ? 
                    order.addons.join(", ") : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <InvoiceCurrency amount={formatPaymentAmount(order.paymentAmount)} />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Tidak ada pesanan yang tersedia untuk vendor ini
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
