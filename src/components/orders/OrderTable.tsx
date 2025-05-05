import React from "react";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Order, WorkStatus, Vendor, Package, Theme } from "@/types/types";
import OrderTableRow from "./OrderTableRow";
import OrderTableHeader from "./OrderTableHeader";

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
        <OrderTableHeader />
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
