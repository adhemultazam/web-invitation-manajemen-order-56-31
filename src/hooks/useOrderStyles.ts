
import { useState } from "react";
import { Vendor, Addon } from "@/types/types";

export function useOrderStyles() {
  // State for UI styling
  const [vendorColors, setVendorColors] = useState<Record<string, string>>({});
  const [addonStyles, setAddonStyles] = useState<Record<string, { color: string }>>({});

  const updateVendorColors = (vendors: Vendor[]) => {
    const colors: Record<string, string> = {};
    vendors.forEach(vendor => {
      colors[vendor.id] = vendor.color || "#6366f1";
    });
    setVendorColors(colors);
  };
  
  const updateAddonStyles = (addons: Addon[]) => {
    const styles: Record<string, { color: string }> = {};
    addons.forEach(addon => {
      styles[addon.name] = { color: addon.color || "#6366f1" };
    });
    setAddonStyles(styles);
  };

  return {
    vendorColors,
    addonStyles,
    updateVendorColors,
    updateAddonStyles
  };
}
