
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Order, Addon, Vendor, Theme, WorkStatus, Package } from "@/types/types";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderDetailModal } from "./OrderDetailModal";
import { EditOrderDialog } from "./EditOrderDialog";
import OrderTableHeader from "./OrderTableHeader";
import OrderTableRow from "./OrderTableRow";
import MobileOrderCard from "./MobileOrderCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { 
  formatCurrency, 
  formatDate, 
  isPastDate, 
  loadVendorsFromStorage,
  loadAddonsFromStorage,
  loadWorkStatusesFromStorage
} from "./OrderUtils";

interface OrderTableProps {
  orders: Order[];
  vendors: Vendor[];
  workStatuses: string[];
  themes: string[];
  onUpdateOrder: (id: string, data: Partial<Order>) => void;
  addons: Addon[];
}

export function OrderTable({ orders, vendors, workStatuses, themes, onUpdateOrder, addons }: OrderTableProps) {
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [vendorColors, setVendorColors] = useState<Record<string, string>>({});
  const [addonStyles, setAddonStyles] = useState<Record<string, {color: string}>>({});
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);
  const [availableAddons, setAvailableAddons] = useState<Addon[]>(addons || []);
  const [availableWorkStatuses, setAvailableWorkStatuses] = useState<WorkStatus[]>([]);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const [availablePackages, setAvailablePackages] = useState<Package[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Use passed vendors prop instead of loading from localStorage again
    if (vendors && vendors.length > 0) {
      const colors: Record<string, string> = {};
      vendors.forEach(vendor => {
        colors[vendor.id] = vendor.color || '#6366f1';
      });
      setVendorColors(colors);
      setAvailableVendors(vendors);
    } else {
      // Fallback to localStorage only if vendors prop is empty
      try {
        const parsedVendors = loadVendorsFromStorage();
        const colors: Record<string, string> = {};
        parsedVendors.forEach(vendor => {
          colors[vendor.id] = vendor.color || '#6366f1';
        });
        setVendorColors(colors);
        setAvailableVendors(parsedVendors);
      } catch (e) {
        console.error("Error parsing vendors:", e);
      }
    }
    
    // Update availableAddons when addons prop changes
    if (addons && addons.length > 0) {
      setAvailableAddons(addons);
      
      // Create addon styles from passed addons
      const styles: Record<string, {color: string}> = {};
      addons.forEach(addon => {
        styles[addon.name] = { color: addon.color || '#6366f1' };
      });
      setAddonStyles(styles);
    } else {
      // Load addon styles from localStorage as fallback
      try {
        const parsedAddons = loadAddonsFromStorage();
        const styles: Record<string, {color: string}> = {};
        parsedAddons.forEach(addon => {
          styles[addon.name] = { color: addon.color || '#6366f1' };
        });
        setAddonStyles(styles);
        setAvailableAddons(parsedAddons);
      } catch (e) {
        console.error("Error parsing addons:", e);
      }
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
    
    // Load work statuses
    const workStatuses = loadWorkStatusesFromStorage();
    setAvailableWorkStatuses(workStatuses);
    
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
  }, [vendors, addons]);

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
      
      // Find vendor name by ID for the toast message
      const vendorName = availableVendors.find(v => v.id === newVendor)?.name || newVendor;
      toast.success(`Vendor diubah menjadi ${vendorName}`);
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

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (!orderToDelete) return;
    
    // Find current month from order date
    const orderDate = new Date(orderToDelete.orderDate);
    const monthNames = [
      "januari", "februari", "maret", "april", "mei", "juni",
      "juli", "agustus", "september", "oktober", "november", "desember"
    ];
    const monthIndex = orderDate.getMonth();
    const monthKey = `orders_${monthNames[monthIndex]}`;
    
    try {
      // Get all orders for the month
      const storedOrders = localStorage.getItem(monthKey);
      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        const updatedOrders = parsedOrders.filter((o: Order) => o.id !== orderToDelete.id);
        localStorage.setItem(monthKey, JSON.stringify(updatedOrders));
        
        // Notify parent component to update its state
        onUpdateOrder(orderToDelete.id, { id: orderToDelete.id });
        
        toast.success(`Pesanan ${orderToDelete.clientName} berhasil dihapus`);
      }
    } catch (e) {
      console.error("Error deleting order:", e);
      toast.error("Gagal menghapus pesanan");
    } finally {
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  // Render for mobile view
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
              <MobileOrderCard
                key={order.id}
                order={order}
                updatingOrders={updatingOrders}
                vendorColors={vendorColors}
                addonStyles={addonStyles}
                availableWorkStatuses={availableWorkStatuses}
                availablePackages={availablePackages}
                vendors={availableVendors}
                themes={themes}
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

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pesanan "{orderToDelete?.clientName}"? 
                Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-500 hover:bg-red-600"
                onClick={confirmDeleteOrder}
              >
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Desktop view
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <OrderTableHeader />
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                    Tidak ada data pesanan
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <OrderTableRow
                    key={order.id}
                    order={order}
                    updatingOrders={updatingOrders}
                    vendorColors={vendorColors}
                    addonStyles={addonStyles}
                    availableWorkStatuses={availableWorkStatuses}
                    availablePackages={availablePackages}
                    vendors={availableVendors}
                    themes={themes}
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
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {selectedOrder && (
        <>
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
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus pesanan "{orderToDelete?.clientName}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDeleteOrder}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
