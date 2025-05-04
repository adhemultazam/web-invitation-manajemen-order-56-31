
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
          <SelectValue placeholder="Pilih vendor" />
        </SelectTrigger>
        <SelectContent>
          {vendors.map((vendor) => (
            <SelectItem key={vendor.id} value={vendor.id}>
              <div className="flex items-center justify-between w-full">
                <span>{vendor.name}</span>
                {vendorOrderCounts[vendor.id] > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {vendorOrderCounts[vendor.id]} pesanan
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
