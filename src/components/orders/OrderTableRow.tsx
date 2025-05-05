import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Order, Vendor } from "@/types/types";
import OrderAddons from "./OrderAddons";
import PaymentStatusBadge from "./PaymentStatusBadge";
import WorkStatusSelect from "./WorkStatusSelect";
import ThemeSelect from "./ThemeSelect";
import VendorDropdown from "./VendorDropdown";
import PackageSelect from "./PackageSelect";
import OrderActions from "./OrderActions";
import { WorkStatus, Package } from "@/types/types";

interface OrderTableRowProps {
  order: Order;
  index: number; // Add index for numbering
  updatingOrders: Set<string>;
  vendorColors: Record<string, string>;
  addonStyles: Record<string, { color: string }>;
  availableWorkStatuses: WorkStatus[];
  availablePackages: Package[];
  vendors: Vendor[];
  themes: string[];
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

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  index,
  updatingOrders,
  vendorColors,
  addonStyles,
  availableWorkStatuses,
  availablePackages,
  vendors,
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
}) => {
  // Check if an order has any addons
  const hasAddons = (): boolean => {
    return Array.isArray(order.addons) && order.addons.length > 0;
  };

  // Check if client URL exists
  const hasClientUrl = (): boolean => {
    return !!order.clientUrl && order.clientUrl.trim() !== '';
  };

  return (
    <TableRow>
      {/* No */}
      <TableCell className="font-mono text-xs">
        {index + 1}
      </TableCell>
      
      {/* Tgl Pesan */}
      <TableCell className="font-mono text-xs">
        {formatDate(order.orderDate)}
      </TableCell>
      
      {/* Tgl Acara */}
      <TableCell className="font-mono text-xs">
        {formatDate(order.eventDate)}
      </TableCell>
      
      {/* Countdown */}
      <TableCell className="font-mono text-xs">
        <span className={isPastDate(order.eventDate) ? "text-red-500 font-semibold" : ""}>
          {order.countdownDays} hari
        </span>
      </TableCell>
      
      {/* Client */}
      <TableCell>
        <div className="space-y-1">
          <div className="text-sm font-medium">{order.clientName}</div>
        </div>
      </TableCell>
      
      {/* Nama */}
      <TableCell>
        {hasClientUrl() ? (
          <a 
            href={order.clientUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-500 hover:underline cursor-pointer"
          >
            {order.customerName}
          </a>
        ) : (
          <span className="font-medium">{order.customerName}</span>
        )}
      </TableCell>
      
      {/* Vendor */}
      <TableCell>
        <VendorDropdown 
          vendor={order.vendor} 
          vendors={vendors}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handleVendorChange(order.id, value)}
        />
      </TableCell>
      
      {/* Paket */}
      <TableCell>
        <PackageSelect
          value={order.package}
          packages={availablePackages}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handlePackageChange(order.id, value)}
        />
      </TableCell>
      
      {/* Tema */}
      <TableCell>
        <ThemeSelect
          value={order.theme}
          themes={themes}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handleThemeChange(order.id, value)}
        />
      </TableCell>
      
      {/* Addons */}
      <TableCell>
        <OrderAddons 
          addons={order.addons} 
          addonStyles={addonStyles} 
        />
      </TableCell>
      
      {/* Pembayaran */}
      <TableCell>
        <PaymentStatusBadge 
          status={order.paymentStatus}
          amount={order.paymentAmount}
          isUpdating={updatingOrders.has(order.id)}
          onToggle={() => togglePaymentStatus(order)}
          formatCurrency={formatCurrency}
        />
      </TableCell>
      
      {/* Status */}
      <TableCell>
        <WorkStatusSelect
          value={order.workStatus}
          isDisabled={updatingOrders.has(order.id)}
          workStatuses={availableWorkStatuses}
          onChange={(value) => handleWorkStatusChange(order.id, value)}
        />
      </TableCell>
      
      {/* Aksi */}
      <TableCell>
        <OrderActions
          order={order}
          onView={handleViewOrderDetail}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteOrder}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
