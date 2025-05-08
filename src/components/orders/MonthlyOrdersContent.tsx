
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { EditOrderModal } from "@/components/orders/EditOrderModal";
import { OrdersFilter } from "@/components/orders/OrdersFilter";
import { OrderTable } from "@/components/orders/OrderTable";
import OrderStats from "@/components/orders/OrderStats";
import { OrderDetailModal } from "@/components/orders/OrderDetailModal";
import { Order } from "@/types/types";
import { toast } from "sonner";
import { useOrderUpdates } from "@/hooks/useOrderUpdates";
import { useOrderFilters } from "@/hooks/useOrderFilters";
import { useOrderModals } from "@/hooks/useOrderModals";
import { differenceInDays } from "date-fns";

interface MonthlyOrdersContentProps {
  orders: Order[];
  workStatuses: { id: string; name: string }[];
  vendors: { id: string; color?: string }[];
  themes: { name: string }[];
  packages: { name: string }[];
  addons: { name: string; color: string }[];
  isLoading: boolean;
  addOrder: (order: Omit<Order, "id">) => void;
  editOrder: (orderId: string, data: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
}

export function MonthlyOrdersContent({
  orders,
  workStatuses,
  vendors,
  themes,
  packages,
  addons,
  isLoading,
  addOrder,
  editOrder,
  deleteOrder
}: MonthlyOrdersContentProps) {
  // Use our custom hooks for various functionalities
  const { filteredOrders, searchQuery, setSearchQuery, filterVendor, setFilterVendor, 
         filterWorkStatus, setFilterWorkStatus, filterPaymentStatus, setFilterPaymentStatus } = useOrderFilters(orders);
  
  const { updatingOrders, handleWorkStatusChange, handleVendorChange, 
         handleThemeChange, handlePackageChange, togglePaymentStatus } = useOrderUpdates(editOrder);
  
  const { isAddOrderModalOpen, isEditOrderModalOpen, isDeleteDialogOpen, isDetailModalOpen,
         currentOrder, orderToDelete, handleOpenAddModal, handleCloseAddModal,
         handleEditOrder, handleCloseEditModal, handleViewOrderDetail, handleCloseDetailModal,
         handleOpenDeleteDialog, handleConfirmDelete, setIsDeleteDialogOpen } = useOrderModals(deleteOrder);
  
  // Vendor color mapping
  const vendorColors = {};
  vendors.forEach(vendor => {
    vendorColors[vendor.id] = vendor.color || "#6366f1";
  });
  
  // Addon style mapping
  const addonStyles = {};
  addons.forEach(addon => {
    addonStyles[addon.name] = { color: addon.color || "#6366f1" };
  });
  
  // Calculate countdown days for each order
  const calculateCountdownDays = (eventDate: string): number => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const date = new Date(eventDate);
      return differenceInDays(date, today);
    } catch (error) {
      console.error("Error calculating countdown for order:", error);
      return 0;
    }
  };
  
  const handleAddNewOrder = (order: Omit<Order, "id">) => {
    // Calculate countdown days based on current date and event date
    const countdown = calculateCountdownDays(order.eventDate);
    
    const orderWithCountdown = {
      ...order,
      countdownDays: countdown
    };
    
    addOrder(orderWithCountdown);
    handleCloseAddModal();
    toast.success("Pesanan berhasil ditambahkan");
  };
  
  const handleSaveEditedOrder = (updated: Order) => {
    // Calculate countdown days based on current date and event date
    const countdown = calculateCountdownDays(updated.eventDate);
    
    const updatedWithCountdown = {
      ...updated,
      countdownDays: countdown
    };
    
    editOrder(updatedWithCountdown.id, updatedWithCountdown);
    handleCloseEditModal();
    toast.success("Pesanan berhasil diperbarui");
  };
  
  return (
    <div className="space-y-6">
      {/* Order Stats */}
      <OrderStats orders={filteredOrders} />
      
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
            handleViewOrderDetail={handleViewOrderDetail}
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
          onAddOrder={handleAddNewOrder}
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
          onEditOrder={handleSaveEditedOrder}
          vendors={vendors.map(v => v.id)}
          workStatuses={workStatuses.map(ws => ws.name)}
          addons={addons}
          themes={themes}
          packages={packages}
        />
      )}
      
      {/* Order Detail Modal */}
      {isDetailModalOpen && currentOrder && (
        <OrderDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          order={currentOrder}
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
