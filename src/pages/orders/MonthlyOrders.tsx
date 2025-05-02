
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Order } from "@/types/types";

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

export default function MonthlyOrders() {
  const { month = "" } = useParams<{ month: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

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

    if (filters.workStatus) {
      result = result.filter((order) => order.workStatus === filters.workStatus);
    }

    if (filters.paymentStatus) {
      result = result.filter(
        (order) => order.paymentStatus === filters.paymentStatus
      );
    }

    if (filters.vendor) {
      result = result.filter((order) => order.vendor === filters.vendor);
    }

    setFilteredOrders(result);
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
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Pesanan
        </Button>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-md p-4 text-center">
            <div className="text-sm text-muted-foreground">Total Pesanan</div>
            <div className="text-3xl font-bold mt-1">{orders.length}</div>
          </div>
          <div className="bg-white border rounded-md p-4 text-center">
            <div className="text-sm text-muted-foreground">Selesai</div>
            <div className="text-3xl font-bold mt-1 text-green-500">
              {orders.filter((order) => order.workStatus === "Selesai").length}
            </div>
          </div>
          <div className="bg-white border rounded-md p-4 text-center">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="text-3xl font-bold mt-1 text-blue-500">
              {orders.filter((order) => order.workStatus === "Progress").length +
                orders.filter((order) => order.workStatus === "Review").length +
                orders.filter((order) => order.workStatus === "Revisi").length +
                orders.filter((order) => order.workStatus === "Data Belum").length}
            </div>
          </div>
        </div>
      </div>

      <OrderFilter
        onFilter={handleFilter}
        vendors={vendors}
        workStatuses={workStatuses}
      />

      <OrderTable orders={filteredOrders} />
    </div>
  );
}
