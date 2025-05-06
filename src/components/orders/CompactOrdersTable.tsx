
import React from 'react';
import { Order, Vendor, Theme, Package, WorkStatus } from '@/types/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Pencil, Trash, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import VendorDropdown from './VendorDropdown';
import PackageSelect from './PackageSelect';
import ThemeSelect from './ThemeSelect';
import WorkStatusSelect from './WorkStatusSelect';
import OrderAddons from './OrderAddons';
import PaymentStatusBadge from './PaymentStatusBadge';

interface CompactOrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  vendorColors?: Record<string, string>;
  addonStyles?: Record<string, { color: string }>;
  updatingOrders?: Set<string>;
  availableWorkStatuses?: WorkStatus[];
  availableVendors?: Vendor[];
  availableThemes?: Theme[];
  availablePackages?: Package[];
  handleVendorChange?: (orderId: string, vendor: string) => void;
  handleThemeChange?: (orderId: string, theme: string) => void;
  handlePackageChange?: (orderId: string, pkg: string) => void;
  handleWorkStatusChange?: (orderId: string, status: string) => void;
  togglePaymentStatus?: (order: Order) => void;
}

export function CompactOrdersTable({ 
  orders, 
  onEditOrder, 
  onDeleteOrder,
  vendorColors = {},
  addonStyles = {},
  updatingOrders = new Set(),
  availableWorkStatuses = [],
  availableVendors = [],
  availableThemes = [],
  availablePackages = [],
  handleVendorChange = () => {},
  handleThemeChange = () => {},
  handlePackageChange = () => {},
  handleWorkStatusChange = () => {},
  togglePaymentStatus = () => {}
}: CompactOrdersTableProps) {
  // Format date as dd/MM/yyyy
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate countdown
  const getCountdown = (eventDate: string) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = parseISO(eventDate);
      return differenceInDays(date, today);
    } catch (error) {
      return 0;
    }
  };

  // Check if date is in the past
  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = parseISO(dateString);
    return date < today;
  };

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

  return (
    <div className="rounded-xl border overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      <Table compact className="compact-table w-full">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10">No</TableHead>
            <TableHead className="w-24">Tgl Pesan</TableHead>
            <TableHead className="w-24">Tgl Acara</TableHead>
            <TableHead className="w-24">Countdown</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="w-32">Vendor</TableHead>
            <TableHead className="w-36">Paket & Tema</TableHead>
            <TableHead className="w-28">Addons</TableHead>
            <TableHead className="w-28">Pembayaran</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-16 text-right pr-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40 group h-12">
              <TableCell className="font-mono text-xs text-gray-500 py-1.5">
                {index + 1}
              </TableCell>
              <TableCell className="font-mono text-xs text-gray-500 py-1.5">
                {formatDate(order.orderDate)}
              </TableCell>
              <TableCell className="font-mono text-xs text-gray-500 py-1.5">
                {formatDate(order.eventDate)}
              </TableCell>
              <TableCell className="font-mono text-xs py-1.5">
                <span className={isPastDate(order.eventDate) ? "text-red-500 font-semibold" : ""}>
                  {getCountdown(order.eventDate)} hari
                </span>
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex flex-col gap-0">
                  <span className="font-medium text-xs">{order.clientName}</span>
                  <span className="text-[11px] text-gray-500 leading-tight">{order.customerName}</span>
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <VendorDropdown 
                  vendor={order.vendor} 
                  vendors={availableVendors}
                  isDisabled={updatingOrders.has(order.id)}
                  onChange={(value) => handleVendorChange(order.id, value)}
                  compact={true}
                />
              </TableCell>
              <TableCell className="py-1.5">
                <div className="flex flex-col gap-1">
                  <PackageSelect
                    value={order.package}
                    packages={availablePackages}
                    isDisabled={updatingOrders.has(order.id)}
                    onChange={(value) => handlePackageChange(order.id, value)}
                    compact={true}
                  />
                  <ThemeSelect
                    value={order.theme}
                    themes={availableThemes}
                    onChange={(value) => handleThemeChange(order.id, value)}
                    isDisabled={updatingOrders.has(order.id)}
                    compact={true}
                  />
                </div>
              </TableCell>
              <TableCell className="py-1.5">
                <OrderAddons 
                  addons={order.addons || []} 
                  addonStyles={addonStyles}
                  compact={true}
                />
              </TableCell>
              <TableCell className="py-1.5">
                <PaymentStatusBadge 
                  status={order.paymentStatus}
                  amount={order.paymentAmount}
                  isUpdating={updatingOrders.has(order.id)}
                  onToggle={() => togglePaymentStatus(order)}
                  formatCurrency={formatCurrency}
                  compact={true}
                />
              </TableCell>
              <TableCell className="py-1.5">
                <WorkStatusSelect
                  value={order.workStatus}
                  isDisabled={updatingOrders.has(order.id)}
                  workStatuses={availableWorkStatuses}
                  onChange={(value) => handleWorkStatusChange(order.id, value)}
                  compact={true}
                />
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
              <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
