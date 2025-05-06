
import { useState } from "react";
import type { InvoiceFilter as InvoiceFilterType } from "@/types/types";
import { Vendor } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ArrowUpDown,
  Calendar,
  DollarSign,
} from "lucide-react";

interface InvoiceFilterProps {
  vendors: Vendor[];
  onFilterChange: (filters: InvoiceFilterType) => void;
}

export function InvoiceFilter({ vendors, onFilterChange }: InvoiceFilterProps) {
  const [filters, setFilters] = useState<InvoiceFilterType>({
    vendor: undefined,
    status: 'All',
    sortBy: 'dueDate',
    sortDirection: 'asc'
  });
  
  const handleFilterChange = (key: keyof InvoiceFilterType, value: string | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters as InvoiceFilterType);
    onFilterChange(newFilters as InvoiceFilterType);
  };
  
  const toggleSortDirection = () => {
    const newDirection = filters.sortDirection === 'asc' ? 'desc' as const : 'asc' as const;
    const newFilters = { ...filters, sortDirection: newDirection };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const setSortBy = (value: 'dueDate' | 'amount') => {
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center bg-muted p-4 rounded-lg gap-4">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="w-full md:w-auto">
          <Label htmlFor="vendor" className="mb-1 block">Vendor</Label>
          <Select
            value={filters.vendor}
            onValueChange={(value) => handleFilterChange('vendor', value)}
          >
            <SelectTrigger id="vendor" className="w-full">
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
        </div>
        
        <div className="w-full md:w-auto">
          <Label htmlFor="status" className="mb-1 block">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value as 'Paid' | 'Unpaid' | 'All')}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Semua Status</SelectItem>
              <SelectItem value="Paid">Lunas</SelectItem>
              <SelectItem value="Unpaid">Belum Lunas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Button 
          variant={filters.sortBy === 'dueDate' ? "default" : "outline"} 
          className="h-10 w-full md:w-auto"
          onClick={() => setSortBy('dueDate')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          <span className="sm:inline">Tanggal</span>
        </Button>
        <Button 
          variant={filters.sortBy === 'amount' ? "default" : "outline"}
          className="h-10 w-full md:w-auto"
          onClick={() => setSortBy('amount')}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          <span className="sm:inline">Jumlah</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-10"
          onClick={toggleSortDirection}
        >
          <ArrowUpDown className={`h-4 w-4 ${filters.sortDirection === 'desc' ? "transform rotate-180" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
