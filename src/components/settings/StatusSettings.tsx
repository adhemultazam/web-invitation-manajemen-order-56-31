
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { WorkStatus } from "@/types/types";
import { Plus, Edit, Trash2 } from "lucide-react";

// Mock data for work statuses
const initialStatuses: WorkStatus[] = [
  {
    id: "1",
    name: "Selesai",
    color: "#22c55e" // green-500
  },
  {
    id: "2",
    name: "Progress",
    color: "#3b82f6" // blue-500
  },
  {
    id: "3",
    name: "Review",
    color: "#f59e0b" // amber-500
  },
  {
    id: "4",
    name: "Revisi",
    color: "#f97316" // orange-500
  },
  {
    id: "5",
    name: "Data Belum",
    color: "#ef4444" // red-500
  }
];

export function StatusSettings() {
  const [statuses, setStatuses] = useState<WorkStatus[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<WorkStatus | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    color: "#000000"
  });

  useEffect(() => {
    // Load statuses from localStorage or use initialStatuses
    const savedStatuses = localStorage.getItem('workStatuses');
    if (savedStatuses) {
      try {
        setStatuses(JSON.parse(savedStatuses));
      } catch (e) {
        console.error("Error parsing work statuses:", e);
        setStatuses(initialStatuses);
        localStorage.setItem('workStatuses', JSON.stringify(initialStatuses));
      }
    } else {
      setStatuses(initialStatuses);
      localStorage.setItem('workStatuses', JSON.stringify(initialStatuses));
    }
  }, []);

  // Save statuses to localStorage whenever they change
  useEffect(() => {
    if (statuses.length > 0) {
      localStorage.setItem('workStatuses', JSON.stringify(statuses));
    }
  }, [statuses]);

  const handleOpenDialog = (status?: WorkStatus) => {
    if (status) {
      setCurrentStatus(status);
      setFormData({
        name: status.name,
        color: status.color
      });
    } else {
      setCurrentStatus(null);
      setFormData({
        name: "",
        color: "#000000"
      });
    }
    setIsDialogOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStatus) {
      // Edit existing status
      setStatuses((prev) =>
        prev.map((s) =>
          s.id === currentStatus.id ? { ...s, ...formData } : s
        )
      );
    } else {
      // Add new status
      const newStatus: WorkStatus = {
        id: Date.now().toString(),
        ...formData
      };
      setStatuses((prev) => [...prev, newStatus]);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setStatuses((prev) => prev.filter((status) => status.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Status Pengerjaan</CardTitle>
          <CardDescription>
            Kelola label status pengerjaan yang digunakan dalam sistem.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentStatus ? "Edit Status" : "Tambah Status Baru"}
              </DialogTitle>
              <DialogDescription>
                {currentStatus
                  ? "Ubah informasi status yang sudah ada."
                  : "Tambahkan label status baru ke sistem."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nama Status</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nama status"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Warna</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-16 h-10 p-1"
                      required
                    />
                    <Input
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="flex-1"
                      maxLength={7}
                      required
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
                <div>
                  <h3 className="font-medium">{status.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {status.color}
                  </p>
                </div>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenDialog(status)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(status.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {statuses.length === 0 && (
            <div className="flex items-center justify-center p-8 border rounded-lg border-dashed">
              <p className="text-muted-foreground">
                Belum ada status yang terdaftar
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
