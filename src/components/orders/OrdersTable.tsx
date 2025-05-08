
import { useState, useRef } from "react";
import { Order } from "@/types/types";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EditOrderModal } from "./EditOrderModal";
import { OrderTableHeader } from "./OrderTableHeader";
import { OrderTableRow } from "./OrderTableRow";
import { useOrderTableStatus } from "@/hooks/useOrderTableStatus";

interface OrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  vendors: string[];
  workStatuses: string[];
  addons: any[];
  themes: any[];
  packages: any[];
}

export function OrdersTable({
  orders,
  onEditOrder,
  onDeleteOrder,
  vendors,
  workStatuses,
  addons,
  themes,
  packages,
}: OrdersTableProps) {
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [orderToEdit, setOrderToEdit] = useState<Order | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Add refs to track mounted status
  const isMounted = useRef(true);
  
  // Use our custom hook for order statuses
  const { orderStatuses, getCountdownClass } = useOrderTableStatus(orders);

  // Opening and closing modals
  const openDeleteModal = (id: string) => {
    if (isMounted.current) {
      setOrderToDelete(id);
      setIsDeleteModalOpen(true);
    }
  };
  
  const closeDeleteModal = () => {
    if (isMounted.current) {
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        if (isMounted.current) {
          setOrderToDelete(null);
        }
      }, 300); // Delay to allow animation to complete
    }
  };
  
  const openEditModal = (order: Order) => {
    if (isMounted.current) {
      setOrderToEdit(order);
      setIsEditModalOpen(true);
    }
  };
  
  const closeEditModal = () => {
    if (isMounted.current) {
      setIsEditModalOpen(false);
      setTimeout(() => {
        if (isMounted.current) {
          setOrderToEdit(null);
        }
      }, 300); // Delay to allow animation to complete
    }
  };

  // Handle delete and edit actions
  const handleDelete = () => {
    if (orderToDelete && isMounted.current) {
      onDeleteOrder(orderToDelete);
      closeDeleteModal();
    }
  };
  
  const handleEditOrder = (editedOrder: Order) => {
    if (isMounted.current) {
      onEditOrder(editedOrder);
      closeEditModal();
    }
  };

  // Sort orders by date 
  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = a.orderDate ? new Date(a.orderDate).getTime() : 0;
    const dateB = b.orderDate ? new Date(b.orderDate).getTime() : 0;
    return dateB - dateA; // Descending (newest first)
  });
  
  return (
    <div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <OrderTableHeader />
          <TableBody>
            {sortedOrders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                orderStatus={orderStatuses[order.id] || ""}
                countdownClass={getCountdownClass(order.id)}
                openEditModal={openEditModal}
                openDeleteModal={openDeleteModal}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit order modal */}
      {isMounted.current && isEditModalOpen && orderToEdit && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onEditOrder={handleEditOrder}  
          order={orderToEdit}
          vendors={vendors}
          workStatuses={workStatuses}
          addons={addons}
          themes={themes}
          packages={packages}
        />
      )}
      
      {/* Delete confirmation modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus pesanan ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
