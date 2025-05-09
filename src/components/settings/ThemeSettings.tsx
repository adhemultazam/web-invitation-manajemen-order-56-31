
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddThemeModal } from "./AddThemeModal";
import { EditThemeModal } from "./EditThemeModal";
import { ThemeToolbar } from "./theme/ThemeToolbar";
import { ThemesGrid } from "./theme/ThemesGrid";
import { DeleteThemeDialog } from "./theme/DeleteThemeDialog";
import { useThemeManager } from "@/hooks/useThemeManager";

export function ThemeSettings() {
  const {
    filteredThemes,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    themeToEdit,
    themeToDelete,
    showDeleteDialog,
    setShowDeleteDialog,
    handleAddTheme,
    handleEditTheme,
    handleDeleteTheme,
    handleEditClick,
    handleDeleteClick
  } = useThemeManager();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tema Undangan</CardTitle>
        <CardDescription>
          Kelola tema undangan untuk klien Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search & Filter Controls */}
        <ThemeToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddTheme={() => setIsAddModalOpen(true)}
        />
        
        {/* Themes Grid */}
        <ThemesGrid
          themes={filteredThemes}
          viewMode={viewMode}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </CardContent>
      
      {/* Add Theme Modal */}
      <AddThemeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTheme={handleAddTheme}
        existingCategories={categories}
      />
      
      {/* Edit Theme Modal */}
      {themeToEdit && (
        <EditThemeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          theme={themeToEdit}
          onSave={handleEditTheme}
          existingCategories={categories}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <DeleteThemeDialog
        open={showDeleteDialog}
        theme={themeToDelete}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteTheme}
      />
    </Card>
  );
}
