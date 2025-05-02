
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
    <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4 bg-muted p-4 rounded-lg">
      <div className="grid gap-2">
        <Label htmlFor="vendor">Vendor</Label>
        <Select
          value={filters.vendor}
          onValueChange={(value) => handleFilterChange('vendor', value)}
        >
          <SelectTrigger id="vendor" className="w-[180px]">
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
      
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={filters.status}
          onValueChange={(value) => handleFilterChange('status', value as 'Paid' | 'Unpaid' | 'All')}
        >
          <SelectTrigger id="status" className="w-[180px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">Semua Status</SelectItem>
            <SelectItem value="Paid">Lunas</SelectItem>
            <SelectItem value="Unpaid">Belum Lunas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant={filters.sortBy === 'dueDate' ? "default" : "outline"} 
          className="h-10"
          onClick={() => setSortBy('dueDate')}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Tanggal
        </Button>
        <Button 
          variant={filters.sortBy === 'amount' ? "default" : "outline"}
          className="h-10"
          onClick={() => setSortBy('amount')}
        >
          <DollarSign className="mr-2 h-4 w-4" />
          Jumlah
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
