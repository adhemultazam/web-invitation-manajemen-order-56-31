import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { EditOrderModal } from "@/components/orders/EditOrderModal";
import { OrdersFilter } from "@/components/orders/OrdersFilter";
import { OrderTable } from "@/components/orders/OrderTable";
import OrderStats from "@/components/orders/OrderStats";
import { useOrdersData } from "@/hooks/useOrdersData";
import { useVendorsData } from "@/hooks/useVendorsData";
import { useOrderResources } from "@/hooks/useOrderResources";
import { Order } from "@/types/types";
import { 
  Calendar, 
  Clock, 
  Edit, 
  MoreHorizontal, 
  Package, 
  Plus, 
  Search, 
  Trash, 
  User 
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { toast } from "sonner";

// Helper function to map month names to their numbers
const getMonthNumber = (monthName: string): string => {
  const months: { [key: string]: string } = {
    'januari': '01',
    'februari': '02',
    'maret': '03',
    'april': '04',
    'mei': '05',
    'juni': '06',
    'juli': '07',
    'agustus': '08',
    'september': '09',
    'oktober': '10',
    'november': '11',
    'desember': '12'
  };
  
  return months[monthName.toLowerCase()] || '';
};

// Helper to get month translation
const getMonthTranslation = (monthName: string): string => {
  const translations: { [key: string]: string } = {
    'januari': 'Januari',
    'februari': 'Februari',
    'maret': 'Maret',
    'april': 'April',
    'mei': 'Mei',
    'juni': 'Juni',
    'juli': 'Juli',
    'agustus': 'Agustus',
    'september': 'September',
    'oktober': 'Oktober',
    'november': 'November',
    'desember': 'Desember'
  };
  
  return translations[monthName.toLowerCase()] || 'Unknown Month';
};

// Format currency to rupiah
const formatCurrency = (amount: string | number): string => {
  // Parse amount to number if it's a string
  let numericAmount: number;
  if (typeof amount === 'string') {
    // Remove non-numeric characters except decimal point
    const sanitized = amount.replace(/[^0-9.]/g, '');
    numericAmount = parseFloat(sanitized);
  } else {
    numericAmount = amount;
  }
  
  // Check if it's a valid number
  if (isNaN(numericAmount)) {
    return 'Rp 0';
  }
  
  // Format to IDR
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numericAmount);
};

