
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

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
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [type, setType] = useState(transaction.type);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!date || !description || !amount) {
      toast.error("Harap isi semua kolom yang diperlukan");
      return;
    }
    
    const numAmount = parseFloat(amount);
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
      type: type as "fixed" | "variable"
    });
    
    toast.success("Transaksi berhasil diperbarui");
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
            <RadioGroup value={type} onValueChange={setType} className="flex gap-4">
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
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Jumlah transaksi"
              min="0"
              step="1000"
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
