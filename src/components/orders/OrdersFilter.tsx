
import { 
  Search, 
  File, 
  User, 
  Check, 
  X 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Vendor } from "@/types/types";
import { useEffect, useState } from "react";

interface OrdersFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterVendor: string;
  setFilterVendor: (vendor: string) => void;
  filterWorkStatus: string;
  setFilterWorkStatus: (status: string) => void;
  filterPaymentStatus: string;
  setFilterPaymentStatus: (status: string) => void;
  vendors: Vendor[];
  workStatuses: string[];
}

export function OrdersFilter({
  searchQuery,
  setSearchQuery,
  filterVendor,
  setFilterVendor,
  filterWorkStatus,
  setFilterWorkStatus,
  filterPaymentStatus,
  setFilterPaymentStatus,
  vendors,
  workStatuses,
}: OrdersFilterProps) {
  const [activeFilters, setActiveFilters] = useState(0);
  
  // Update active filters count when filters change
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (filterVendor !== "all") count++;
    if (filterWorkStatus !== "all") count++;
    if (filterPaymentStatus !== "all") count++;
    
    setActiveFilters(count);
  }, [searchQuery, filterVendor, filterWorkStatus, filterPaymentStatus]);
  
  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterVendor("all");
    setFilterWorkStatus("all");
    setFilterPaymentStatus("all");
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari pesanan..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select 
            value={filterVendor} 
            onValueChange={setFilterVendor}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Semua Vendor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Vendor</SelectItem>
              {vendors.map((vendor) => (
                <SelectItem key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={filterWorkStatus} 
            onValueChange={setFilterWorkStatus}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status Pengerjaan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {workStatuses.length > 0 ? (
                workStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Belum">Belum</SelectItem>
                  <SelectItem value="Proses">Proses</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          
          <Select 
            value={filterPaymentStatus} 
            onValueChange={setFilterPaymentStatus}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status Pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Lunas">Lunas</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          
          {activeFilters > 0 && (
            <Button 
              variant="outline" 
              onClick={handleResetFilters} 
              className="ml-2 text-xs"
              size="sm"
            >
              Reset Filter
              <Badge className="ml-2 bg-muted text-muted-foreground">
                {activeFilters}
              </Badge>
            </Button>
          )}
        </div>
      </div>
      
      {/* Active Filters */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              {searchQuery}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filterVendor !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {vendors.find(v => v.id === filterVendor)?.name || filterVendor}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => setFilterVendor("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filterWorkStatus !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              <File className="h-3 w-3" />
              {filterWorkStatus}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => setFilterWorkStatus("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filterPaymentStatus !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filterPaymentStatus === "Lunas" ? (
                <Check className="h-3 w-3" />
              ) : (
                <X className="h-3 w-3" />
              )}
              {filterPaymentStatus}
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                onClick={() => setFilterPaymentStatus("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
