
import React from "react";
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
            {pkg.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PackageSelect;
