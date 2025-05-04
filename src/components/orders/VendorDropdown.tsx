
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Vendor } from "@/types/types";

interface VendorDropdownProps {
  vendor: string;
  vendors: Vendor[];
  isDisabled: boolean;
  onChange: (vendorId: string) => void;
}

const VendorDropdown: React.FC<VendorDropdownProps> = ({
  vendor,
  vendors,
  isDisabled,
  onChange,
}) => {
  // Find the selected vendor object from the vendor ID
  const selectedVendor = vendors.find(v => v.id === vendor);
  
  // Get vendor color for styling
  const getVendorColorStyle = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    const color = vendor?.color || '#6366f1';
    return {
      backgroundColor: color,
      color: '#fff'
    };
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex justify-between w-full min-w-[120px]"
          style={getVendorColorStyle(vendor)}
          disabled={isDisabled}
        >
          <span className="truncate">{selectedVendor?.name || "Not set"}</span>
          <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {vendors.map((vendorOption) => (
          <DropdownMenuItem
            key={vendorOption.id}
            onClick={() => onChange(vendorOption.id)}
            className={vendorOption.id === vendor ? "font-medium" : ""}
          >
            {vendorOption.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VendorDropdown;
