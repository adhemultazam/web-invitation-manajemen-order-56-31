
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Theme } from "@/types/types";

interface ThemeSelectProps {
  value: string;
  themes: Theme[];
  onChange: (value: string) => void;
  isDisabled?: boolean;
}

const ThemeSelect: React.FC<ThemeSelectProps> = ({
  value,
  themes,
  onChange,
  isDisabled = false
}) => {
  return (
    <div className="space-y-1">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isDisabled}
      >
        <SelectTrigger id="theme" className="w-full">
          <SelectValue placeholder="Pilih tema">{value}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {themes && themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.name}>
              <div className="flex items-center">
                <span>{theme.name}</span>
                {theme.category && (
                  <span className="ml-2 text-xs text-muted-foreground">({theme.category})</span>
                )}
              </div>
            </SelectItem>
          ))}
          {(!themes || themes.length === 0) && (
            <SelectItem value="no-theme" disabled>
              Tidak ada tema tersedia
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ThemeSelect;
