
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Search, Filter as FilterIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  // Apply filters whenever any filter value changes
  useEffect(() => {
    handleSearch();
  }, [search, workStatus, paymentStatus, vendor]);

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
    <div className="flex flex-col md:flex-row gap-2 mb-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pesanan..."
          className="pl-8 pr-4 h-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Work Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[150px]">
            <FilterIcon className="h-4 w-4" />
            <span>Filter Status</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setWorkStatus("all")}
            className={workStatus === "all" ? "bg-accent" : ""}
          >
            Semua Status
          </DropdownMenuItem>
          {workStatuses.map((status) => (
            <DropdownMenuItem 
              key={status} 
              onClick={() => setWorkStatus(status)}
              className={workStatus === status ? "bg-accent" : ""}
            >
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Payment Status Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[180px]">
            <FilterIcon className="h-4 w-4" />
            <span>Filter Pembayaran</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setPaymentStatus("all")}
            className={paymentStatus === "all" ? "bg-accent" : ""}
          >
            Semua Status Pembayaran
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setPaymentStatus("Lunas")}
            className={paymentStatus === "Lunas" ? "bg-accent" : ""}
          >
            Lunas
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setPaymentStatus("Pending")}
            className={paymentStatus === "Pending" ? "bg-accent" : ""}
          >
            Belum Lunas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Vendor Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2 min-w-[160px]">
            <FilterIcon className="h-4 w-4" />
            <span>Filter Vendor</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem 
            onClick={() => setVendor("all")}
            className={vendor === "all" ? "bg-accent" : ""}
          >
            Semua Vendor
          </DropdownMenuItem>
          {vendors.map((vendorName) => (
            <DropdownMenuItem 
              key={vendorName} 
              onClick={() => setVendor(vendorName)}
              className={vendor === vendorName ? "bg-accent" : ""}
            >
              {vendorName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Button - Only show when filters are applied */}
      {(search || workStatus !== "all" || paymentStatus !== "all" || vendor !== "all") && (
        <Button variant="ghost" onClick={handleReset} className="px-3 h-10">
          Reset
        </Button>
      )}
    </div>
  );
}
