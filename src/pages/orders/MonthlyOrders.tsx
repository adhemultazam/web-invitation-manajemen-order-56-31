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
  
  // Fetching data
  const { orders, isLoading, addOrder, editOrder, deleteOrder } = useOrdersData(currentYear, month ? getMonthTranslation(month) : undefined);
  const { vendors } = useVendorsData();
  const { workStatuses, addons, themes, packages } = useOrderResources();
  
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
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-wedding-primary border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div className="flex flex-col">
                            {order.clientUrl ? (
                              <a 
                                href={order.clientUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-sm text-blue-500 hover:underline"
                              >
                                {order.clientName}
                              </a>
                            ) : (
                              <span className="font-medium text-sm">{order.clientName}</span>
                            )}
                            <span className="text-xs text-muted-foreground">{order.customerName}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{format(new Date(order.orderDate), "dd MMM yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs">{format(new Date(order.eventDate), "dd MMM yyyy")}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className={`text-xs ${order.countdownDays < 0 ? "text-red-500 font-semibold" : ""}`}>
                              {order.countdownDays} hari lagi
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getVendorName(order.vendor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200 text-xs">
                            <Package className="mr-1 h-3 w-3" />
                            {order.package}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200 text-xs">
                            {order.theme}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          order.workStatus === 'Selesai' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                          order.workStatus === 'Proses' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                          'bg-orange-100 text-orange-800 hover:bg-orange-100'
                        }>
                          {order.workStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={order.paymentStatus === "Lunas" ? "outline" : "default"} 
                            className={order.paymentStatus === "Lunas" ? 
                              "bg-green-100 text-green-800 hover:bg-green-100 border-green-200" : ""}>
                            {order.paymentStatus}
                          </Badge>
                          <span className="text-xs font-medium">{formatCurrency(order.paymentAmount)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleOpenDeleteDialog(order.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      {searchQuery || filterVendor !== "all" || filterWorkStatus !== "all" || filterPaymentStatus !== "all" ?
                        "Tidak ada pesanan yang sesuai dengan filter" :
                        "Belum ada pesanan untuk bulan ini"
                      }
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Add Order Modal - Remove countdown days input and auto-calculate */}
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
      
      {/* Edit Order Modal - Remove countdown days input and auto-calculate */}
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
