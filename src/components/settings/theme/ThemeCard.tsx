
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Pencil, Trash2 } from "lucide-react";
import { Theme } from "@/types/types";

interface ThemeCardProps {
  theme: Theme;
  viewMode: "grid" | "compact";
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

export function ThemeCard({ theme, viewMode, onEdit, onDelete }: ThemeCardProps) {
  return (
    <div className="border rounded-md overflow-hidden group">
      <div className="relative">
        <AspectRatio ratio={1} className="bg-gray-100">
          <img 
            src={theme.thumbnail || `https://placehold.co/200x200/f5f5f5/333333?text=${encodeURIComponent(theme.name)}`}
            alt={theme.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-1">
              <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => onEdit(theme)}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant="outline" className="h-7 w-7 bg-white" onClick={() => onDelete(theme)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </AspectRatio>
      </div>
      <div className={`p-2 ${viewMode === "compact" ? "text-xs" : "p-3"}`}>
        <h3 className={`font-medium truncate ${viewMode === "compact" ? "text-xs" : ""}`}>{theme.name}</h3>
        {theme.category && (
          <p className={`text-muted-foreground truncate ${viewMode === "compact" ? "text-[10px]" : "text-xs"}`}>
            {theme.category}
          </p>
        )}
      </div>
    </div>
  );
}
