
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface VendorDropdownFieldProps {
  selectedVendor: string | null;
  onVendorChange: (vendor: string | null) => void;
  vendors: string[];
  vendorData?: { [id: string]: { name: string; color: string; landingPageUrl?: string } }; // Updated from commission to landingPageUrl
}

export function VendorDropdownField({
  selectedVendor,
  onVendorChange,
  vendors,
  vendorData = {},
}: VendorDropdownFieldProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (vendorId: string) => {
    onVendorChange(selectedVendor === vendorId ? null : vendorId);
    setOpen(false);
  };

  const getVendorName = (vendorId: string): string => {
    return vendorData[vendorId]?.name || vendorId;
  };

  const getVendorColor = (vendorId: string): string => {
    return vendorData[vendorId]?.color || "#9A84FF";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {selectedVendor ? (
            <span className="flex items-center">
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: getVendorColor(selectedVendor) }}
              ></span>
              {getVendorName(selectedVendor)}
            </span>
          ) : (
            "Pilih vendor..."
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput placeholder="Cari vendor..." />
          <CommandEmpty>Vendor tidak ditemukan.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {vendors.map((vendor) => (
              <CommandItem
                key={vendor}
                onSelect={() => handleSelect(vendor)}
                className="flex items-center"
              >
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: getVendorColor(vendor) }}
                ></span>
                <span>{getVendorName(vendor)}</span>
                <Check
                  className={cn(
                    "ml-auto",
                    selectedVendor === vendor ? "opacity-100" : "opacity-0"
                  )}
                  size={16}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
