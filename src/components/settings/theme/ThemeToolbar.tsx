
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, LayoutGrid, LayoutList, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ThemeToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  viewMode: "grid" | "compact";
  onViewModeChange: (mode: "grid" | "compact") => void;
  onAddTheme: () => void;
}

export function ThemeToolbar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
  onAddTheme,
}: ThemeToolbarProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-between items-center">
      <div className="flex flex-grow gap-2 max-w-full sm:max-w-[70%]">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari tema..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full max-w-[180px]">
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex border rounded-md overflow-hidden">
          <Button 
            variant={viewMode === "grid" ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8 rounded-none" 
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === "compact" ? "default" : "outline"} 
            size="icon" 
            className="h-8 w-8 rounded-none" 
            onClick={() => onViewModeChange("compact")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={onAddTheme} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Tambah Tema
        </Button>
      </div>
    </div>
  );
}
