
import React, { useState, useEffect } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Order, Vendor, Theme } from "@/types/types";
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
  // Find the current package's category
  const [packageCategory, setPackageCategory] = useState<string | undefined>(undefined);
  
  // Update package category when the order's package changes
  useEffect(() => {
    const currentPackage = availablePackages.find(pkg => pkg.name === order.package);
    if (currentPackage) {
      setPackageCategory(currentPackage.name);
    }
  }, [order.package, availablePackages]);

  // Check if an order has any addons
  const hasAddons = (): boolean => {
    return Array.isArray(order.addons) && order.addons.length > 0;
  };

  // Check if client URL exists
  const hasClientUrl = (): boolean => {
    return !!order.clientUrl && order.clientUrl.trim() !== '';
  };

  return (
    <TableRow className="h-12 hover:bg-gray-50/80">
      {/* No */}
      <TableCell className="font-mono text-xs py-2 px-2">
        {index + 1}
      </TableCell>
      
      {/* Tgl Pesan */}
      <TableCell className="font-mono text-xs py-2 px-2">
        {formatDate(order.orderDate)}
      </TableCell>
      
      {/* Tgl Acara */}
      <TableCell className="font-mono text-xs py-2 px-2">
        {formatDate(order.eventDate)}
      </TableCell>
      
      {/* Countdown */}
      <TableCell className="font-mono text-xs py-2 px-2">
        <span className={isPastDate(order.eventDate) ? "text-red-500 font-semibold" : ""}>
          {order.countdownDays} hari
        </span>
      </TableCell>
      
      {/* Client & Nama combined - SWAPPED ORDER */}
      <TableCell className="py-2 px-2">
        <div className="flex flex-col gap-0.5">
          {hasClientUrl() ? (
            <a 
              href={order.clientUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline cursor-pointer font-medium leading-tight"
            >
              {order.clientName}
            </a>
          ) : (
            <div className="text-xs font-medium leading-tight">{order.clientName}</div>
          )}
          <div className="text-[11px] text-muted-foreground leading-tight">{order.customerName}</div>
        </div>
      </TableCell>
      
      {/* Vendor */}
      <TableCell className="py-2 px-2">
        <VendorDropdown 
          vendor={order.vendor} 
          vendors={vendors}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handleVendorChange(order.id, value)}
          compact={true}
        />
      </TableCell>
      
      {/* Paket & Tema combined */}
      <TableCell className="py-2 px-2">
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
            themes={themes}
            isDisabled={updatingOrders.has(order.id)}
            onChange={(value) => handleThemeChange(order.id, value)}
            packageCategory={packageCategory}
            compact={true}
          />
        </div>
      </TableCell>
      
      {/* Addons */}
      <TableCell className="py-2 px-2">
        <OrderAddons 
          addons={order.addons} 
          addonStyles={addonStyles}
          compact={true}
        />
      </TableCell>
      
      {/* Pembayaran */}
      <TableCell className="py-2 px-2">
        <PaymentStatusBadge 
          status={order.paymentStatus}
          amount={order.paymentAmount}
          isUpdating={updatingOrders.has(order.id)}
          onToggle={() => togglePaymentStatus(order)}
          formatCurrency={formatCurrency}
          compact={true}
        />
      </TableCell>
      
      {/* Status */}
      <TableCell className="py-2 px-2">
        <WorkStatusSelect
          value={order.workStatus}
          isDisabled={updatingOrders.has(order.id)}
          workStatuses={availableWorkStatuses}
          onChange={(value) => handleWorkStatusChange(order.id, value)}
          compact={true}
        />
      </TableCell>
      
      {/* Aksi */}
      <TableCell className="py-2 px-2">
        <OrderActions
          order={order}
          onView={handleViewOrderDetail}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteOrder}
          compact={true}
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
