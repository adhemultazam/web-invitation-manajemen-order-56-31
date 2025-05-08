
import { useState } from "react";
import { Order } from "@/types/types";
import { toast } from "sonner";

export function useOrderModals(
  deleteOrderFn: (orderId: string) => void,
) {
  // State for modals
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

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
  
  const handleViewOrderDetail = (order: Order) => {
    setCurrentOrder(order);
    setIsDetailModalOpen(true);
  };
  
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setCurrentOrder(null), 300); // Delay to allow animation to complete
  };
  
  const handleOpenDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (orderToDelete) {
      deleteOrderFn(orderToDelete);
      toast.success("Pesanan berhasil dihapus");
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  return {
    // Modal states
    isAddOrderModalOpen,
    isEditOrderModalOpen,
    isDeleteDialogOpen,
    isDetailModalOpen,
    currentOrder,
    orderToDelete,
    // Modal actions
    handleOpenAddModal,
    handleCloseAddModal,
    handleEditOrder,
    handleCloseEditModal,
    handleViewOrderDetail,
    handleCloseDetailModal,
    handleOpenDeleteDialog,
    handleConfirmDelete,
    setIsDeleteDialogOpen
  };
}
