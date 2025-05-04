
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
}

const PackageSelect: React.FC<PackageSelectProps> = ({
  value,
  packages,
  isDisabled,
  onChange,
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

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="h-8 w-full text-xs py-0 px-2">
        <SelectValue>{value}</SelectValue>
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
