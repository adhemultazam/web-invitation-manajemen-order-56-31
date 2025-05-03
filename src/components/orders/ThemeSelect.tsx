
import React, { useEffect } from "react";
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
  // Save selected theme to localStorage when it changes
  useEffect(() => {
    try {
      if (value) {
        localStorage.setItem('last_selected_theme', value);
      }
    } catch (e) {
      console.error("Error saving theme to localStorage:", e);
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
