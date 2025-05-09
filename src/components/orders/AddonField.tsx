
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Addon } from "@/types/types";

interface AddonFieldProps {
  availableAddons: string[] | Addon[];
  selectedAddons: string[];
  onChange: (addons: string[]) => void;
}

export function AddonField({
  availableAddons,
  selectedAddons,
  onChange,
}: AddonFieldProps) {
  const handleAddonToggle = (addonName: string) => {
    if (selectedAddons.includes(addonName)) {
      onChange(selectedAddons.filter((addon) => addon !== addonName));
    } else {
      onChange([...selectedAddons, addonName]);
    }
  };

  // Check if we're dealing with Addon objects or just strings
  const isAddonObject = (addon: any): addon is Addon => {
    return typeof addon === 'object' && addon !== null && 'name' in addon;
  };

  const getAddonName = (addon: string | Addon): string => {
    return isAddonObject(addon) ? addon.name : addon;
  };

  const getAddonColor = (addon: string | Addon): string => {
    if (isAddonObject(addon)) {
      return addon.color || "#6366f1";
    }
    return "#6366f1"; // Default color for string addons
  };

  return (
    <div className="flex flex-wrap gap-2">
      {availableAddons.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          Tidak ada addon tersedia
        </div>
      ) : (
        availableAddons.map((addon) => {
          const addonName = getAddonName(addon);
          const isSelected = selectedAddons.includes(addonName);
          
          return (
            <div
              key={addonName}
              className={`flex items-center space-x-2 border rounded-md px-3 py-1.5 cursor-pointer transition-colors ${
                isSelected
                  ? "bg-primary/5 border-primary/20"
                  : "bg-background hover:bg-muted/30"
              }`}
              onClick={() => handleAddonToggle(addonName)}
            >
              <Checkbox
                id={`addon-${addonName}`}
                checked={isSelected}
                onCheckedChange={() => handleAddonToggle(addonName)}
              />
              <label
                htmlFor={`addon-${addonName}`}
                className="text-sm cursor-pointer flex items-center"
              >
                {addonName}
              </label>
            </div>
          );
        })
      )}
    </div>
  );
}
