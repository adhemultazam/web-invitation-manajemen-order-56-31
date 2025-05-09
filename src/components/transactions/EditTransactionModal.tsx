
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

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
    
    // Save the updated transaction
    onSave({
      ...transaction,
      date,
      description,
      amount: numAmount,
      type
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
            <Label>Kategori</Label>
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
