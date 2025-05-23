
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Vendor } from "@/types/types";

interface VendorSelectionDropdownProps {
  vendors: Vendor[];
  selectedVendor: string;
  vendorOrderCounts: Record<string, number>;
  onVendorChange: (value: string) => void;
}

export function VendorSelectionDropdown({
  vendors,
  selectedVendor,
  vendorOrderCounts,
  onVendorChange
}: VendorSelectionDropdownProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="vendor">Vendor</Label>
      <Select
        value={selectedVendor}
        onValueChange={onVendorChange}
      >
        <SelectTrigger id="vendor">
          <SelectValue placeholder="Pilih vendor" className="truncate" />
        </SelectTrigger>
        <SelectContent>
          {vendors.map((vendor) => (
            <SelectItem key={vendor.id} value={vendor.id}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
                    style={{ backgroundColor: vendor.color || "#6366f1" }}
                  ></div>
                  <span className="truncate max-w-[150px]" title={vendor.name}>{vendor.name}</span>
                </div>
                {vendorOrderCounts[vendor.id] > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {vendorOrderCounts[vendor.id]} pesanan pending
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
          {vendors.length === 0 && (
            <SelectItem value="no-vendor" disabled>
              Tidak ada vendor tersedia
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
