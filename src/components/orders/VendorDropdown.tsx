
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Vendor } from "@/types/types";

interface VendorDropdownProps {
  vendor: string;
  vendors: Vendor[];
  isDisabled: boolean;
  onChange: (vendorId: string) => void;
  compact?: boolean; // Added compact prop
}

const VendorDropdown: React.FC<VendorDropdownProps> = ({
  vendor,
  vendors,
  isDisabled,
  onChange,
  compact = false, // Default to false
}) => {
  // Find the selected vendor object from the vendor ID
  const selectedVendor = vendors.find(v => v.id === vendor);
  
  return (
    <Select
      value={vendor}
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className={`${compact ? "h-8 w-full text-xs py-0 px-2" : "h-10"}`}>
        <div className="flex items-center">
          <div
            className="w-2 h-2 mr-1 rounded-full"
            style={{ backgroundColor: selectedVendor?.color || '#6E6E6E' }}
          />
          <SelectValue>{selectedVendor?.name || "Not set"}</SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {vendors.map((vendorOption) => (
          <SelectItem key={vendorOption.id} value={vendorOption.id}>
            <div className="flex items-center">
              <div
                className="w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: vendorOption.color }}
              />
              {vendorOption.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VendorDropdown;
