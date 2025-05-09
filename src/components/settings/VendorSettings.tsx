
import { useState, useEffect } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { Vendor } from "@/types/types";
import { generateVendorColor } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

export function VendorSettings() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorCode, setVendorCode] = useState("");
  const [landingPageUrl, setLandingPageUrl] = useState(""); // Changed from commission
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [vendorColor, setVendorColor] = useState("#6366f1");

  // Load vendors from localStorage
  useEffect(() => {
    const savedVendors = localStorage.getItem("vendors");
    if (savedVendors) {
      try {
        const parsedVendors = JSON.parse(savedVendors);
        setVendors(parsedVendors);
      } catch (error) {
        console.error("Error parsing vendors:", error);
        setVendors([]);
      }
    }
  }, []);

  // Save vendors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vendors", JSON.stringify(vendors));
  }, [vendors]);

  const resetForm = () => {
    setVendorName("");
    setVendorCode("");
    setLandingPageUrl(""); // Changed from commission
    setVendorColor(generateVendorColor());
  };

  const handleAddVendor = () => {
    if (!vendorName || !vendorCode) {
      toast.error("Nama dan kode vendor harus diisi");
      return;
    }

    // Check for duplicate vendor code
    if (vendors.some((vendor) => vendor.code === vendorCode)) {
      toast.error("Kode vendor sudah digunakan");
      return;
    }

    const newVendor: Vendor = {
      id: uuidv4(),
      name: vendorName,
      code: vendorCode,
      color: vendorColor,
      landingPageUrl: landingPageUrl, // Changed from commission
    };

    setVendors([...vendors, newVendor]);
    setIsAddDialogOpen(false);
    resetForm();

    toast.success("Vendor berhasil ditambahkan");
  };

  const handleEditClick = (vendor: Vendor) => {
    setSelectedVendorId(vendor.id);
    setVendorName(vendor.name);
    setVendorCode(vendor.code);
    setLandingPageUrl(vendor.landingPageUrl || ""); // Changed from commission
    setVendorColor(vendor.color || generateVendorColor());
    setIsEditDialogOpen(true);
  };

  const handleEditVendor = () => {
    if (!vendorName || !vendorCode) {
      toast.error("Nama dan kode vendor harus diisi");
      return;
    }

    // Check for duplicate vendor code (excluding the current vendor)
    if (
      vendors.some(
        (vendor) =>
          vendor.code === vendorCode && vendor.id !== selectedVendorId
      )
    ) {
      toast.error("Kode vendor sudah digunakan");
      return;
    }

    const updatedVendors = vendors.map((vendor) =>
      vendor.id === selectedVendorId
        ? {
            ...vendor,
            name: vendorName,
            code: vendorCode,
            color: vendorColor,
            landingPageUrl: landingPageUrl, // Changed from commission
          }
        : vendor
    );

    setVendors(updatedVendors);
    setIsEditDialogOpen(false);
    resetForm();
    
    toast.success("Vendor berhasil diperbarui");
  };

  const handleDeleteClick = (vendorId: string) => {
    setSelectedVendorId(vendorId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteVendor = () => {
    const updatedVendors = vendors.filter(
      (vendor) => vendor.id !== selectedVendorId
    );
    setVendors(updatedVendors);
    setIsDeleteDialogOpen(false);
    toast.success("Vendor berhasil dihapus");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Vendor</CardTitle>
          <CardDescription>
            Kelola data vendor undangan digital
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setVendorColor(generateVendorColor());
              }}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Tambah Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Vendor</DialogTitle>
              <DialogDescription>
                Tambahkan vendor baru untuk undangan digital.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="vendorName">Nama Vendor</Label>
                <Input
                  id="vendorName"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="Masukkan nama vendor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vendorCode">Kode Vendor</Label>
                <Input
                  id="vendorCode"
                  value={vendorCode}
                  onChange={(e) => setVendorCode(e.target.value)}
                  placeholder="Masukkan kode vendor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="landingPageUrl">URL Landing Page</Label>
                <Input
                  id="landingPageUrl"
                  value={landingPageUrl}
                  onChange={(e) => setLandingPageUrl(e.target.value)}
                  placeholder="https://example.com/landing-page"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vendorColor">Warna Vendor</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="vendorColor"
                    value={vendorColor}
                    onChange={(e) => setVendorColor(e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={vendorColor}
                    onChange={(e) => setVendorColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }}
              >
                Batal
              </Button>
              <Button onClick={handleAddVendor}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>URL Landing Page</TableHead>
              <TableHead>Warna</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.length > 0 ? (
              vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>{vendor.code}</TableCell>
                  <TableCell>
                    {vendor.landingPageUrl ? (
                      <a
                        href={vendor.landingPageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {vendor.landingPageUrl}
                      </a>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: vendor.color || "#6366f1" }}
                      />
                      <span className="text-xs">{vendor.color || "#6366f1"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(vendor)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(vendor.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-6"
                >
                  Belum ada data vendor
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Vendor Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription>
              Edit data vendor untuk undangan digital.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editVendorName">Nama Vendor</Label>
              <Input
                id="editVendorName"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Masukkan nama vendor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editVendorCode">Kode Vendor</Label>
              <Input
                id="editVendorCode"
                value={vendorCode}
                onChange={(e) => setVendorCode(e.target.value)}
                placeholder="Masukkan kode vendor"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editLandingPageUrl">URL Landing Page</Label>
              <Input
                id="editLandingPageUrl"
                value={landingPageUrl}
                onChange={(e) => setLandingPageUrl(e.target.value)}
                placeholder="https://example.com/landing-page"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editVendorColor">Warna Vendor</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  id="editVendorColor"
                  value={vendorColor}
                  onChange={(e) => setVendorColor(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={vendorColor}
                  onChange={(e) => setVendorColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Batal
            </Button>
            <Button onClick={handleEditVendor}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Vendor Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Vendor</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus vendor ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteVendor}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
