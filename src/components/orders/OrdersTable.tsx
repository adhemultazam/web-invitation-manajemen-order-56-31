
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { format, formatDistance, parseISO } from "date-fns";
import { id } from "date-fns/locale";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Edit, ClockIcon } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EditOrderModal } from "./EditOrderModal";
import { AddOrderModal } from "./AddOrderModal";

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orderStatuses, setOrderStatuses] = useState<{[key: string]: string}>({});

  // Update current time every minute to refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Every minute
    return () => clearInterval(timer);
  }, []);
  
  // Calculate countdown for each order when current time changes
  useEffect(() => {
    const statuses: {[key: string]: string} = {};
    
    orders.forEach(order => {
      if (order.eventDate) {
        try {
          const eventDate = parseISO(order.eventDate);
          const today = new Date();
          
          // Calculate days difference
          const differenceInDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (differenceInDays < 0) {
            // Past event
            statuses[order.id] = "Selesai";
          } else if (differenceInDays === 0) {
            // Today
            statuses[order.id] = "Hari ini!";
          } else if (differenceInDays <= 3) {
            // Urgent (3 days or less)
            statuses[order.id] = `${differenceInDays} hari lagi`;
          } else if (differenceInDays <= 14) {
            // Warning (14 days or less)
            statuses[order.id] = `${differenceInDays} hari lagi`;
          } else {
            // Normal
            statuses[order.id] = formatDistance(eventDate, today, { 
              addSuffix: false,
              locale: id 
            });
          }
        } catch (error) {
          console.error("Error parsing event date:", error);
          statuses[order.id] = "Invalid date";
        }
      } else {
        statuses[order.id] = "-";
      }
    });
    
    setOrderStatuses(statuses);
  }, [orders, currentTime]);

  // Opening and closing modals
  const openDeleteModal = (id: string) => {
    setOrderToDelete(id);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOrderToDelete(null);
  };
  
  const openEditModal = (order: Order) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setOrderToEdit(null);
  };

  // Handle delete and edit actions
  const handleDelete = () => {
    if (orderToDelete) {
      onDeleteOrder(orderToDelete);
      closeDeleteModal();
    }
  };
  
  // Changed the function name from handleEdit to match what EditOrderModal expects
  const handleEditOrder = (editedOrder: Order) => {
    onEditOrder(editedOrder);
    closeEditModal();
  };

  // Helper function to get the appropriate CSS class for the countdown badge
  const getCountdownClass = (orderId: string) => {
    const status = orderStatuses[orderId];
    if (!status || status === "-") return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    
    if (status === "Selesai") return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    if (status === "Hari ini!") return "bg-red-100 text-red-800 hover:bg-red-200";
    
    // Extract the number part from strings like "3 hari lagi"
    const daysMatch = status.match(/^(\d+) hari/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      if (days <= 3) return "bg-red-100 text-red-800 hover:bg-red-200";
      if (days <= 14) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    }
    
    return "bg-green-100 text-green-800 hover:bg-green-200";
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
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Tema</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  <span>Acara</span>
                </div>
              </TableHead>
              <TableHead className="text-right">Pembayaran</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "-"}
                </TableCell>
                <TableCell className="font-medium">{order.clientName}</TableCell>
                <TableCell>{order.theme || "-"}</TableCell>
                <TableCell>{order.vendor || "-"}</TableCell>
                <TableCell>
                  {order.workStatus && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                      {order.workStatus}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getCountdownClass(order.id)} text-xs`}>
                    {order.eventDate ? (
                      <div className="flex items-center">
                        <span className="text-[9px] md:text-xs">{orderStatuses[order.id] || "..."}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={
                    order.paymentStatus === "Lunas" 
                      ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                      : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
                  }>
                    {order.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem 
                        onClick={() => openEditModal(order)}
                        className="flex items-center cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => openDeleteModal(order.id)}
                        className="flex items-center text-red-600 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit order modal */}
      {isEditModalOpen && orderToEdit && (
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
          onEditOrder={handleEditOrder}  // Changed from onSave to onEditOrder to match props
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
