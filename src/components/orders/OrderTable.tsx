
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order, WorkStatus, Vendor, Package, Theme } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import VendorDropdown from "./VendorDropdown";
import OrderTableRow from "./OrderTableRow"; // Import the OrderTableRow component

interface OrderTableProps {
  orders: Order[];
  updatingOrders: Set<string>;
  vendorColors: Record<string, string>;
  addonStyles: Record<string, { color: string }>;
  workStatuses: WorkStatus[];
  vendors: Vendor[];
  packages: Package[];
  themes: Theme[];
  formatDate: (date: string) => string;
  isPastDate: (date: string) => boolean;
  formatCurrency: (amount: number) => string;
  togglePaymentStatus: (order: Order) => void;
  handleWorkStatusChange: (orderId: string, status: string) => void;
  handleVendorChange: (orderId: string, vendor: string) => void;
  handleThemeChange: (orderId: string, theme: string) => void;
  handlePackageChange: (orderId: string, pkg: string) => void;
  handleViewOrderDetail: (order: Order) => void;
  handleOpenEditDialog: (order: Order) => void;
  handleDeleteOrder: (order: Order) => void;
}

export function OrderTable({
  orders,
  updatingOrders,
  vendorColors,
  addonStyles,
  workStatuses,
  vendors,
  packages,
  themes,
  formatDate,
  isPastDate,
  formatCurrency,
  togglePaymentStatus,
  handleWorkStatusChange,
  handleVendorChange,
  handleThemeChange,
  handlePackageChange,
  handleViewOrderDetail,
  handleOpenEditDialog,
  handleDeleteOrder,
}: OrderTableProps) {
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead className="hidden md:table-cell">Tgl Pesan</TableHead>
            <TableHead className="hidden md:table-cell">Tgl Acara</TableHead>
            <TableHead className="hidden md:table-cell">Countdown</TableHead>
            <TableHead className="min-w-[150px]">Client</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead className="hidden lg:table-cell">Paket</TableHead>
            <TableHead className="hidden xl:table-cell">Tema</TableHead>
            <TableHead className="hidden lg:table-cell">Addons</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <OrderTableRow
                key={order.id}
                order={order}
                index={index}
                updatingOrders={updatingOrders}
                vendorColors={vendorColors}
                addonStyles={addonStyles}
                availableWorkStatuses={workStatuses}
                availablePackages={packages}
                vendors={vendors}
                themes={themes.map(t => t.name)}
                formatDate={formatDate}
                isPastDate={isPastDate}
                formatCurrency={formatCurrency}
                togglePaymentStatus={togglePaymentStatus}
                handleWorkStatusChange={handleWorkStatusChange}
                handleVendorChange={handleVendorChange}
                handleThemeChange={handleThemeChange}
                handlePackageChange={handlePackageChange}
                handleViewOrderDetail={handleViewOrderDetail}
                handleOpenEditDialog={handleOpenEditDialog}
                handleDeleteOrder={handleDeleteOrder}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="h-24 text-center">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

// Import for Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
