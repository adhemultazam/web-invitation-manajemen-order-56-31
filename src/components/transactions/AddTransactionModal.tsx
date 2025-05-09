
import { useState, useEffect } from "react";
import { Transaction } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAddTransaction
}: AddTransactionModalProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<"fixed" | "variable">("variable");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [budget, setBudget] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  
  // Reset form when transaction type changes
  useEffect(() => {
    if (type === "variable") {
      setCategory("");
      setBudget("");
      setIsPaid(false);
    }
  }, [type]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!date) {
      toast.error("Pilih tanggal transaksi");
      return;
    }
    
    if (!description.trim()) {
      toast.error("Masukkan keterangan transaksi");
      return;
    }
    
    // Parse amount properly - remove dots and convert to number
    const parsedAmount = parseFloat(amount.replace(/\./g, ""));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Masukkan jumlah transaksi yang valid");
      return;
    }
    
    // For fixed expenses, validate category and budget if provided
    let finalCategory = "";
    let parsedBudget: number | undefined = undefined;
    
    if (type === "fixed") {
      finalCategory = category === "Lainnya" ? customCategory : category;
      
      if (!finalCategory) {
        toast.error("Pilih atau masukkan kategori pengeluaran tetap");
        return;
      }
      
      if (budget) {
        parsedBudget = parseFloat(budget.replace(/\./g, ""));
        if (isNaN(parsedBudget) || parsedBudget <= 0) {
          toast.error("Masukkan anggaran yang valid");
          return;
        }
      }
    }
    
    setIsLoading(true);
    
    try {
      // Create transaction object
      const newTransaction: Transaction = {
        id: uuidv4(),
        date: date.toISOString(),
        type,
        description: description.trim(),
        amount: parsedAmount,
        ...(type === "fixed" && {
          category: finalCategory,
          isPaid,
          ...(parsedBudget && { budget: parsedBudget })
        })
      };
      
      // Call onAddTransaction callback
      onAddTransaction(newTransaction);
      
      // Reset form
      setDate(new Date());
      setType("variable");
      setDescription("");
      setAmount("");
      setCategory("");
      setBudget("");
      setIsPaid(false);
      setCustomCategory("");
      
      toast.success("Transaksi berhasil ditambahkan");
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Gagal menambahkan transaksi");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Improved format amount input with thousand separator
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove existing dots and non-numeric characters
    const numericValue = value.replace(/\./g, "").replace(/[^\d]/g, "");
    
    if (numericValue === "") {
      setAmount("");
      return;
    }
    
    // Format with thousand separators (dots in Indonesian format)
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setAmount(formattedValue);
  };
  
  // Format budget input with thousand separator
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value.replace(/\./g, "").replace(/[^\d]/g, "");
    
    if (numericValue === "") {
      setBudget("");
      return;
    }
    
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setBudget(formattedValue);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Transaksi Baru</DialogTitle>
            <DialogDescription>
              Masukkan detail transaksi pengeluaran Anda.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="transaction-date">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="transaction-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pilih tanggal</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transaction-type">Tipe Pengeluaran</Label>
              <Select 
                value={type}
                onValueChange={(value) => setType(value as "fixed" | "variable")}
              >
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Pilih tipe pengeluaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Pengeluaran Tetap</SelectItem>
                  <SelectItem value="variable">Pengeluaran Tidak Tetap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {type === "fixed" && (
              <div className="grid gap-2">
                <Label htmlFor="transaction-category">Kategori</Label>
                <Select 
                  value={category}
                  onValueChange={setCategory}
                >
                  <SelectTrigger id="transaction-category">
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
            
            <div className="grid gap-2">
              <Label htmlFor="transaction-description">Keterangan</Label>
              <Input
                id="transaction-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Gaji karyawan, Biaya operasional, dll."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="transaction-amount">Jumlah (Rp)</Label>
              <Input
                id="transaction-amount"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Contoh: 500.000"
              />
            </div>
            
            {type === "fixed" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="transaction-budget">Anggaran (Rp) (Opsional)</Label>
                  <Input
                    id="transaction-budget"
                    value={budget}
                    onChange={handleBudgetChange}
                    placeholder="Contoh: 600.000"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="is-paid"
                    checked={isPaid}
                    onCheckedChange={(checked) => setIsPaid(checked === true)}
                  />
                  <Label 
                    htmlFor="is-paid"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Sudah Dibayar
                  </Label>
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button 
              type="submit"
              disabled={isLoading}
              className="bg-wedding-primary hover:bg-wedding-accent"
            >
              {isLoading ? "Menambahkan..." : "Tambah Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
