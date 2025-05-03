import { useState } from "react";
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
import { Order, Addon } from "@/types/types";
import { Link } from "react-router-dom";
import { ChevronDown, Edit, Eye, Check } from "lucide-react";
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
  const isMobile = useIsMobile();

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
    switch (status.toLowerCase()) {
      case 'selesai':
        return 'bg-green-500';
      case 'progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-amber-500';
      case 'revisi':
        return 'bg-orange-500';
      case 'data belum':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
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

  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
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
                    <div 
                      onClick={() => handleViewOrderDetail(order)} 
                      className="text-wedding-primary font-semibold cursor-pointer"
                    >
                      {order.clientName}
                    </div>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/order/${order.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
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
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue>
                          {updatingOrders.has(order.id) ? (
                            <span className="animate-pulse">Menyimpan...</span>
                          ) : (
                            order.vendor
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Paket</div>
                    <div className="text-sm">{order.package}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Tema</div>
                    <Select 
                      value={order.theme}
                      onValueChange={(value) => handleThemeChange(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue>
                          {updatingOrders.has(order.id) ? (
                            <span className="animate-pulse">Menyimpan...</span>
                          ) : (
                            order.theme
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme} value={theme}>
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
                          <div key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs px-2 py-0.5 rounded-full">
                            {addon}
                          </div>
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
                    >
                      <SelectTrigger className="h-8 px-3 w-full">
                        <SelectValue>
                          {updatingOrders.has(order.id) ? (
                            <span className="animate-pulse">Menyimpan...</span>
                          ) : (
                            <Badge className={getStatusColor(order.workStatus)}>
                              {order.workStatus}
                            </Badge>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {workStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <Badge className={getStatusColor(status)}>
                              {status}
                            </Badge>
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
              <TableHead className="w-[120px]">Addons</TableHead>
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
                    <span 
                      className="text-wedding-primary hover:underline cursor-pointer"
                      onClick={() => handleViewOrderDetail(order)}
                    >
                      {order.clientName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.vendor}
                      onValueChange={(value) => handleVendorChange(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue>
                          {updatingOrders.has(order.id) ? (
                            <span className="flex items-center gap-1">
                              <span className="animate-pulse">Menyimpan...</span>
                            </span>
                          ) : (
                            order.vendor
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor} value={vendor}>
                            {vendor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                          {order.package}
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        <div className="p-2">
                          <div className="mb-2">
                            <span className="font-semibold text-xs">Addons:</span>
                            {order.addons.length ? (
                              <ul className="text-xs ml-2 mt-1 list-disc pl-3">
                                {order.addons.map((addon, i) => (
                                  <li key={i}>{addon}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground ml-2 mt-1">Tidak ada</p>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-xs">Bonus:</span>
                            {order.bonuses.length ? (
                              <ul className="text-xs ml-2 mt-1 list-disc pl-3">
                                {order.bonuses.map((bonus, i) => (
                                  <li key={i}>{bonus}</li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground ml-2 mt-1">Tidak ada</p>
                            )}
                          </div>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                          Addons
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        <div className="p-2">
                          {order.addons.length ? (
                            <div className="flex flex-wrap gap-1">
                              {order.addons.map((addon, i) => (
                                <span key={i} className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 text-xs px-2 py-0.5 rounded-full">
                                  {addon}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">Tidak ada addon</p>
                          )}
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.theme}
                      onValueChange={(value) => handleThemeChange(order.id, value)}
                    >
                      <SelectTrigger className="h-8 w-full text-xs">
                        <SelectValue>
                          {updatingOrders.has(order.id) ? (
                            <span className="flex items-center gap-1">
                              <span className="animate-pulse">Menyimpan...</span>
                            </span>
                          ) : (
                            order.theme
                          )}
                        </SelectValue>
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
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-6"
                        onClick={() => togglePaymentStatus(order)}
                      >
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {updatingOrders.has(order.id) ? (
                            <span className="flex items-center gap-1">
                              <span className="animate-pulse">Menyimpan...</span>
                            </span>
                          ) : (
                            order.paymentStatus
                          )}
                        </Badge>
                      </Button>
                      <div className="text-xs font-mono">{formatCurrency(order.paymentAmount)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={order.workStatus}
                      onValueChange={(value) => handleWorkStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="h-8 px-3 w-full">
                        <SelectValue>
                          {updatingOrders.has(order.id) ? (
                            <span className="flex items-center gap-1">
                              <span className="animate-pulse">Menyimpan...</span>
                            </span>
                          ) : (
                            <Badge className={getStatusColor(order.workStatus)}>
                              {order.workStatus}
                            </Badge>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {workStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            <Badge className={getStatusColor(status)}>
                              {status}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleViewOrderDetail(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Link to={`/order/${order.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
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
    </>
  );
}
