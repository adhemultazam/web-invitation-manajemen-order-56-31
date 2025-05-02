
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import { Button } from "@/components/ui/button";
import { Plus, CircleDollarSign, Check, X } from "lucide-react";
import { Order } from "@/types/types";
import { AddOrderModal } from "@/components/orders/AddOrderModal";

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: "1",
    orderDate: "2024-09-01",
    eventDate: "2024-10-15",
    countdownDays: 45,
    customerName: "Ahmad Rizki",
    clientName: "Rizki & Putri",
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
const themes = ["Elegant Gold", "Floral Pink", "Rustic Wood", "Minimalist"];

export default function MonthlyOrders() {
  const { month = "" } = useParams<{ month: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Capitalize the first letter of the month
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

  // Set orders based on month (dummy implementation)
  useEffect(() => {
    // In a real app, this would fetch data based on the month
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, [month]);

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
          <h1 className="text-3xl font-bold">Pesanan Bulan {capitalizedMonth}</h1>
          <p className="text-muted-foreground">
            Kelola pesanan undangan untuk bulan {capitalizedMonth}
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pesanan
        </Button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-6 gap-3">
          {/* Total Orders */}
          <div className="bg-white border rounded-md p-3 text-center">
            <div className="text-sm text-muted-foreground">Total Pesanan</div>
            <div className="text-2xl font-bold mt-1">{totalOrders}</div>
          </div>
          
          {/* Completed Orders */}
          <div className="bg-white border rounded-md p-3 text-center">
            <div className="text-sm text-muted-foreground">Selesai</div>
            <div className="text-2xl font-bold mt-1 text-green-500">
              {completedOrders}
            </div>
          </div>
          
          {/* In Progress Orders */}
          <div className="bg-white border rounded-md p-3 text-center">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-2xl font-bold mt-1 text-blue-500">
              {inProgressOrders}
            </div>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-white border rounded-md p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Total Omset</div>
            </div>
            <div className="text-lg font-bold mt-1 text-wedding-primary">
              {formatCurrency(totalRevenue)}
            </div>
          </div>
          
          {/* Paid Orders */}
          <div className="bg-white border rounded-md p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              <div className="text-sm text-muted-foreground">Sudah Lunas</div>
            </div>
            <div className="text-lg font-bold mt-1 text-green-500">
              {paidOrders} ({formatCurrency(paidAmount)})
            </div>
          </div>
          
          {/* Unpaid Orders */}
          <div className="bg-white border rounded-md p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <X className="h-4 w-4 text-red-500" />
              <div className="text-sm text-muted-foreground">Belum Lunas</div>
            </div>
            <div className="text-lg font-bold mt-1 text-red-500">
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
        vendors={vendors}
        workStatuses={workStatuses}
        themes={themes}
        onUpdateOrder={handleUpdateOrder}
      />
      
      <AddOrderModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddOrder={handleAddOrder}
        vendors={vendors}
        workStatuses={workStatuses}
      />
    </div>
  );
}
