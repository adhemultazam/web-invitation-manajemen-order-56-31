
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save, Palette } from "lucide-react";
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
  "#6B7280", // Gray
  "#71717A", // Zinc
  "#737373", // Neutral
  "#78716C", // Stone
];

export function WorkStatusSettings() {
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [newWorkStatus, setNewWorkStatus] = useState("");
  const [newColor, setNewColor] = useState("#64748b"); // Default color
  
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
      toast.success(`Status ${statusToSave.name} berhasil disimpan`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
        <div className="col-span-3 md:col-span-4">
          <Input
            placeholder="Status pengerjaan baru"
            value={newWorkStatus}
            onChange={e => setNewWorkStatus(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddWorkStatus()}
          />
        </div>
        <div className="col-span-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full h-10 flex items-center justify-center" 
                style={{ backgroundColor: newColor }}
              >
                <Palette className="h-4 w-4 mr-2" color="white" />
                <span className="text-white">Warna</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-7 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    style={{ backgroundColor: color }}
                    onClick={() => setNewColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleAddWorkStatus} className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        Tambah Status
      </Button>

      <div className="space-y-2">
        {workStatuses.map(status => (
          <div key={status.id} className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <div className="col-span-3">
              <Input
                value={status.name}
                onChange={e => handleWorkStatusChange(status.id, 'name', e.target.value)}
              />
            </div>
            <div className="col-span-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full h-10 flex items-center justify-center" 
                    style={{ backgroundColor: status.color }}
                  >
                    <Palette className="h-4 w-4" color="white" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-7 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        style={{ backgroundColor: color }}
                        onClick={() => handleWorkStatusChange(status.id, 'color', color)}
                        aria-label={`Select color ${color}`}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="col-span-1"
              onClick={() => handleSaveWorkStatus(status.id)}
            >
              <Save className="mr-1 h-4 w-4" />
              Simpan
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="col-span-1"
              onClick={() => handleDeleteWorkStatus(status.id)}
            >
              <Trash className="mr-1 h-4 w-4" />
              Hapus
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
