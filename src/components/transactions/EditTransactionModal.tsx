
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Predefined categories for fixed expenses
const FIXED_EXPENSE_CATEGORIES = [
  "Gaji Karyawan",
  "Sewa Kantor",
  "Tagihan Listrik",
  "Tagihan Internet",
  "Asuransi",
  "Langganan Software",
  "Lainnya"
];

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Transaction) => void;
  transaction: Transaction;
}

export default function EditTransactionModal({
  isOpen,
  onClose,
  onSave,
  transaction
}: EditTransactionModalProps) {
  const [date, setDate] = useState(transaction.date);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  const [type, setType] = useState<"fixed" | "variable">(transaction.type);
  const [category, setCategory] = useState(transaction.category || "");
  const [customCategory, setCustomCategory] = useState("");
  const [budget, setBudget] = useState(transaction.budget ? 
    transaction.budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "");
  const [isPaid, setIsPaid] = useState(transaction.isPaid || false);
  
  // Update category when changing type
  useEffect(() => {
    if (type === "variable") {
      setCategory("");
      setBudget("");
      setIsPaid(false);
    }
  }, [type]);
  
  // Initialize custom category if needed
  useEffect(() => {
    if (transaction.category && !FIXED_EXPENSE_CATEGORIES.includes(transaction.category)) {
      setCategory("Lainnya");
      setCustomCategory(transaction.category);
    }
  }, [transaction.category]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!date || !description || !amount) {
      toast.error("Harap isi semua kolom yang diperlukan");
      return;
    }
    
    // Parse amount properly - remove all dots and convert to number
    const numAmount = parseFloat(amount.replace(/\./g, ""));
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Jumlah harus berupa angka positif");
      return;
    }
    
    let finalCategory = "";
    let parsedBudget: number | undefined = undefined;
    
    // For fixed expenses, validate category and budget
    if (type === "fixed") {
      finalCategory = category === "Lainnya" ? customCategory : category;
      
      if (!finalCategory) {
        toast.error("Pilih atau masukkan kategori pengeluaran tetap");
        return;
      }
      
      if (budget) {
        parsedBudget = parseFloat(budget.replace(/\./g, ""));
        if (isNaN(parsedBudget) || parsedBudget <= 0) {
          toast.error("Anggaran harus berupa angka positif");
          return;
        }
      }
    }
    
    // Save the updated transaction
    onSave({
      ...transaction,
      date,
      description,
      amount: numAmount,
      type,
      ...(type === "fixed" ? {
        category: finalCategory,
        budget: parsedBudget,
        isPaid
      } : {
        category: undefined,
        budget: undefined,
        isPaid: undefined
      })
    });
    
    toast.success("Transaksi berhasil diperbarui");
  };
  
  // Format amount with thousand separators
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\./g, "").replace(/[^\d]/g, "");
    
    if (numericValue === "") {
      setAmount("");
      return;
    }
    
    // Format with thousand separators
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formattedValue);
  };
  
  // Format budget with thousand separators
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\./g, "").replace(/[^\d]/g, "");
    
    if (numericValue === "") {
      setBudget("");
      return;
    }
    
    // Format with thousand separators
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setBudget(formattedValue);
  };
  
  // Create a handler function that explicitly handles the type conversion
  const handleTypeChange = (value: string) => {
    if (value === "fixed" || value === "variable") {
      setType(value);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Tipe Pengeluaran</Label>
            <RadioGroup value={type} onValueChange={handleTypeChange} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed" className="cursor-pointer">Tetap</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="variable" id="variable" />
                <Label htmlFor="variable" className="cursor-pointer">Tidak Tetap</Label>
              </div>
            </RadioGroup>
          </div>
          
          {type === "fixed" && (
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {FIXED_EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {category === "Lainnya" && (
                <Input
                  className="mt-2"
                  placeholder="Masukkan kategori kustom"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="description">Keterangan</Label>
            <Input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Keterangan transaksi"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <Input
              type="text"
              id="amount"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Contoh: 500.000"
              required
            />
          </div>
          
          {type === "fixed" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="budget">Anggaran (Rp) (Opsional)</Label>
                <Input
                  type="text"
                  id="budget"
                  value={budget}
                  onChange={handleBudgetChange}
                  placeholder="Contoh: 600.000"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={isPaid}
                  onCheckedChange={(checked) => setIsPaid(checked === true)}
                />
                <Label 
                  htmlFor="isPaid" 
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Sudah Dibayar
                </Label>
              </div>
            </>
          )}
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" className="bg-wedding-primary hover:bg-wedding-accent">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
