import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import { Button } from "@/components/ui/button";
import { Plus, CircleDollarSign, Check, X } from "lucide-react";
import { Order, Addon, Theme, Vendor } from "@/types/types";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { loadVendorsFromStorage } from "@/components/orders/OrderUtils";

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "1",
    orderDate: "2024-09-01",
    eventDate: "2024-10-15",
    countdownDays: 45,
    customerName: "Ahmad Rizki",
    clientName: "Rizki & Putri",
    clientUrl: "https://undangandigital.com/rizki-putri",
    vendor: "Vendor Utama",
    package: "Premium",
    addons: ["Foto Pre-Wedding", "Undangan Fisik"],
    bonuses: ["Video Opening"],
    theme: "Elegant Gold",
    paymentStatus: "Lunas",
    paymentAmount: 350000,
    workStatus: "Progress",
    postPermission: true,
    notes: "Klien meminta perubahan minor pada foto"
  },
  {
    id: "2",
    orderDate: "2024-09-05",
    eventDate: "2024-11-20",
    countdownDays: 75,
    customerName: "Budi Santoso",
    clientName: "Budi & Anisa",
    clientUrl: "https://undangandigital.com/budi-anisa",
    vendor: "Reseller Premium",
    package: "Basic",
    addons: [],
    bonuses: [],
    theme: "Minimalist",
    paymentStatus: "Pending",
    paymentAmount: 150000,
    workStatus: "Data Belum",
    postPermission: false,
    notes: ""
  },
  {
    id: "3",
    orderDate: "2024-09-10",
    eventDate: "2024-09-30",
    countdownDays: 20,
    customerName: "Dewi Kartika",
    clientName: "Kartika & Rendra",
    clientUrl: "https://undangandigital.com/kartika-rendra",
    vendor: "Vendor Utama",
    package: "Premium",
    addons: ["Background Music", "Galeri 20 Foto"],
    bonuses: ["Quotes Islami"],
    theme: "Floral Pink",
    paymentStatus: "Lunas",
    paymentAmount: 400000,
    workStatus: "Review",
    postPermission: true,
    notes: "Urgent - Pernikahan di-reschedule"
  }
];

// Mock vendors and work statuses
const vendors = ["Vendor Utama", "Reseller Premium"];
const workStatuses = ["Selesai", "Progress", "Review", "Revisi", "Data Belum"];
const themes: Theme[] = [
  {
    id: "1",
    name: "Elegant Gold",
    thumbnail: "https://placehold.co/200x280/e9d985/ffffff?text=Elegant+Gold",
    category: "Premium"
  },
  {
    id: "2",
    name: "Floral Pink",
    thumbnail: "https://placehold.co/200x280/ffb6c1/ffffff?text=Floral+Pink",
    category: "Basic"
  },
  {
    id: "3",
    name: "Rustic Wood",
    thumbnail: "https://placehold.co/200x280/8b4513/ffffff?text=Rustic+Wood",
    category: "Premium"
  },
  {
    id: "4",
    name: "Minimalist",
    thumbnail: "https://placehold.co/200x280/f5f5f5/333333?text=Minimalist",
    category: "Basic"
  }
];

// Mock addons data
const defaultAddons: Addon[] = [
  { id: "1", name: "Express", color: "#3b82f6" },
  { id: "2", name: "Super Express", color: "#f97316" },
  { id: "3", name: "Custom Desain", color: "#8b5cf6" },
  { id: "4", name: "Custom Domain", color: "#16a34a" }
];

// Helper function to load orders from localStorage
const loadOrdersFromStorage = (month: string): Order[] => {
  try {
    const storedOrders = localStorage.getItem(`orders_${month}`);
    if (storedOrders) {
      return JSON.parse(storedOrders);
    }
  } catch (e) {
    console.error("Error loading orders from localStorage:", e);
  }
  return [];
};

// Helper function to save orders to localStorage
const saveOrdersToStorage = (month: string, orders: Order[]): void => {
  try {
    localStorage.setItem(`orders_${month}`, JSON.stringify(orders));
  } catch (e) {
    console.error("Error saving orders to localStorage:", e);
  }
};

// Removed the duplicate loadVendorsFromStorage function
// We'll use the imported one from OrderUtils.tsx instead

