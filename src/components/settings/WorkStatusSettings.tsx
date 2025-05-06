
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Check, X, Palette } from "lucide-react";
import { toast } from "sonner";
import { WorkStatus } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define a list of colors for the color picker
const colorOptions = [
  "#EF4444", // Red
  "#F97316", // Orange
  "#F59E0B", // Amber
  "#EAB308", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky
  "#3B82F6", // Blue
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#A855F7", // Purple
  "#D946EF", // Fuchsia
  "#EC4899", // Pink
  "#F43F5E", // Rose
  "#64748B", // Slate
];

export function WorkStatusSettings() {
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [newWorkStatus, setNewWorkStatus] = useState("");
  const [newColor, setNewColor] = useState("#64748b"); // Default color
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Load work statuses from localStorage on component mount
  useEffect(() => {
    const savedWorkStatuses = localStorage.getItem("workStatuses");
    
    if (savedWorkStatuses) {
      try {
        setWorkStatuses(JSON.parse(savedWorkStatuses));
      } catch (error) {
        console.error("Error parsing work statuses:", error);
        // Initialize with default work statuses if there's an error
        const defaultWorkStatuses = [
          { id: crypto.randomUUID(), name: "Belum Dikerjakan", color: "#EF4444", order: 1 },
          { id: crypto.randomUUID(), name: "Dalam Pengerjaan", color: "#3B82F6", order: 2 },
          { id: crypto.randomUUID(), name: "Selesai", color: "#10B981", order: 3 },
          { id: crypto.randomUUID(), name: "Revisi", color: "#F59E0B", order: 4 }
        ];
        setWorkStatuses(defaultWorkStatuses);
        localStorage.setItem("workStatuses", JSON.stringify(defaultWorkStatuses));
      }
    } else {
      // Initialize with default work statuses if none exist
      const defaultWorkStatuses = [
        { id: crypto.randomUUID(), name: "Belum Dikerjakan", color: "#EF4444", order: 1 },
        { id: crypto.randomUUID(), name: "Dalam Pengerjaan", color: "#3B82F6", order: 2 },
        { id: crypto.randomUUID(), name: "Selesai", color: "#10B981", order: 3 },
        { id: crypto.randomUUID(), name: "Revisi", color: "#F59E0B", order: 4 }
      ];
      setWorkStatuses(defaultWorkStatuses);
      localStorage.setItem("workStatuses", JSON.stringify(defaultWorkStatuses));
    }
  }, []);

  // Save work statuses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workStatuses", JSON.stringify(workStatuses));
  }, [workStatuses]);

  // Add a new work status
  const handleAddWorkStatus = () => {
    if (!newWorkStatus.trim()) return;
    
    const newWorkStatusItem: WorkStatus = { 
      id: crypto.randomUUID(), 
      name: newWorkStatus.trim(),
      color: newColor,
      order: workStatuses.length + 1
    };
    
    setWorkStatuses([...workStatuses, newWorkStatusItem]);
    setNewWorkStatus("");
    setNewColor("#64748b"); // Reset to default color
    toast.success("Status pengerjaan berhasil ditambahkan");
  };

  // Delete a work status
  const handleDeleteWorkStatus = (id: string) => {
    setWorkStatuses(workStatuses.filter(status => status.id !== id));
    toast.success("Status pengerjaan berhasil dihapus");
  };

  // Start editing a status
  const startEditing = (id: string) => {
    setEditingId(id);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Handle work status name or color change
  const handleWorkStatusChange = (id: string, field: string, value: string) => {
    setWorkStatuses(
      workStatuses.map(status => 
        status.id === id ? { ...status, [field]: value } : status
      )
    );
  };

  // Save changes to a work status
  const handleSaveWorkStatus = (id: string) => {
    const statusToSave = workStatuses.find(status => status.id === id);
    if (statusToSave && statusToSave.name.trim()) {
      setEditingId(null);
      toast.success(`Status ${statusToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <Input
            placeholder="Status pengerjaan baru"
            value={newWorkStatus}
            onChange={e => setNewWorkStatus(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddWorkStatus()}
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="flex-shrink-0 h-10" 
                style={{ backgroundColor: newColor }}
              >
                <Palette className="h-4 w-4 mr-0 sm:mr-2" color="white" />
                <span className="text-white hidden sm:inline">Warna</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-6 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    style={{ backgroundColor: color }}
                    onClick={() => setNewColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleAddWorkStatus}>
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Tambah</span>
          </Button>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {workStatuses.map(status => (
          <div 
            key={status.id} 
            className="border rounded-md p-2"
          >
            {editingId === status.id ? (
              <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-2 items-center">
                <Input
                  value={status.name}
                  onChange={e => handleWorkStatusChange(status.id, 'name', e.target.value)}
                  autoFocus
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full h-10" 
                      style={{ backgroundColor: status.color }}
                    >
                      <Palette className="h-4 w-4 text-white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="grid grid-cols-6 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                          style={{ backgroundColor: color }}
                          onClick={() => handleWorkStatusChange(status.id, 'color', color)}
                          aria-label={`Select color ${color}`}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSaveWorkStatus(status.id)}
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
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="font-medium">{status.name}</span>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(status.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteWorkStatus(status.id)}
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
