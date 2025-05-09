
import { Theme } from "@/types/types";
import { ThemeCard } from "./ThemeCard";

interface ThemesGridProps {
  themes: Theme[];
  viewMode: "grid" | "compact";
  onEdit: (theme: Theme) => void;
  onDelete: (theme: Theme) => void;
}

export function ThemesGrid({ themes, viewMode, onEdit, onDelete }: ThemesGridProps) {
  if (themes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Tidak ada tema dalam kategori ini</p>
      </div>
    );
  }

  return (
    <div 
      className={`grid gap-4 ${viewMode === "grid" 
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6" 
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"}`}
    >
      {themes.map((theme) => (
        <ThemeCard 
          key={theme.id} 
          theme={theme} 
          viewMode={viewMode} 
          onEdit={onEdit} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
