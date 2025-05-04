
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Search, Filter } from "lucide-react";

interface OrderFilterProps {
  onFilter: (filters: {
    search: string;
    workStatus: string;
    paymentStatus: string;
    vendor: string;
  }) => void;
  vendors: string[];
  workStatuses: string[];
}

export function OrderFilter({ onFilter, vendors, workStatuses }: OrderFilterProps) {
  const [search, setSearch] = useState("");
  const [workStatus, setWorkStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [vendor, setVendor] = useState("all");

  const handleSearch = () => {
    onFilter({
      search,
      workStatus: workStatus === "all" ? "" : workStatus,
      paymentStatus: paymentStatus === "all" ? "" : paymentStatus,
      vendor: vendor === "all" ? "" : vendor,
    });
  };

  const handleReset = () => {
    setSearch("");
    setWorkStatus("all");
    setPaymentStatus("all");
    setVendor("all");
    onFilter({
      search: "",
      workStatus: "",
      paymentStatus: "",
      vendor: "",
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md border dark:border-gray-700 p-3 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filter Pesanan</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="text-xs h-7 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            Reset
          </Button>
          <Button size="sm" onClick={handleSearch} className="text-xs h-7">
            Terapkan Filter
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Nama klien atau pemesan..."
            className="pl-8 h-9 text-sm dark:bg-gray-800 dark:border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={workStatus} onValueChange={setWorkStatus}>
          <SelectTrigger className="h-9 text-sm dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Status Pengerjaan" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">Semua Status Pengerjaan</SelectItem>
            {workStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger className="h-9 text-sm dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Status Pembayaran" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">Semua Status Pembayaran</SelectItem>
            <SelectItem value="Lunas">Lunas</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        <Select value={vendor} onValueChange={setVendor}>
          <SelectTrigger className="h-9 text-sm dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Vendor/Reseller" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="all">Semua Vendor</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor} value={vendor}>
                {vendor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
