
import React, { useState } from 'react';
import { Order } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Pencil, Trash, MoreHorizontal, Eye, Check, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CompactOrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

export function CompactOrdersTable({ orders, onEditOrder, onDeleteOrder }: CompactOrdersTableProps) {
  const formatCurrency = (amount: number | string): string => {
    if (typeof amount === 'string') {
      // Try converting string to number
      const numericAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
      if (isNaN(numericAmount)) return 'Rp 0';
      amount = numericAmount;
    }

    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lunas':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700';
    }
  };

  const getWorkStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-wedding-light text-wedding-primary border-wedding-secondary dark:bg-wedding-primary/10 dark:text-wedding-secondary dark:border-wedding-primary/30';
      case 'Proses':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'Belum':
        return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      <Table compact className="compact-table w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-20">ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="hidden md:table-cell">Package & Theme</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="hidden sm:table-cell w-28">Tanggal</TableHead>
            <TableHead className="text-right">Payment</TableHead>
            <TableHead className="w-20 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 group h-10">
              <TableCell className="font-mono text-xs text-gray-500 py-1.5">
                {order.id.substring(0, 6)}
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex flex-col gap-0">
                  <span className="font-medium text-xs">{order.clientName}</span>
                  <span className="text-[11px] text-gray-500 leading-tight">{order.customerName}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell py-1.5">
                <div className="flex flex-col gap-0">
                  <span className="text-[11px] font-medium leading-tight">{order.package}</span>
                  <span className="text-[11px] text-gray-500 leading-tight">{order.theme}</span>
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex flex-col gap-0.5">
                  <span className={`compact-badge border ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                  <span className={`compact-badge border ${getWorkStatusColor(order.workStatus)}`}>
                    {order.workStatus}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-xs text-gray-600 dark:text-gray-400 py-1.5">
                {format(new Date(order.orderDate), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-right font-medium py-1.5 text-xs">
                {formatCurrency(order.paymentAmount)}
              </TableCell>
              <TableCell className="p-0 pr-2 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 opacity-70 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => onEditOrder(order)}>
                      <Pencil className="mr-2 h-3 w-3" />
                      <span className="text-xs">Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteOrder(order.id)}>
                      <Trash className="mr-2 h-3 w-3" />
                      <span className="text-xs">Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
