
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
  handleDeleteOrder: (order: Order) => void; // Added this prop
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
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
  handleDeleteOrder, // Added this prop to destructuring
}) => {
  // Check if an order has any addons
  const hasAddons = (): boolean => {
    return Array.isArray(order.addons) && order.addons.length > 0;
  };

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">
        {formatDate(order.orderDate)}
      </TableCell>
      <TableCell className="font-mono text-xs">
        {formatDate(order.eventDate)}
      </TableCell>
      <TableCell className="font-mono text-xs">
        <span className={isPastDate(order.eventDate) ? "text-red-500 font-semibold" : ""}>
          {order.countdownDays} hari
        </span>
      </TableCell>
      <TableCell className="font-medium">
        {order.customerName}
      </TableCell>
      <TableCell>
        <a 
          href={order.clientUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-wedding-primary hover:underline cursor-pointer"
        >
          {order.clientName}
        </a>
      </TableCell>
      <TableCell>
        <VendorDropdown 
          vendor={order.vendor} 
          vendors={vendors}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handleVendorChange(order.id, value)}
        />
      </TableCell>
      <TableCell>
        <PackageSelect
          value={order.package}
          packages={availablePackages}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handlePackageChange(order.id, value)}
        />
      </TableCell>
      <TableCell>
        <OrderAddons 
          addons={order.addons} 
          addonStyles={addonStyles} 
        />
      </TableCell>
      <TableCell>
        <ThemeSelect
          value={order.theme}
          themes={themes}
          isDisabled={updatingOrders.has(order.id)}
          onChange={(value) => handleThemeChange(order.id, value)}
        />
      </TableCell>
      <TableCell>
        <PaymentStatusBadge 
          status={order.paymentStatus}
          amount={order.paymentAmount}
          isUpdating={updatingOrders.has(order.id)}
          onToggle={() => togglePaymentStatus(order)}
          formatCurrency={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <WorkStatusSelect
          value={order.workStatus}
          isDisabled={updatingOrders.has(order.id)}
          workStatuses={availableWorkStatuses}
          onChange={(value) => handleWorkStatusChange(order.id, value)}
        />
      </TableCell>
      <TableCell>
        <OrderActions
          order={order}
          onView={handleViewOrderDetail}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteOrder} // Pass the delete handler to OrderActions
        />
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
