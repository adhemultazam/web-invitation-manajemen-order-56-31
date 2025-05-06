
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash, Save } from "lucide-react";
import { toast } from "sonner";
import { WorkStatus } from "@/types/types";

export function WorkStatusSettings() {
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [newWorkStatus, setNewWorkStatus] = useState("");
  
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
      color: "#64748b", // Default color
      order: workStatuses.length + 1
    };
    
    setWorkStatuses([...workStatuses, newWorkStatusItem]);
    setNewWorkStatus("");
    toast.success("Status pengerjaan berhasil ditambahkan");
  };

  // Delete a work status
  const handleDeleteWorkStatus = (id: string) => {
    setWorkStatuses(workStatuses.filter(status => status.id !== id));
    toast.success("Status pengerjaan berhasil dihapus");
  };

  // Handle work status name change
  const handleWorkStatusChange = (id: string, newName: string) => {
    setWorkStatuses(
      workStatuses.map(status => 
        status.id === id ? { ...status, name: newName } : status
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
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Status pengerjaan baru"
          value={newWorkStatus}
          onChange={e => setNewWorkStatus(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAddWorkStatus()}
        />
        <Button onClick={handleAddWorkStatus} className="shrink-0">
          <Plus className="mr-1 h-4 w-4" />
          Tambah
        </Button>
      </div>

      <div className="space-y-2">
        {workStatuses.map(status => (
          <div key={status.id} className="flex items-center space-x-2">
            <Input
              value={status.name}
              onChange={e => handleWorkStatusChange(status.id, e.target.value)}
            />
            <Button
              size="icon"
              variant="outline"
              className="shrink-0"
              onClick={() => handleSaveWorkStatus(status.id)}
            >
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="shrink-0"
              onClick={() => handleDeleteWorkStatus(status.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
