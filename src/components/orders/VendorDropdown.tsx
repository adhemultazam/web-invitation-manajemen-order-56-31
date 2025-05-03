
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VendorDropdownProps {
  vendor: string;
  vendors: string[];
  isDisabled: boolean;
  vendorColors: Record<string, string>;
  onChange: (vendor: string) => void;
}

const VendorDropdown: React.FC<VendorDropdownProps> = ({
  vendor,
  vendors,
  isDisabled,
  vendorColors,
  onChange,
}) => {
  const getVendorColorStyle = (vendor: string) => {
    const color = vendorColors[vendor] || '#6366f1';
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
          <span className="truncate">{vendor}</span>
          <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {vendors.map((vendorOption) => (
          <DropdownMenuItem
            key={vendorOption}
            onClick={() => onChange(vendorOption)}
            className={vendorOption === vendor ? "font-medium" : ""}
          >
            {vendorOption}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VendorDropdown;
