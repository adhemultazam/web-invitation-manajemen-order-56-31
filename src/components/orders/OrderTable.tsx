
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
  
  const getStatusColor = (statusName: string): string => {
    const status = workStatuses.find(status => status.name === statusName);
    return status?.color || "#6E6E6E"; // Default gray if not found
  };
  
  const getAddonStyle = (addonName: string) => {
    const addonStyle = addonStyles[addonName];
    return addonStyle?.color || "#6366f1";
  };
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead className="min-w-[150px]">Client</TableHead>
            <TableHead className="hidden md:table-cell">Tgl Pesan</TableHead>
            <TableHead className="hidden md:table-cell">Tgl Acara</TableHead>
            <TableHead className="hidden md:table-cell">Countdown</TableHead>
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
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  #{order.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{order.clientName}</div>
                    <div className="text-xs text-muted-foreground">{order.customerName}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">
                  {formatDate(order.orderDate)}
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-xs">
                  {formatDate(order.eventDate)}
                </TableCell>
                <TableCell className={cn(
                  "hidden md:table-cell font-mono text-xs",
                  isPastDate(order.eventDate) && "text-red-500 font-semibold"
                )}>
                  {order.countdownDays} hari
                </TableCell>
                <TableCell>
                  <VendorDropdown
                    vendor={order.vendor}
                    vendors={vendors}
                    isDisabled={updatingOrders.has(order.id)}
                    onChange={(value) => handleVendorChange(order.id, value)}
                  />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Select
                    value={order.package}
                    onValueChange={(value) => handlePackageChange(order.id, value)}
                    disabled={updatingOrders.has(order.id)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue>{order.package}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.name} className="text-xs">
                          {pkg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Select
                    value={order.theme}
                    onValueChange={(value) => handleThemeChange(order.id, value)}
                    disabled={updatingOrders.has(order.id)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue>{order.theme}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.name} className="text-xs">
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {order.addons && order.addons.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {order.addons.map((addon, index) => (
                        <Badge 
                          key={index} 
                          style={{ backgroundColor: getAddonStyle(addon) }}
                          className="text-[10px] px-1.5 py-0 rounded-full text-white"
                        >
                          {addon}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-0 h-6"
                    onClick={() => togglePaymentStatus(order)}
                  >
                    <Badge 
                      className={cn(
                        order.paymentStatus === "Lunas" ? "bg-green-500" : "bg-amber-500"
                      )}
                    >
                      {updatingOrders.has(order.id) ? (
                        <span className="animate-pulse">Menyimpan...</span>
                      ) : (
                        order.paymentStatus
                      )}
                    </Badge>
                  </Button>
                  <div className="text-xs font-mono">
                    {formatCurrency(order.paymentAmount)}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={order.workStatus}
                    onValueChange={(value) => handleWorkStatusChange(order.id, value)}
                    disabled={updatingOrders.has(order.id)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 mr-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(order.workStatus) }}
                        />
                        <SelectValue>{order.workStatus}</SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {workStatuses.map((status) => (
                        <SelectItem key={status.id} value={status.name} className="text-xs">
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 mr-2 rounded-full"
                              style={{ backgroundColor: status.color }}
                            />
                            {status.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleViewOrderDetail(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-wedding-primary hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => handleOpenEditDialog(order)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteOrder(order)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
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

// Missing import for Select components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
