
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "@/types/types";

interface PackageSelectProps {
  value: string;
  packages: Package[];
  isDisabled: boolean;
  onChange: (value: string) => void;
  compact?: boolean; // Added compact prop
}

const PackageSelect: React.FC<PackageSelectProps> = ({
  value,
  packages,
  isDisabled,
  onChange,
  compact = false, // Default to false
}) => {
  // Try to load last selected package from localStorage when initializing
  useEffect(() => {
    if (!value && packages.length > 0) {
      try {
        const lastPackage = localStorage.getItem('last_selected_package');
        if (lastPackage) {
          // Check if the stored package exists in the current packages list
          const exists = packages.some(pkg => pkg.name === lastPackage);
          if (exists) {
            onChange(lastPackage);
          }
        }
      } catch (e) {
        console.error("Error loading package from localStorage:", e);
      }
    }
  }, [packages, value, onChange]);

  // Save selected package to localStorage when it changes
  useEffect(() => {
    try {
      if (value) {
        localStorage.setItem('last_selected_package', value);
      }
    } catch (e) {
      console.error("Error saving package to localStorage:", e);
    }
  }, [value]);

  // Find package details for the currently selected package
  const selectedPackage = packages.find(pkg => pkg.name === value);
  
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className={compact ? "h-7 w-full text-xs py-0 px-2" : "h-10 w-full"}>
        <SelectValue>
          {value ? value : "Pilih paket"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {packages.map(pkg => (
          <SelectItem key={pkg.id} value={pkg.name}>
            {pkg.name} - Rp {pkg.price?.toLocaleString()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PackageSelect;
