
import React, { useRef } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableRow from "./OrderTableRow";
import { Order, WorkStatus, Vendor, Theme, Package } from "@/types/types";
import { format, parseISO, differenceInDays } from "date-fns";
import { id } from "date-fns/locale";

interface OrderTableProps {
  orders: Order[];
  availableWorkStatuses: WorkStatus[];
  availableVendors: Vendor[];
  availableThemes: Theme[];
  availablePackages: Package[];
  updatingOrders: Set<string>;
  vendorColors: Record<string, string>;
  addonStyles: Record<string, { color: string }>;
  handleViewOrderDetail: (order: Order) => void;
  handleOpenEditDialog: (order: Order) => void;
  handleDeleteOrder: (order: Order) => void;
  togglePaymentStatus: (order: Order) => void;
  handleWorkStatusChange: (orderId: string, status: string) => void;
  handleVendorChange: (orderId: string, vendor: string) => void;
  handleThemeChange: (orderId: string, theme: string) => void;
  handlePackageChange: (orderId: string, pkg: string) => void;
}

export function OrderTable({
  orders,
  availableWorkStatuses,
  availableVendors,
  availablePackages,
  availableThemes,
  updatingOrders,
  vendorColors,
  addonStyles,
  handleViewOrderDetail,
  handleOpenEditDialog,
  handleDeleteOrder,
  togglePaymentStatus,
  handleWorkStatusChange,
  handleVendorChange,
  handleThemeChange,
  handlePackageChange,
}: OrderTableProps) {
  // Format date as dd/MM/yyyy
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return "-";
      const date = parseISO(dateString);
      return format(date, "dd/MM/yyyy", { locale: id });
    } catch (error) {
      console.error("Invalid date:", dateString);
      return "-";
    }
  };

  // Check if date is in the past
  const isPastDate = (dateString: string) => {
    if (!dateString) return false;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = parseISO(dateString);
      return date < today;
    } catch (error) {
      return false;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="rounded-md border">
      <Table compact className="w-full">
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
                availableWorkStatuses={availableWorkStatuses}
                availablePackages={availablePackages}
                vendors={availableVendors}
                themes={availableThemes}
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
              <TableHead colSpan={12} className="h-24 text-center">
                Tidak ada data pesanan
              </TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
