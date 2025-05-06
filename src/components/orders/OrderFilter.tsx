
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Search, Filter as FilterIcon, X } from "lucide-react";
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
  const [activeFilters, setActiveFilters] = useState(0);

  // Apply filters whenever any filter value changes
  useEffect(() => {
    handleSearch();
    
    // Count active filters
    let count = 0;
    if (workStatus !== "all") count++;
    if (paymentStatus !== "all") count++;
    if (vendor !== "all") count++;
    setActiveFilters(count);
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
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Search Input */}
      <div className="relative flex-grow min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pesanan..."
          className="pl-8 pr-4 h-9 bg-background"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1 h-7 w-7 p-0"
            onClick={() => setSearch("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Combined Filter Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-1.5">
            <FilterIcon className="h-3.5 w-3.5" />
            <span>Filter</span>
            {activeFilters > 0 && (
              <span className="ml-1 h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-1.5">
                {activeFilters}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Status Filter Section */}
          <div className="p-2 text-xs font-medium text-muted-foreground">Status Pengerjaan</div>
          <DropdownMenuItem 
            onClick={() => setWorkStatus("all")}
            className={workStatus === "all" ? "bg-accent font-medium" : ""}
          >
            Semua Status
          </DropdownMenuItem>
          {workStatuses.map((status) => (
            <DropdownMenuItem 
              key={status} 
              onClick={() => setWorkStatus(status)}
              className={workStatus === status ? "bg-accent font-medium" : ""}
            >
              {status}
            </DropdownMenuItem>
          ))}
          
          <div className="px-2 py-1.5 mt-1.5 border-t text-xs font-medium text-muted-foreground">Status Pembayaran</div>
          <DropdownMenuItem 
            onClick={() => setPaymentStatus("all")}
            className={paymentStatus === "all" ? "bg-accent font-medium" : ""}
          >
            Semua Status Pembayaran
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setPaymentStatus("Lunas")}
            className={paymentStatus === "Lunas" ? "bg-accent font-medium" : ""}
          >
            Lunas
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => setPaymentStatus("Pending")}
            className={paymentStatus === "Pending" ? "bg-accent font-medium" : ""}
          >
            Belum Lunas
          </DropdownMenuItem>
          
          <div className="px-2 py-1.5 mt-1.5 border-t text-xs font-medium text-muted-foreground">Vendor</div>
          <DropdownMenuItem 
            onClick={() => setVendor("all")}
            className={vendor === "all" ? "bg-accent font-medium" : ""}
          >
            Semua Vendor
          </DropdownMenuItem>
          {vendors.map((vendorName) => (
            <DropdownMenuItem 
              key={vendorName} 
              onClick={() => setVendor(vendorName)}
              className={vendor === vendorName ? "bg-accent font-medium" : ""}
            >
              {vendorName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Reset Button - Only show when filters are applied */}
      {(search || workStatus !== "all" || paymentStatus !== "all" || vendor !== "all") && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleReset} 
          className="h-9 px-2.5 text-sm"
        >
          Reset
        </Button>
      )}
    </div>
  );
}
