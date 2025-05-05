
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Order, WorkStatus, Vendor, Addon, Theme, Package } from "@/types/types";

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
  availableThemes,
  availablePackages,
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
  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'lunas':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusColor = (status: string): string => {
    const workStatus = availableWorkStatuses.find(ws => ws.name === status);
    return workStatus ? workStatus.color : '#6E6E6E'; // Default gray if not found
  };

  const getAddonStyle = (addonName: string) => {
    const addonStyle = addonStyles[addonName];
    return {
      backgroundColor: addonStyle?.color || "#6366f1",
      color: '#fff'
    };
  };

  // Format date as dd/mm/yyyy
  const formatDateToNumber = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      console.error("Invalid date:", dateString);
      return dateString;
    }
  };

  // Check if date is in the past
  const isPastDate = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    return date < today;
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table className="whitespace-nowrap">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">No</TableHead>
            <TableHead>Tgl Pesan</TableHead>
            <TableHead>Tgl Acara</TableHead>
            <TableHead>Countdown</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paket & Tema</TableHead>
            <TableHead>Pembayaran</TableHead>
            <TableHead>Addons</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <TableRow key={order.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="font-mono">{formatDateToNumber(order.orderDate)}</TableCell>
              <TableCell className="font-mono">{formatDateToNumber(order.eventDate)}</TableCell>
              <TableCell className={`font-mono ${isPastDate(order.eventDate) ? "text-red-500 font-semibold" : ""}`}>
                {order.countdownDays} hari
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{order.clientName}</span>
                  <span className="text-xs text-muted-foreground">{order.customerName}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  value={order.vendor}
                  onValueChange={(value) => handleVendorChange(order.id, value)}
                  disabled={updatingOrders.has(order.id)}
                >
                  <SelectTrigger className="h-8 w-40" data-testid="vendor-trigger">
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 mr-1 rounded-full"
                        style={{ backgroundColor: vendorColors[order.vendor] || '#6366f1' }}
                      />
                      <SelectValue>{order.vendor}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableVendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-1 rounded-full"
                            style={{ backgroundColor: vendor.color || '#6366f1' }}
                          />
                          {vendor.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  value={order.workStatus}
                  onValueChange={(value) => handleWorkStatusChange(order.id, value)}
                  disabled={updatingOrders.has(order.id)}
                >
                  <SelectTrigger className="h-8 w-40">
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 mr-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(order.workStatus) }}
                      />
                      <SelectValue>{order.workStatus}</SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableWorkStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.name}>
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-1 rounded-full"
                            style={{ backgroundColor: status.color }}
                          />
                          {status.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <Select
                    value={order.package}
                    onValueChange={(value) => handlePackageChange(order.id, value)}
                    disabled={updatingOrders.has(order.id)}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue>{order.package}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availablePackages.map((pkg) => (
                        <SelectItem key={pkg.id} value={pkg.name}>
                          {pkg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={order.theme}
                    onValueChange={(value) => handleThemeChange(order.id, value)}
                    disabled={updatingOrders.has(order.id)}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue>{order.theme}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableThemes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.name}>
                          {theme.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-0 h-6"
                  onClick={() => togglePaymentStatus(order)}
                >
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {updatingOrders.has(order.id) ? (
                      <span className="animate-pulse">Menyimpan...</span>
                    ) : (
                      <>{order.paymentStatus}</>
                    )}
                  </Badge>
                </Button>
              </TableCell>
              <TableCell>
                {order.addons && order.addons.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {order.addons.map((addon, index) => (
                      <Badge 
                        key={index} 
                        style={getAddonStyle(addon)}
                        className="text-[10px] px-1.5 py-0 rounded-full"
                      >
                        {addon}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
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
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={11} className="h-24 text-center">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