export default function MonthlyOrders() {
  const { month } = useParams<{ month: string }>();
  const currentYear = new Date().getFullYear().toString();
  
  // State for modals
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  // Track orders being updated for UI feedback
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  
  // Fetching data
  const { orders, isLoading, addOrder, editOrder, deleteOrder } = useOrdersData(currentYear, month ? getMonthTranslation(month) : undefined);
  const { vendors } = useVendorsData();
  const { workStatuses, addons, themes, packages } = useOrderResources();
  
  // Vendor color mapping
  const vendorColors = useMemo(() => {
    const colors: Record<string, string> = {};
    vendors.forEach(vendor => {
      colors[vendor.id] = vendor.color || "#6366f1";
    });
    return colors;
  }, [vendors]);
  
  // Addon style mapping
  const addonStyles = useMemo(() => {
    const styles: Record<string, { color: string }> = {};
    addons.forEach(addon => {
      styles[addon.name] = { color: addon.color || "#6366f1" };
    });
    return styles;
  }, [addons]);
  
  // Calculate countdown days for each order
  useEffect(() => {
    if (orders.length > 0) {
      const updatedOrders = orders.map(order => {
        try {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const eventDate = new Date(order.eventDate);
          const countdown = differenceInDays(eventDate, today);
          
          // Only update if countdown doesn't match
          if (order.countdownDays !== countdown) {
            return {
              ...order,
              countdownDays: countdown
            };
          }
        } catch (error) {
          console.error("Error calculating countdown for order:", order.id);
        }
        return order;
      });

      // Update orders with new countdown values if needed
      const hasChanges = updatedOrders.some((order, index) => 
        order.countdownDays !== orders[index].countdownDays
      );
      
      if (hasChanges) {
        // Update the orders in local storage
        try {
          localStorage.setItem(`orders_${month?.toLowerCase()}`, JSON.stringify(updatedOrders));
        } catch (error) {
          console.error("Error updating orders countdown:", error);
        }
      }
    }
  }, [orders, month]);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVendor, setFilterVendor] = useState<string>("all");
  const [filterWorkStatus, setFilterWorkStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  
  // Apply filters to orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search query filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        searchQuery === "" || 
        order.clientName.toLowerCase().includes(searchLower) ||
        (order.clientUrl && order.clientUrl.toLowerCase().includes(searchLower)) ||
        order.id.toLowerCase().includes(searchLower);
      
      // Vendor filter
      const matchesVendor = filterVendor === "all" || order.vendor === filterVendor;
      
      // Work status filter
      const matchesWorkStatus = filterWorkStatus === "all" || order.workStatus === filterWorkStatus;
      
      // Payment status filter
      const matchesPaymentStatus = filterPaymentStatus === "all" || order.paymentStatus === filterPaymentStatus;
      
      return matchesSearch && matchesVendor && matchesWorkStatus && matchesPaymentStatus;
    });
  }, [orders, searchQuery, filterVendor, filterWorkStatus, filterPaymentStatus]);
  
  // Handler functions
  const handleOpenAddModal = () => {
    setIsAddOrderModalOpen(true);
  };
  
  const handleCloseAddModal = () => {
    setIsAddOrderModalOpen(false);
  };
  
  const handleEditOrder = (order: Order) => {
    setCurrentOrder(order);
    setIsEditOrderModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
    setIsEditOrderModalOpen(false);
    setCurrentOrder(null);
  };
  
  const handleOpenDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrder(orderToDelete);
      toast.success("Pesanan berhasil dihapus");
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };
  
  // Field update handlers
  const handleWorkStatusChange = (orderId: string, status: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    editOrder(orderId, { workStatus: status });
    
    // Remove visual indicator after a delay
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const handleVendorChange = (orderId: string, vendor: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    editOrder(orderId, { vendor });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const handleThemeChange = (orderId: string, theme: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    editOrder(orderId, { theme });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const handlePackageChange = (orderId: string, pkg: string) => {
    setUpdatingOrders(prev => new Set(prev).add(orderId));
    
    // Find package price
    const packageObj = packages.find(p => p.name === pkg);
    if (packageObj) {
      editOrder(orderId, { 
        package: pkg,
        paymentAmount: typeof packageObj.price === 'number' ? packageObj.price : 0
      });
    } else {
      editOrder(orderId, { package: pkg });
    }
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }, 500);
  };
  
  const togglePaymentStatus = (order: Order) => {
    setUpdatingOrders(prev => new Set(prev).add(order.id));
    
    const newStatus = order.paymentStatus === "Lunas" ? "Pending" : "Lunas";
    editOrder(order.id, { paymentStatus: newStatus });
    
    setTimeout(() => {
      setUpdatingOrders(prev => {
        const newSet = new Set(prev);
        newSet.delete(order.id);
        return newSet;
      });
    }, 500);
  };
  
  // Get vendor name by ID
  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : vendorId;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pesanan {month && getMonthTranslation(month)}</h2>
          <p className="text-sm text-muted-foreground">
            Data pesanan undangan digital untuk periode bulan {month && getMonthTranslation(month)}
          </p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2 h-4 w-4" /> Tambah Pesanan
        </Button>
      </div>
      
      {/* Restored Order Stats */}
      <OrderStats 
        orders={filteredOrders} 
        formatCurrency={formatCurrency} 
      />
      
      <OrdersFilter 
        vendors={vendors}
        workStatuses={workStatuses}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterVendor={filterVendor}
        setFilterVendor={setFilterVendor}
        filterWorkStatus={filterWorkStatus}
        setFilterWorkStatus={setFilterWorkStatus}
        filterPaymentStatus={filterPaymentStatus}
        setFilterPaymentStatus={setFilterPaymentStatus}
      />
      
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <OrderTable 
            orders={filteredOrders}
            availableWorkStatuses={workStatuses}
            availableVendors={vendors}
            availableThemes={themes}
            availablePackages={packages}
            updatingOrders={updatingOrders}
            vendorColors={vendorColors}
            addonStyles={addonStyles}
            handleViewOrderDetail={(order) => console.log("View order", order.id)}
            handleOpenEditDialog={handleEditOrder}
            handleDeleteOrder={(order) => handleOpenDeleteDialog(order.id)}
            togglePaymentStatus={togglePaymentStatus}
            handleWorkStatusChange={handleWorkStatusChange}
            handleVendorChange={handleVendorChange}
            handleThemeChange={handleThemeChange}
            handlePackageChange={handlePackageChange}
          />
        </CardContent>
      </Card>
      
      {/* Add Order Modal */}
      {isAddOrderModalOpen && (
        <AddOrderModal
          isOpen={isAddOrderModalOpen}
          onClose={handleCloseAddModal}
          onAddOrder={(order) => {
            // Calculate countdown days based on current date and event date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(order.eventDate);
            const countdown = differenceInDays(eventDate, today);
            
            const orderWithCountdown = {
              ...order,
              countdownDays: countdown
            };
            
            addOrder(orderWithCountdown);
            handleCloseAddModal();
            toast.success("Pesanan berhasil ditambahkan");
          }}
          vendors={vendors.map(v => v.id)}
          workStatuses={workStatuses.map(ws => ws.name)}
          addons={addons}
          themes={themes}
          packages={packages}
        />
      )}
      
      {/* Edit Order Modal */}
      {isEditOrderModalOpen && currentOrder && (
        <EditOrderModal
          isOpen={isEditOrderModalOpen}
          onClose={handleCloseEditModal}
          order={currentOrder}
          onEditOrder={(updated) => {
            // Calculate countdown days based on current date and event date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(updated.eventDate);
            const countdown = differenceInDays(eventDate, today);
            
            const updatedWithCountdown = {
              ...updated,
              countdownDays: countdown
            };
            
            editOrder(updatedWithCountdown.id, updatedWithCountdown);
            handleCloseEditModal();
            toast.success("Pesanan berhasil diperbarui");
          }}
          vendors={vendors.map(v => v.id)}
          workStatuses={workStatuses.map(ws => ws.name)}
          addons={addons}
          themes={themes}
          packages={packages}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
