import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Order, Vendor, WorkStatus, Theme, Package, Addon } from "@/types/types";
import { PlusCircle, Search, SlidersHorizontal, Filter, ChevronDown } from "lucide-react";
import { format, parseISO, differenceInDays, isBefore } from "date-fns";
import { id } from "date-fns/locale";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { EditOrderDialog } from "@/components/orders/EditOrderDialog";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import OrderStats from "@/components/orders/OrderStats";
import MobileOrderCard from "@/components/orders/MobileOrderCard";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useIsMobile } from "@/hooks/use-mobile";

const indonesianMonths = [
  "januari", "februari", "maret", "april", "mei", "juni",
  "juli", "agustus", "september", "oktober", "november", "desember"
];

export default function MonthlyOrders() {
  const { month = "januari" } = useParams<{ month: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State for orders and UI
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string | null>(null);
  const [vendorFilter, setVendorFilter] = useState<string | null>(null);
  
  // State for add/edit modals
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  
  // State for available data
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  
  // State for UI updates
  const [updatingOrders, setUpdatingOrders] = useState<Set<string>>(new Set());
  const [vendorColors, setVendorColors] = useState<Record<string, string>>({});
  const [addonStyles, setAddonStyles] = useState<Record<string, { color: string }>>({});
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // Check if month is valid
  useEffect(() => {
    const normalizedMonth = month.toLowerCase();
    if (!indonesianMonths.includes(normalizedMonth)) {
      navigate("/bulan/januari", { replace: true });
    }
  }, [month, navigate]);
  
  // Load orders from localStorage
  useEffect(() => {
    const loadOrders = () => {
      try {
        const normalizedMonth = month.toLowerCase();
        const storageKey = `orders_${normalizedMonth}`;
        const storedOrders = localStorage.getItem(storageKey);
        
        if (storedOrders) {
          const parsedOrders = JSON.parse(storedOrders);
          setOrders(parsedOrders);
          setFilteredOrders(parsedOrders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("Gagal memuat data pesanan");
      }
    };
    
    loadOrders();
  }, [month]);
  
  // Load vendors, work statuses, themes, and packages from localStorage
  useEffect(() => {
    const loadVendors = () => {
      try {
        const storedVendors = localStorage.getItem("vendors");
        if (storedVendors) {
          const parsedVendors = JSON.parse(storedVendors);
          setVendors(parsedVendors);
          
          // Create a map of vendor IDs to colors
          const colors: Record<string, string> = {};
          parsedVendors.forEach((vendor: Vendor) => {
            colors[vendor.id] = vendor.color || '#6366f1';
          });
          setVendorColors(colors);
        }
      } catch (error) {
        console.error("Error loading vendors:", error);
      }
    };
    
    const loadWorkStatuses = () => {
      try {
        const storedStatuses = localStorage.getItem("workStatuses");
        if (storedStatuses) {
          const parsedStatuses = JSON.parse(storedStatuses);
          setWorkStatuses(parsedStatuses);
        }
      } catch (error) {
        console.error("Error loading work statuses:", error);
      }
    };
    
    const loadThemes = () => {
      try {
        const storedThemes = localStorage.getItem("themes");
        if (storedThemes) {
          const parsedThemes = JSON.parse(storedThemes);
          setThemes(parsedThemes);
        }
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    };
    
    const loadPackages = () => {
      try {
        const storedPackages = localStorage.getItem("packages");
        if (storedPackages) {
          const parsedPackages = JSON.parse(storedPackages);
          setPackages(parsedPackages);
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      }
    };
    
    const loadAddons = () => {
      try {
        const storedAddons = localStorage.getItem("addons");
        if (storedAddons) {
          const parsedAddons = JSON.parse(storedAddons);
          setAddons(parsedAddons);
          
          // Create a map of addon names to styles
          const styles: Record<string, { color: string }> = {};
          parsedAddons.forEach((addon: Addon) => {
            styles[addon.name] = { color: addon.color || '#6366f1' };
          });
          setAddonStyles(styles);
        }
      } catch (error) {
        console.error("Error loading addons:", error);
      }
    };
    
    loadVendors();
    loadWorkStatuses();
    loadThemes();
    loadPackages();
    loadAddons();
  }, []);
  
  // Apply filters when search query or filters change
  useEffect(() => {
    const applyFilters = () => {
      let result = [...orders];
      
      // Apply search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          (order) =>
            order.clientName.toLowerCase().includes(query) ||
            order.customerName.toLowerCase().includes(query) ||
            order.id.toLowerCase().includes(query)
        );
      }
      
      // Apply status filter
      if (statusFilter) {
        result = result.filter((order) => order.workStatus === statusFilter);
      }
      
      // Apply payment status filter
      if (paymentStatusFilter) {
        result = result.filter((order) => order.paymentStatus === paymentStatusFilter);
      }
      
      // Apply vendor filter
      if (vendorFilter) {
        result = result.filter((order) => order.vendor === vendorFilter);
      }
      
      setFilteredOrders(result);
    };
    
    applyFilters();
  }, [orders, searchQuery, statusFilter, paymentStatusFilter, vendorFilter]);
  
  // Save orders to localStorage
  const saveOrders = (updatedOrders: Order[]) => {
    try {
      const normalizedMonth = month.toLowerCase();
      const storageKey = `orders_${normalizedMonth}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Error saving orders:", error);
      toast.error("Gagal menyimpan data pesanan");
    }
  };
  
  // Utility functions
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, "dd MMM yyyy", { locale: id });
    } catch (error) {
      return dateString;
    }
  };
  
  const isPastDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isBefore(date, new Date());
    } catch (error) {
      return false;
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Order actions
  const handleAddOrder = (orderData: Omit<Order, "id">) => {
    const newOrder: Order = {
      id: uuidv4(),
      ...orderData,
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrders(updatedOrders);
    
    setIsAddOrderOpen(false);
    toast.success("Pesanan berhasil ditambahkan");
  };
  
  const handleUpdateOrder = (orderId: string, data: Partial<Order>) => {
    const orderIndex = orders.findIndex((order) => order.id === orderId);
    
    if (orderIndex !== -1) {
      setUpdatingOrders((prev) => new Set(prev).add(orderId));
      
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = { ...updatedOrders[orderIndex], ...data };
      
      setOrders(updatedOrders);
      saveOrders(updatedOrders);
      
      setTimeout(() => {
        setUpdatingOrders((prev) => {
          const newSet = new Set(prev);
          newSet.delete(orderId);
          return newSet;
        });
      }, 500);
    }
  };
  
  const handleDeleteOrder = (order: Order) => {
    if (confirm(`Hapus pesanan "${order.clientName}"?`)) {
      const updatedOrders = orders.filter((o) => o.id !== order.id);
      setOrders(updatedOrders);
      saveOrders(updatedOrders);
      toast.success("Pesanan berhasil dihapus");
    }
  };
  
  // Event handlers
  const togglePaymentStatus = (order: Order) => {
    const newStatus = order.paymentStatus === "Lunas" ? "Pending" : "Lunas";
    handleUpdateOrder(order.id, { paymentStatus: newStatus });
  };
  
  const handleWorkStatusChange = (orderId: string, status: string) => {
    handleUpdateOrder(orderId, { workStatus: status });
  };
  
  const handleVendorChange = (orderId: string, vendor: string) => {
    handleUpdateOrder(orderId, { vendor });
  };
  
  const handleThemeChange = (orderId: string, theme: string) => {
    handleUpdateOrder(orderId, { theme });
  };
  
  const handlePackageChange = (orderId: string, pkg: string) => {
    // Find the package to get its price
    const packageObj = packages.find((p) => p.name === pkg);
    
    if (packageObj) {
      handleUpdateOrder(orderId, { 
        package: pkg,
        paymentAmount: packageObj.price 
      });
    } else {
      handleUpdateOrder(orderId, { package: pkg });
    }
  };
  
  const handleViewOrderDetail = (order: Order) => {
    setViewingOrder(order);
    // In a real app, this would open a modal with order details
    toast.info(`Melihat detail pesanan: ${order.clientName}`);
  };
  
  const handleOpenEditDialog = (order: Order) => {
    setEditingOrder(order);
  };
  
  const handleSaveOrder = (orderId: string, data: Partial<Order>) => {
    handleUpdateOrder(orderId, data);
    toast.success("Pesanan berhasil diperbarui");
  };
  
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setPaymentStatusFilter(null);
    setVendorFilter(null);
  };
  
  // Handle filter changes from OrderFilter component
  const handleFilterChange = (filters: {
    search: string;
    workStatus: string;
    paymentStatus: string;
    vendor: string;
  }) => {
    setSearchQuery(filters.search);
    setStatusFilter(filters.workStatus || null);
    setPaymentStatusFilter(filters.paymentStatus || null);
    setVendorFilter(filters.vendor || null);
  };
  
  // Get the title for the current month
  const getMonthTitle = () => {
    const normalizedMonth = month.toLowerCase();
    const index = indonesianMonths.findIndex(m => m === normalizedMonth);
    
    if (index !== -1) {
      return normalizedMonth.charAt(0).toUpperCase() + normalizedMonth.slice(1);
    }
    
    return "Pesanan Bulanan";
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Pesanan {getMonthTitle()}</h1>
        <Button onClick={() => setIsAddOrderOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Pesanan
        </Button>
      </div>
      
      {/* Order Statistics */}
      <OrderStats orders={orders} formatCurrency={formatCurrency} />
      
      {/* Order Filters */}
      <OrderFilter
        onFilter={handleFilterChange}
        vendors={vendors.map(v => v.id)}
        workStatuses={workStatuses.map(s => s.name)}
      />
      
      {filteredOrders.length === 0 ? (
        <div className="bg-muted rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Tidak ada pesanan</h3>
          <p className="text-muted-foreground mb-4">
            Belum ada pesanan untuk {getMonthTitle()} atau tidak ada pesanan yang cocok dengan filter.
          </p>
          <Button variant="outline" onClick={() => setIsAddOrderOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Pesanan Pertama
          </Button>
        </div>
      ) : (
        <>
          {isMobile ? (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <MobileOrderCard
                  key={order.id}
                  order={order}
                  updatingOrders={updatingOrders}
                  vendorColors={vendorColors}
                  addonStyles={addonStyles}
                  availableWorkStatuses={workStatuses}
                  availablePackages={packages}
                  vendors={vendors}
                  themes={themes.map(t => t.name)}
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
              ))}
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              updatingOrders={updatingOrders}
              vendorColors={vendorColors}
              addonStyles={addonStyles}
              workStatuses={workStatuses}
              vendors={vendors}
              packages={packages}
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
          )}
        </>
      )}
      
      {/* Modals */}
      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onAddOrder={handleAddOrder}
        vendors={vendors.map(v => v.id)}
        workStatuses={workStatuses.map(s => s.name)}
        addons={addons}
      />
      
      {editingOrder && (
        <EditOrderDialog
          order={editingOrder}
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveOrder}
          vendors={vendors}
          workStatuses={workStatuses}
          themes={themes}
          addons={addons}
          packages={packages}
        />
      )}
    </div>
  );
}
