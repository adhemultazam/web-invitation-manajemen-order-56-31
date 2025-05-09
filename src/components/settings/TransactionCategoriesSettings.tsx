
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionCategory } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { PencilIcon, Trash2Icon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";

export function TransactionCategoriesSettings() {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [activeTab, setActiveTab] = useState<string>("fixed");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<TransactionCategory | null>(null);
  
  // Form fields
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState<"fixed" | "variable">("fixed");
  const [categoryBudget, setCategoryBudget] = useState<string>("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIsActive, setCategoryIsActive] = useState(true);

  // Load categories from localStorage
  useEffect(() => {
    const storedCategories = localStorage.getItem("transactionCategories");
    
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Initialize with some default categories
      const defaultCategories: TransactionCategory[] = [
        { id: uuidv4(), name: "Sewa Kantor", type: "fixed", defaultBudget: 1500000, isActive: true },
        { id: uuidv4(), name: "Gaji Karyawan", type: "fixed", defaultBudget: 3000000, isActive: true },
        { id: uuidv4(), name: "Internet", type: "fixed", defaultBudget: 400000, isActive: true },
        { id: uuidv4(), name: "Listrik", type: "fixed", defaultBudget: 500000, isActive: true },
        { id: uuidv4(), name: "ATK", type: "variable", isActive: true },
        { id: uuidv4(), name: "Marketing", type: "variable", isActive: true }
      ];
      
      setCategories(defaultCategories);
      localStorage.setItem("transactionCategories", JSON.stringify(defaultCategories));
    }
  }, []);

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem("transactionCategories", JSON.stringify(categories));
    }
  }, [categories]);

  // Open add dialog
  const handleOpenAddDialog = () => {
    setCategoryName("");
    setCategoryType(activeTab as "fixed" | "variable");
    setCategoryBudget("");
    setCategoryDescription("");
    setCategoryIsActive(true);
    setIsAddDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEditDialog = (category: TransactionCategory) => {
    setCurrentCategory(category);
    setCategoryName(category.name);
    setCategoryType(category.type);
    setCategoryBudget(category.defaultBudget ? category.defaultBudget.toString() : "");
    setCategoryDescription(category.description || "");
    setCategoryIsActive(category.isActive);
    setIsEditDialogOpen(true);
  };

  // Add new category
  const handleAddCategory = () => {
    if (!categoryName.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    const newCategory: TransactionCategory = {
      id: uuidv4(),
      name: categoryName.trim(),
      type: categoryType,
      defaultBudget: categoryBudget ? parseFloat(categoryBudget.replace(/\./g, "")) : undefined,
      description: categoryDescription.trim() || undefined,
      isActive: categoryIsActive
    };

    setCategories([...categories, newCategory]);
    setIsAddDialogOpen(false);
    toast.success("Kategori berhasil ditambahkan");
  };

  // Update category
  const handleUpdateCategory = () => {
    if (!currentCategory || !categoryName.trim()) {
      toast.error("Nama kategori tidak boleh kosong");
      return;
    }

    const updatedCategories = categories.map(cat => {
      if (cat.id === currentCategory.id) {
        return {
          ...cat,
          name: categoryName.trim(),
          type: categoryType,
          defaultBudget: categoryBudget ? parseFloat(categoryBudget.replace(/\./g, "")) : undefined,
          description: categoryDescription.trim() || undefined,
          isActive: categoryIsActive
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setIsEditDialogOpen(false);
    toast.success("Kategori berhasil diperbarui");
  };

  // Delete category
  const handleDeleteCategory = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      const updatedCategories = categories.filter(cat => cat.id !== id);
      setCategories(updatedCategories);
      toast.success("Kategori berhasil dihapus");
    }
  };

  // Format input for budget
  const formatBudgetInput = (value: string) => {
    // Remove dots and convert to number
    const numericValue = value.replace(/\./g, "");
    
    // Format with dots as thousand separators
    if (numericValue) {
      const formattedValue = new Intl.NumberFormat('id-ID').format(
        parseInt(numericValue)
      );
      return formattedValue;
    }
    return "";
  };

  // Filter categories based on active tab
  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Kategori Transaksi</CardTitle>
            <Button 
              onClick={handleOpenAddDialog}
              className="bg-wedding-primary hover:bg-wedding-accent"
              size="sm"
            >
              <PlusCircleIcon className="h-4 w-4 mr-1.5" /> Tambah Kategori
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fixed" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="fixed">Pengeluaran Tetap</TabsTrigger>
              <TabsTrigger value="variable">Pengeluaran Tidak Tetap</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="w-[240px] py-3 font-poppins text-xs tracking-wide">Nama Kategori</TableHead>
                      {activeTab === "fixed" && (
                        <TableHead className="py-3 font-poppins text-xs tracking-wide">Anggaran Default</TableHead>
                      )}
                      <TableHead className="py-3 font-poppins text-xs tracking-wide">Keterangan</TableHead>
                      <TableHead className="py-3 font-poppins text-xs tracking-wide">Status</TableHead>
                      <TableHead className="text-right py-3 font-poppins text-xs tracking-wide">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.length > 0 ? (
                      filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          {activeTab === "fixed" && (
                            <TableCell>
                              {category.defaultBudget 
                                ? formatCurrency(category.defaultBudget) 
                                : "Belum diatur"}
                            </TableCell>
                          )}
                          <TableCell>{category.description || "-"}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              category.isActive 
                                ? "bg-green-100 text-green-800" 
                                : "bg-gray-100 text-gray-600"
                            }`}>
                              {category.isActive ? "Aktif" : "Tidak Aktif"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleOpenEditDialog(category)}
                              >
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell 
                          colSpan={activeTab === "fixed" ? 5 : 4} 
                          className="h-24 text-center"
                        >
                          Tidak ada kategori {activeTab === "fixed" ? "pengeluaran tetap" : "pengeluaran tidak tetap"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  {activeTab === "fixed" 
                    ? "Kategori pengeluaran tetap akan otomatis tersedia di semua bulan dengan anggaran yang sama." 
                    : "Kategori pengeluaran tidak tetap dapat digunakan untuk mengelompokkan pengeluaran variabel."
                  }
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kategori Baru</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Kategori</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Masukkan nama kategori"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Jenis Kategori</Label>
              <Select
                value={categoryType}
                onValueChange={(value) => setCategoryType(value as "fixed" | "variable")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Pengeluaran Tetap</SelectItem>
                  <SelectItem value="variable">Pengeluaran Tidak Tetap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {categoryType === "fixed" && (
              <div className="grid gap-2">
                <Label htmlFor="budget">Anggaran Default (Opsional)</Label>
                <Input
                  id="budget"
                  value={formatBudgetInput(categoryBudget)}
                  onChange={(e) => setCategoryBudget(e.target.value)}
                  placeholder="Rp 0"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="description">Keterangan (Opsional)</Label>
              <Input
                id="description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Keterangan tambahan"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={categoryIsActive}
                onCheckedChange={setCategoryIsActive}
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddCategory}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kategori</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nama Kategori</Label>
              <Input
                id="edit-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Jenis Kategori</Label>
              <Select
                value={categoryType}
                onValueChange={(value) => setCategoryType(value as "fixed" | "variable")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Pengeluaran Tetap</SelectItem>
                  <SelectItem value="variable">Pengeluaran Tidak Tetap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {categoryType === "fixed" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-budget">Anggaran Default (Opsional)</Label>
                <Input
                  id="edit-budget"
                  value={formatBudgetInput(categoryBudget)}
                  onChange={(e) => setCategoryBudget(e.target.value)}
                  placeholder="Rp 0"
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Keterangan (Opsional)</Label>
              <Input
                id="edit-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={categoryIsActive}
                onCheckedChange={setCategoryIsActive}
              />
              <Label htmlFor="edit-isActive">Aktif</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdateCategory}>
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