export default function MonthlyOrders() {
  const { month = "" } = useParams<{ month: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addons, setAddons] = useState<Addon[]>(defaultAddons);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(themes);
  const [availableVendors, setAvailableVendors] = useState<Vendor[]>([]);
  const isMobile = useIsMobile();

  // Capitalize the first letter of the month
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // Set orders based on month and load from localStorage
  useEffect(() => {
    const storedOrders = loadOrdersFromStorage(month);
    
    // If there are stored orders, use them; otherwise use the mock data and save it
    if (storedOrders && storedOrders.length > 0) {
      setOrders(storedOrders);
      setFilteredOrders(storedOrders);
    } else {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      saveOrdersToStorage(month, mockOrders);
    }
  }, [month]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (orders.length > 0) {
      saveOrdersToStorage(month, orders);
    }
  }, [orders, month]);

  // Load vendors, addons, and themes from storage
  useEffect(() => {
    // Load vendors from localStorage
    const loadedVendors = loadVendorsFromStorage();
    setAvailableVendors(loadedVendors);
    
    // Load addons from localStorage
    const storedAddons = localStorage.getItem('addons');
    if (storedAddons) {
      try {
        const parsedAddons = JSON.parse(storedAddons);
        if (Array.isArray(parsedAddons) && parsedAddons.length > 0) {
          setAddons(parsedAddons);
        }
      } catch (e) {
        console.error("Error parsing addons:", e);
      }
    }
    
    // Load themes from localStorage
    const storedThemes = localStorage.getItem('themes');
    if (storedThemes) {
      try {
        const parsedThemes = JSON.parse(storedThemes);
        if (Array.isArray(parsedThemes) && parsedThemes.length > 0) {
          setAvailableThemes(parsedThemes);
        }
      } catch (e) {
        console.error("Error parsing themes:", e);
      }
    }
  }, []);

  const handleFilter = (filters: {
    search: string;
    workStatus: string;
    paymentStatus: string;
    vendor: string;
  }) => {
    let result = orders;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (order) =>
          order.clientName.toLowerCase().includes(searchLower) ||
          order.customerName.toLowerCase().includes(searchLower)
      );
    }

    if (filters.workStatus && filters.workStatus !== "all") {
      result = result.filter((order) => order.workStatus === filters.workStatus);
    }

    if (filters.paymentStatus && filters.paymentStatus !== "all") {
      result = result.filter(
        (order) => order.paymentStatus === filters.paymentStatus
      );
    }

    if (filters.vendor && filters.vendor !== "all") {
      result = result.filter((order) => order.vendor === filters.vendor);
    }

    setFilteredOrders(result);
  };

  const handleUpdateOrder = (id: string, data: Partial<Order>) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, ...data } : order
    );
    
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders.filter(order => 
      filteredOrders.some(fo => fo.id === order.id)
    ));
    
    // Save to localStorage
    saveOrdersToStorage(month, updatedOrders);
  };

  const handleAddOrder = (orderData: Omit<Order, "id">) => {
    const newOrder: Order = {
      ...orderData,
      id: (orders.length + 1).toString(),
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    setIsAddModalOpen(false);
    
    // Save to localStorage
    saveOrdersToStorage(month, updatedOrders);
  };

  // Calculate statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.workStatus === "Selesai").length;
  const inProgressOrders = orders.filter(order => order.workStatus !== "Selesai").length;
  const paidOrders = orders.filter(order => order.paymentStatus === "Lunas").length;
  const unpaidOrders = orders.filter(order => order.paymentStatus !== "Lunas").length;
  
  const totalRevenue = orders
    .filter(order => order.paymentStatus === "Lunas")
    .reduce((sum, order) => sum + order.paymentAmount, 0);
  
  const paidAmount = orders
    .filter(order => order.paymentStatus === "Lunas")
    .reduce((sum, order) => sum + order.paymentAmount, 0);
    
  const unpaidAmount = orders
    .filter(order => order.paymentStatus === "Pending")
    .reduce((sum, order) => sum + order.paymentAmount, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Pesanan Bulan {capitalizedMonth}</h1>
          <p className="text-muted-foreground text-sm">
            Kelola pesanan undangan untuk bulan {capitalizedMonth}
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pesanan
        </Button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* Statistics cards */}
          {/* Total Orders */}
          <div className="bg-white border rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">Total Pesanan</div>
            <div className="text-lg font-bold mt-1">{totalOrders}</div>
          </div>
          
          {/* Completed Orders */}
          <div className="bg-white border rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">Selesai</div>
            <div className="text-lg font-bold mt-1 text-green-500">
              {completedOrders}
            </div>
          </div>
          
          {/* In Progress Orders */}
          <div className="bg-white border rounded-md p-2 text-center">
            <div className="text-xs text-muted-foreground">Progress</div>
            <div className="text-lg font-bold mt-1 text-blue-500">
              {inProgressOrders}
            </div>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-white border rounded-md p-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <CircleDollarSign className="h-3 w-3 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Total Omset</div>
            </div>
            <div className="text-sm font-bold mt-1 text-wedding-primary">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          
          {/* Paid Orders */}
          <div className="bg-white border rounded-md p-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <div className="text-xs text-muted-foreground">Sudah Lunas</div>
            </div>
            <div className="text-sm font-bold mt-1 text-green-500">
              {paidOrders} ({formatCurrency(paidAmount)})
            </div>
          </div>
          
          {/* Unpaid Orders */}
          <div className="bg-white border rounded-md p-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <X className="h-3 w-3 text-red-500" />
              <div className="text-xs text-muted-foreground">Belum Lunas</div>
            </div>
            <div className="text-sm font-bold mt-1 text-red-500">
              {unpaidOrders} ({formatCurrency(unpaidAmount)})
            </div>
          </div>
        </div>
      </div>

      <OrderFilter
        onFilter={handleFilter}
        vendors={vendors}
        workStatuses={workStatuses}
      />

      <OrderTable 
        orders={filteredOrders} 
        vendors={availableVendors} // Pass vendor objects here
        workStatuses={workStatuses}
        themes={availableThemes.map(theme => theme.name)} // Convert Theme[] to string[]
        onUpdateOrder={handleUpdateOrder}
        addons={addons} // Now this properly matches the updated OrderTableProps interface
      />
      
      <AddOrderModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrder={handleAddOrder}
        vendors={vendors} // This should remain as string[] for now
        workStatuses={workStatuses}
        addons={addons} // Pass addons to AddOrderModal
      />

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 px-4 z-10">
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-xs">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Dashboard</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-xs text-wedding-primary">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <span>Pesanan</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs"
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>Tambah</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex flex-col items-center text-xs">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span>Pengaturan</span>
          </Button>
        </div>
      )}
    </div>
  );
}
