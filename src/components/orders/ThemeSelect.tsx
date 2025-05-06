
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Theme } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ThemeSelectProps {
  value: string;
  themes: Theme[];
  onChange: (value: string) => void;
  isDisabled?: boolean;
  packageCategory?: string;
  compact?: boolean; // Added compact prop for smaller size option
}

const ThemeSelect: React.FC<ThemeSelectProps> = ({
  value,
  themes,
  onChange,
  isDisabled = false,
  packageCategory,
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter themes based on search query and package category
  const filteredThemes = themes.filter(theme => {
    // First filter by package category if provided
    if (packageCategory && theme.category !== packageCategory) {
      return false;
    }
    
    // Then filter by search query - Add null checks before calling toLowerCase()
    const themeName = theme.name?.toLowerCase() || "";
    const themeCategory = theme.category?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();
    
    return themeName.includes(query) || themeCategory.includes(query);
  });

  console.log("ThemeSelect - Package category:", packageCategory);
  console.log("ThemeSelect - Available themes:", themes);
  console.log("ThemeSelect - Filtered themes:", filteredThemes);

  return (
    <div className="space-y-1">
      <Select
        value={value}
        onValueChange={onChange}
        disabled={isDisabled}
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger id="theme" className={`w-full ${compact ? "h-7 text-xs py-0 px-2" : ""}`}>
          <SelectValue placeholder="Pilih tema">{value}</SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <div className="sticky top-0 p-2 bg-popover z-10 border-b">
            <div className="flex items-center border rounded-md px-3 h-9">
              <Search className="h-4 w-4 mr-2 opacity-50" />
              <Input 
                placeholder="Cari tema..."
                className="border-0 h-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => {
                  // Prevent dropdown from closing when clicking on the search input
                  e.stopPropagation();
                }}
              />
            </div>
          </div>
          
          <div className="pt-2 pb-1">
            {filteredThemes.length > 0 ? (
              filteredThemes.map((theme) => (
                <SelectItem key={theme.id} value={theme.name || ""}>
                  <div className="flex items-center">
                    <span>{theme.name}</span>
                    {theme.category && (
                      <span className="ml-2 text-xs text-muted-foreground">({theme.category})</span>
                    )}
                  </div>
                </SelectItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                {packageCategory 
                  ? `Tidak ada tema untuk paket ${packageCategory}`
                  : "Tidak ada tema yang sesuai dengan pencarian"}
              </div>
            )}
          </div>
          
          {(!themes || themes.length === 0) && searchQuery === "" && (
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
