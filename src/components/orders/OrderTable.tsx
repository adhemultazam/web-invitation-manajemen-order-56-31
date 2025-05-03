
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order, Addon, Vendor, Theme, WorkStatus, Package } from "@/types/types";
import { Link } from "react-router-dom";
import { ChevronDown, Edit, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderDetailModal } from "./OrderDetailModal";
import { EditOrderDialog } from "./EditOrderDialog";

interface OrderTableProps {
  orders: Order[];
  vendors: string[];
  workStatuses: string[];
  themes: string[];
  onUpdateOrder: (id: string, data: Partial<Order>) => void;
}

export function OrderTable({ orders, vendors, workStatuses, themes, onUpdateOrder }: OrderTableProps) {
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [vendorColors, setVendorColors] = useState<Record<string, string>>({});
  const [addonStyles, setAddonStyles] = useState<Record<string, {color: string}>>({});
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>([]);
  const [availableWorkStatuses, setAvailableWorkStatuses] = useState<WorkStatus[]>([]);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load vendor colors from localStorage
    try {
      const storedVendors = localStorage.getItem('vendors');
      if (storedVendors) {
        const parsedVendors: Vendor[] = JSON.parse(storedVendors);
        const colors: Record<string, string> = {};
        parsedVendors.forEach(vendor => {
          colors[vendor.name] = vendor.color || '#6366f1'; // Default to indigo if no color
        });
        setVendorColors(colors);
        setAvailableVendors(parsedVendors);
      }
    } catch (e) {
      console.error("Error parsing vendors:", e);
    }
    
    // Load addon styles from localStorage
    try {
      const storedAddons = localStorage.getItem('addons');
      if (storedAddons) {
        const parsedAddons: Addon[] = JSON.parse(storedAddons);
        const styles: Record<string, {color: string}> = {};
        parsedAddons.forEach(addon => {
          styles[addon.name] = { color: addon.color || '#6366f1' };
        });
        setAddonStyles(styles);
        setAvailableAddons(parsedAddons);
      }
    } catch (e) {
      console.error("Error parsing addons:", e);
    }
    
    // Load themes from localStorage
    try {
      const storedThemes = localStorage.getItem('themes');
      if (storedThemes) {
        setAvailableThemes(JSON.parse(storedThemes));
      }
    } catch (e) {
      console.error("Error parsing themes:", e);
    }
    
    // Load work statuses from localStorage
    try {
      const storedWorkStatuses = localStorage.getItem('workStatuses');
      if (storedWorkStatuses) {
        setAvailableWorkStatuses(JSON.parse(storedWorkStatuses));
      } else {
        // Use default work statuses if none are stored
        const defaultWorkStatuses: WorkStatus[] = [
          { id: "1", name: "Selesai", color: "#22c55e" },
          { id: "2", name: "Progress", color: "#3b82f6" },
          { id: "3", name: "Review", color: "#f59e0b" },
          { id: "4", name: "Revisi", color: "#f97316" },
          { id: "5", name: "Data Belum", color: "#ef4444" }
        ];
        setAvailableWorkStatuses(defaultWorkStatuses);
        localStorage.setItem('workStatuses', JSON.stringify(defaultWorkStatuses));
      }
    } catch (e) {
      console.error("Error parsing work statuses:", e);
    }

    // Load packages from localStorage
    try {
      const storedPackages = localStorage.getItem('packages');
      if (storedPackages) {
        setAvailablePackages(JSON.parse(storedPackages));
      } else {
        // Default packages if none are stored
        const defaultPackages: Package[] = [
          {
            id: "1",
            name: "Basic",
            price: 150000,
            description: "Paket basic untuk undangan digital sederhana.",
            features: ["1 halaman", "Maksimal 10 foto", "Durasi 1 bulan"]
          },
          {
            id: "2",
            name: "Premium",
            price: 250000,
            description: "Paket premium dengan fitur tambahan.",
            features: ["3 halaman", "Gallery foto tanpa batas", "Durasi 3 bulan", "Peta lokasi"]
          }
        ];
        setAvailablePackages(defaultPackages);
        localStorage.setItem('packages', JSON.stringify(defaultPackages));
      }
    } catch (e) {
      console.error("Error parsing packages:", e);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    // Updated format to be more compact: dd/mm/yy
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    }).replace(/-/g, '/');
  };

  const isPastDate = (dateString: string) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate < today;
  };

  const getStatusColor = (status: string): string => {
    const workStatus = availableWorkStatuses.find(ws => ws.name === status);
    return workStatus ? workStatus.color : '#6E6E6E'; // Default gray if not found
  };

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

  const togglePaymentStatus = (order: Order) => {
    const newStatus = order.paymentStatus === 'Lunas' ? 'Pending' : 'Lunas';
    setUpdatingOrders(prev => new Set(prev).add(order.id));
    
    onUpdateOrder(order.id, { 
      paymentStatus: newStatus 
    });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
      
      toast.success(`Status pembayaran diubah menjadi ${newStatus}`, {
        description: `Order: ${order.clientName}`
      });
    }, 500);
  };

  const handleWorkStatusChange = (orderId: string, newStatus: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    onUpdateOrder(orderId, {
      workStatus: newStatus
    });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      
      toast.success(`Status pengerjaan diubah menjadi ${newStatus}`);
    }, 500);
  };

  const handleVendorChange = (orderId: string, newVendor: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    onUpdateOrder(orderId, {
      vendor: newVendor
    });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      
      toast.success(`Vendor diubah menjadi ${newVendor}`);
    }, 500);
  };

  const handleThemeChange = (orderId: string, newTheme: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    onUpdateOrder(orderId, {
      theme: newTheme
    });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      
      toast.success(`Tema diubah menjadi ${newTheme}`);
    }, 500);
  };

  const handlePackageChange = (orderId: string, newPackage: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    onUpdateOrder(orderId, {
      package: newPackage
    });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
      
      toast.success(`Paket diubah menjadi ${newPackage}`);
    }, 500);
  };

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleOpenEditDialog = (order: Order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleSaveEdit = (id: string, data: Partial<Order>) => {
    onUpdateOrder(id, data);
  };

  const getVendorColorStyle = (vendor: string) => {
    const color = vendorColors[vendor] || '#6366f1';
    return {
      backgroundColor: color,
      color: '#fff'
    };
  };

  // Function to get addon style based on its name
  const getAddonStyle = (addonName: string) => {
    const addonStyle = addonStyles[addonName];
    return {
      backgroundColor: addonStyle?.color || "#6366f1",
      color: '#fff'
    };
  };

  const findPackageInfo = (packageName: string) => {
    return availablePackages.find(pkg => pkg.name === packageName);
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border rounded-md">
              Tidak ada data pesanan
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 border rounded-md p-4 space-y-3">
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
                      className="h-8 w-8"
                      onClick={() => handleOpenEditDialog(order)}
                    >
                      <Edit className="h-4 w-4" />
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
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor} className="text-xs">
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 mr-1 rounded-full"
                                style={{ backgroundColor: vendorColors[vendor] || '#6366f1' }}
                              />
                              {vendor}
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
                    {order.addons.length > 0 ? (
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
                      <div className="text-xs text-muted-foreground">Tidak ada</div>
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
                      <SelectTrigger className="h-7 w-full text-xs px-2 mt-1">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-1 rounded-full"
                            style={{ backgroundColor: getStatusColor(order.workStatus) }}
                          />
                          <SelectValue>{order.workStatus}</SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.name} className="text-xs">
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
            ))
          )}
        </div>
        
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setDetailModalOpen(false)}
          isOpen={detailModalOpen}
        />
        
        <EditOrderDialog
          order={selectedOrder}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveEdit}
          vendors={vendors}
          workStatuses={workStatuses}
          themes={availableThemes}
          addons={availableAddons}
        />
      </>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">Tgl Pesan</TableHead>
              <TableHead className="w-[100px]">Tgl Acara</TableHead>
              <TableHead className="w-[80px]">Countdown</TableHead>
              <TableHead className="w-[150px]">Nama Pemesan</TableHead>
              <TableHead className="w-[150px]">Nama Klien</TableHead>
              <TableHead className="w-[120px]">Vendor</TableHead>
              <TableHead className="w-[120px]">Paket</TableHead>
              <TableHead className="w-[200px]">Addons</TableHead>
              <TableHead className="w-[120px]">Tema</TableHead>
              <TableHead className="w-[150px]">Status Pembayaran</TableHead>
              <TableHead className="w-[150px]">Status Pengerjaan</TableHead>
              <TableHead className="w-[60px]">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                  Tidak ada data pesanan
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
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
                    <Select
                      value={order.vendor}
                      onValueChange={(value) => handleVendorChange(order.id, value)}
                      disabled={updatingOrders.has(order.id)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs py-0 px-2">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-1 rounded-full"
                            style={{ backgroundColor: vendorColors[order.vendor] || '#6366f1' }}
                          />
                          <SelectValue>{order.vendor}</SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 mr-2 rounded-full"
                                style={{ backgroundColor: vendorColors[vendor] || '#6366f1' }}
                              />
                              {vendor}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.package}
                      onValueChange={(value) => handlePackageChange(order.id, value)}
                      disabled={updatingOrders.has(order.id)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs py-0 px-2">
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
                  </TableCell>
                  <TableCell>
                    {order.addons.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {order.addons.map((addon, index) => (
                          <Badge 
                            key={index} 
                            style={getAddonStyle(addon)}
                            className="text-[10px] py-0 px-1.5"
                          >
                            {addon}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Tidak ada
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.theme}
                      onValueChange={(value) => handleThemeChange(order.id, value)}
                      disabled={updatingOrders.has(order.id)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs py-0 px-2">
                        <SelectValue>{order.theme}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
                            {theme}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-6 justify-start"
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
                      <span className="text-xs font-mono mt-1">
                        {formatCurrency(order.paymentAmount)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.workStatus}
                      onValueChange={(value) => handleWorkStatusChange(order.id, value)}
                      disabled={updatingOrders.has(order.id)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs py-0 px-2">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 mr-1 rounded-full"
                            style={{ backgroundColor: getStatusColor(order.workStatus) }}
                          />
                          <SelectValue>{order.workStatus}</SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.name}>
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
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleViewOrderDetail(order)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleOpenEditDialog(order)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setDetailModalOpen(false)}
        isOpen={detailModalOpen}
      />

      <EditOrderDialog
        order={selectedOrder}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        vendors={vendors}
        workStatuses={workStatuses}
        themes={availableThemes}
        addons={availableAddons}
      />
    </>
  );
}
