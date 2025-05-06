
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Addon } from "@/types/types";
import { Label } from "@/components/ui/label";

export function AddonSettings() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [newAddonName, setNewAddonName] = useState("");
  const [newAddonColor, setNewAddonColor] = useState("#9A84FF"); // Default color
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Load addons from localStorage on component mount
  useEffect(() => {
    const savedAddons = localStorage.getItem("addons");
    
    if (savedAddons) {
      try {
        setAddons(JSON.parse(savedAddons));
      } catch (error) {
        console.error("Error parsing addons:", error);
        // Initialize with default addons if there's an error
        const defaultAddons = [
          { id: crypto.randomUUID(), name: "Live Streaming", color: "#9A84FF" },
          { id: crypto.randomUUID(), name: "Photo Gallery", color: "#60A5FA" },
          { id: crypto.randomUUID(), name: "Custom Domain", color: "#F59E0B" },
          { id: crypto.randomUUID(), name: "RSVP", color: "#EC4899" }
        ];
        setAddons(defaultAddons);
        localStorage.setItem("addons", JSON.stringify(defaultAddons));
      }
    } else {
      // Initialize with default addons if none exist
      const defaultAddons = [
        { id: crypto.randomUUID(), name: "Live Streaming", color: "#9A84FF" },
        { id: crypto.randomUUID(), name: "Photo Gallery", color: "#60A5FA" },
        { id: crypto.randomUUID(), name: "Custom Domain", color: "#F59E0B" },
        { id: crypto.randomUUID(), name: "RSVP", color: "#EC4899" }
      ];
      setAddons(defaultAddons);
      localStorage.setItem("addons", JSON.stringify(defaultAddons));
    }
  }, []);

  // Save addons to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("addons", JSON.stringify(addons));
  }, [addons]);

  // Add a new addon
  const handleAddAddon = () => {
    if (!newAddonName.trim()) return;
    
    const newAddonItem = { 
      id: crypto.randomUUID(),
      name: newAddonName.trim(),
      color: newAddonColor
    };
    setAddons([...addons, newAddonItem]);
    setNewAddonName("");
    setNewAddonColor("#9A84FF"); // Reset to default
    toast.success("Addon berhasil ditambahkan");
  };

  // Delete an addon
  const handleDeleteAddon = (id: string) => {
    setAddons(addons.filter(addon => addon.id !== id));
    toast.success("Addon berhasil dihapus");
  };

  // Start editing
  const startEditing = (id: string) => {
    setEditingId(id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Handle addon name change
  const handleAddonNameChange = (id: string, newName: string) => {
    setAddons(
      addons.map(addon => 
        addon.id === id ? { ...addon, name: newName } : addon
      )
    );
  };

  // Handle addon color change
  const handleAddonColorChange = (id: string, newColor: string) => {
    setAddons(
      addons.map(addon => 
        addon.id === id ? { ...addon, color: newColor } : addon
      )
    );
  };

  // Save changes to an addon
  const handleSaveAddon = (id: string) => {
    const addonToSave = addons.find(addon => addon.id === id);
    if (addonToSave && addonToSave.name.trim()) {
      setEditingId(null);
      toast.success(`Addon ${addonToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Nama addon baru"
            value={newAddonName}
            onChange={e => setNewAddonName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddAddon()}
          />
        </div>
        <div className="flex gap-2">
          <Input
            type="color"
            value={newAddonColor}
            onChange={e => setNewAddonColor(e.target.value)}
            className="w-12 p-1 h-10"
          />
          <Button onClick={handleAddAddon}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {addons.map(addon => (
          <div 
            key={addon.id} 
            className="border rounded-md p-2"
          >
            {editingId === addon.id ? (
              <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-2 items-center">
                <Input
                  value={addon.name}
                  onChange={e => handleAddonNameChange(addon.id, e.target.value)}
                  autoFocus
                />
                <Input
                  type="color"
                  value={addon.color}
                  onChange={e => handleAddonColorChange(addon.id, e.target.value)}
                  className="h-10"
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveAddon(addon.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={cancelEditing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: addon.color }}
                  />
                  <span className="font-medium">{addon.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(addon.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteAddon(addon.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
