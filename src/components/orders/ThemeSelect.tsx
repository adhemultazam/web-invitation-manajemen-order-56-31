
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeSelectProps {
  value: string;
  themes: string[];
  isDisabled: boolean;
  onChange: (value: string) => void;
}

const ThemeSelect: React.FC<ThemeSelectProps> = ({
  value,
  themes,
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
        {themes.map((theme) => (
          <SelectItem key={theme} value={theme}>
            {theme}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ThemeSelect;
