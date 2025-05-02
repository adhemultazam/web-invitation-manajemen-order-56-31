
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react";
import { ChartData } from "@/types/types";

// Mock data for charts
const salesData: ChartData = [
  { name: "Jan", value: 10 },
  { name: "Feb", value: 15 },
  { name: "Mar", value: 12 },
  { name: "Apr", value: 18 },
  { name: "Mei", value: 20 },
  { name: "Jun", value: 25 },
  { name: "Jul", value: 22 },
  { name: "Agt", value: 28 },
  { name: "Sep", value: 30 },
  { name: "Okt", value: 0 },
  { name: "Nov", value: 0 },
  { name: "Des", value: 0 },
];

const statusData: ChartData = [
  { name: "Selesai", value: 45 },
  { name: "Progress", value: 25 },
  { name: "Review", value: 15 },
  { name: "Revisi", value: 10 },
  { name: "Data Belum", value: 5 },
];

const paymentByVendorData: ChartData = [
  { name: "Vendor Utama", value: 65 },
  { name: "Reseller Premium", value: 35 },
];

const bestSellingData: ChartData = [
  { name: "Elegant Gold", value: 30 },
  { name: "Floral Pink", value: 25 },
  { name: "Rustic Wood", value: 20 },
  { name: "Minimalist", value: 15 },
  { name: "Lainnya", value: 10 },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("Semua Data");
  const [selectedMonth, setSelectedMonth] = useState("Semua Data");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Ringkasan data penjualan dan status pesanan
        </p>
      </div>

      <FilterBar
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Pesanan"
          value={180}
          icon={<ShoppingCart />}
          description={`${selectedYear} ${selectedMonth !== "Semua Data" ? selectedMonth : ""}`}
        />
        <StatCard
          title="Total Omset"
          value={formatCurrency(45000000)}
          icon={<DollarSign />}
          description={`${selectedYear} ${selectedMonth !== "Semua Data" ? selectedMonth : ""}`}
        />
        <StatCard
          title="Paket Terlaris"
          value="Premium"
          icon={<Package />}
          description={`Terjual: 95 undangan`}
        />
        <StatCard
          title="Vendor Teratas"
          value="Vendor Utama"
          icon={<Users />}
          description={`Penjualan: 120 undangan`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Grafik Penjualan Bulanan"
          description="Jumlah pesanan per bulan"
          data={salesData}
          type="bar"
        />
        <ChartCard
          title="Status Pengerjaan"
          description="Distribusi pesanan berdasarkan status"
          data={statusData}
          type="pie"
          colors={["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Status Pembayaran per Vendor"
          description="Persentase pembayaran lunas berdasarkan vendor"
          data={paymentByVendorData}
          type="bar"
        />
        <ChartCard
          title="Tema Terlaris"
          description="Top 5 tema paling banyak dipesan"
          data={bestSellingData}
          type="bar"
        />
      </div>
    </div>
  );
}
