import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Theme } from "@/types/types";

interface AddThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTheme: (theme: Omit<Theme, "id">) => void;
  existingCategories: string[];
}

export function AddThemeModal({ 
  isOpen, 
  onClose, 
  onAddTheme,
  existingCategories
}: AddThemeModalProps) {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!name.trim()) {
      alert("Nama tema tidak boleh kosong");
      return;
    }
    
    // Use a placeholder thumbnail if none provided
    const finalThumbnail = thumbnail || `https://placehold.co/200x280/f5f5f5/333333?text=${encodeURIComponent(name)}`;
    
    // Determine final category
    const finalCategory = showNewCategory ? newCategory : category;
    
    onAddTheme({
      name,
      thumbnail: finalThumbnail,
      category: finalCategory
    });
    
    // Reset form
    setName("");
    setThumbnail("");
    setCategory("");
    setNewCategory("");
    setShowNewCategory(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Tema Baru</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Tema</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama tema"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thumbnail">URL Thumbnail</Label>
            <Input
              id="thumbnail"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-muted-foreground">
              Jika kosong, akan menggunakan placeholder otomatis
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Kategori</Label>
            {!showNewCategory ? (
              <>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Kategori Baru</SelectItem>
                  </SelectContent>
                </Select>
                
                {category === "new" && (
                  <div className="mt-2">
                    <Input
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Nama kategori baru"
                      onFocus={() => setShowNewCategory(true)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Nama kategori baru"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowNewCategory(false);
                    setNewCategory("");
                    setCategory("");
                  }}
                >
                  Batal
                </Button>
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
