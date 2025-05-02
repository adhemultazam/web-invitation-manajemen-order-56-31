
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
    <div className="bg-white rounded-md border p-4 mb-4 space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Filter Pesanan</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="search" className="text-sm font-medium">
            Cari
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Nama klien atau pemesan..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="status" className="text-sm font-medium">
            Status Pengerjaan
          </label>
          <Select value={workStatus} onValueChange={setWorkStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {workStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="payment" className="text-sm font-medium">
            Status Pembayaran
          </label>
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger id="payment">
              <SelectValue placeholder="Semua status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Lunas">Lunas</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="vendor" className="text-sm font-medium">
            Vendor/Reseller
          </label>
          <Select value={vendor} onValueChange={setVendor}>
            <SelectTrigger id="vendor">
              <SelectValue placeholder="Semua vendor" />
            </SelectTrigger>
            <SelectContent>
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
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button onClick={handleSearch}>
          Terapkan Filter
        </Button>
      </div>
    </div>
  );
}
