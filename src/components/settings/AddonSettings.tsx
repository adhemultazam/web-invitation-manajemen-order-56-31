
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";
import { Addon } from "@/types/types";
import { Label } from "@/components/ui/label";

export function AddonSettings() {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [newAddonName, setNewAddonName] = useState("");
  const [newAddonColor, setNewAddonColor] = useState("#9A84FF"); // Default color
  
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
      toast.success(`Addon ${addonToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="new-addon-name">Nama Addon</Label>
            <Input
              id="new-addon-name"
              placeholder="Nama addon baru"
              value={newAddonName}
              onChange={e => setNewAddonName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAddAddon()}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="new-addon-color">Warna</Label>
            <Input
              id="new-addon-color"
              type="color"
              value={newAddonColor}
              onChange={e => setNewAddonColor(e.target.value)}
              className="h-10 mt-1"
            />
          </div>
        </div>
        <Button onClick={handleAddAddon}>
          <Plus className="mr-1 h-4 w-4" />
          Tambah Addon
        </Button>
      </div>

      <div className="space-y-2">
        {addons.map(addon => (
          <div key={addon.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto] gap-2 items-center">
            <Input
              value={addon.name}
              onChange={e => handleAddonNameChange(addon.id, e.target.value)}
            />
            <Input
              type="color"
              value={addon.color}
              onChange={e => handleAddonColorChange(addon.id, e.target.value)}
              className="h-10"
            />
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                className="shrink-0"
                onClick={() => handleSaveAddon(addon.id)}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="destructive"
                className="shrink-0"
                onClick={() => handleDeleteAddon(addon.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
