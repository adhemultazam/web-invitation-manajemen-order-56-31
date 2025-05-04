import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Eye, Trash } from "lucide-react";
import { Order, WorkStatus, Vendor } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MobileOrderCardProps {
  order: Order;
  updatingOrders: Set<string>;
  vendorColors: Record<string, string>;
  addonStyles: Record<string, { color: string }>;
  availableWorkStatuses: WorkStatus[];
  availablePackages: any[];
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

const MobileOrderCard: React.FC<MobileOrderCardProps> = ({
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
  handleDeleteOrder,
}) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-md p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium text-sm">{order.customerName}</div>
          <a 
            href={order.clientUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-wedding-primary font-semibold hover:underline"
          >
            {order.clientName}
          </a>
        </div>
        <div className="flex space-x-2">
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
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Tgl Pesan</div>
          <div className="font-mono text-xs">{formatDate(order.orderDate)}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Tgl Acara</div>
          <div className="font-mono text-xs">{formatDate(order.eventDate)}</div>
        </div>
        
        <div>
          <div className="text-muted-foreground text-xs">Countdown</div>
          <div className={`font-mono text-xs ${isPastDate(order.eventDate) ? "text-red-500 font-semibold" : ""}`}>
            {order.countdownDays} hari
          </div>
        </div>
        
        <div>
          <div className="text-muted-foreground text-xs">Vendor</div>
          <Select
            value={order.vendor}
            onValueChange={(value) => handleVendorChange(order.id, value)}
            disabled={updatingOrders.has(order.id)}
          >
            <SelectTrigger className="h-7 w-full text-xs px-2 mt-1">
              <div className="flex items-center">
                <div
                  className="w-2 h-2 mr-1 rounded-full"
                  style={{ backgroundColor: vendorColors[order.vendor] || '#6366f1' }}
                />
                <SelectValue>{order.vendor}</SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id} className="text-xs">
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
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Paket</div>
          <Select
            value={order.package}
            onValueChange={(value) => handlePackageChange(order.id, value)}
            disabled={updatingOrders.has(order.id)}
          >
            <SelectTrigger className="h-7 w-full text-xs px-2 mt-1">
              <SelectValue>{order.package}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availablePackages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.name} className="text-xs">
                  {pkg.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Tema</div>
          <Select
            value={order.theme}
            onValueChange={(value) => handleThemeChange(order.id, value)}
            disabled={updatingOrders.has(order.id)}
          >
            <SelectTrigger className="h-7 w-full text-xs px-2 mt-1">
              <SelectValue>{order.theme}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme} value={theme} className="text-xs">
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Addons</div>
          {order.addons && order.addons.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
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
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <div className="text-muted-foreground text-xs">Pembayaran</div>
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
                order.paymentStatus
              )}
            </Badge>
          </Button>
          <div className="text-xs font-mono">{formatCurrency(order.paymentAmount)}</div>
        </div>
        <div>
          <div className="text-muted-foreground text-xs">Status</div>
          <Select
            value={order.workStatus}
            onValueChange={(value) => handleWorkStatusChange(order.id, value)}
            disabled={updatingOrders.has(order.id)}
          >
            <SelectTrigger 
              className="h-7 w-full text-xs px-2 mt-1 text-white"
              style={{ backgroundColor: getStatusColor(order.workStatus) }}
            >
              <div className="flex items-center">
                <SelectValue>{order.workStatus}</SelectValue>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white">
              {availableWorkStatuses.map((status) => (
                <SelectItem 
                  key={status.id} 
                  value={status.name} 
                  className="text-xs" 
                  style={{
                    borderLeft: `4px solid ${status.color}`
                  }}
                >
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
        </div>
      </div>
    </div>
  );
}

export default MobileOrderCard;
