
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Transaction, TransactionCategory } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTransactionsData } from "@/hooks/useTransactionsData";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (transaction: Transaction) => void;
}

export function AddTransactionModal({ isOpen, onClose, onAddTransaction }: AddTransactionModalProps) {
  // Get categories from settings
  const { activeCategories, fixedCategories, variableCategories } = useTransactionsData("Semua Data", "Semua Data");
  
  // Form state
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<"fixed" | "variable">("fixed");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [budget, setBudget] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<TransactionCategory[]>([]);

  // Update category options based on type
  useEffect(() => {
    if (type === "fixed") {
      setCategoryOptions(fixedCategories);
    } else {
      setCategoryOptions(variableCategories);
    }
    setCategory(""); // Reset category when type changes
  }, [type, fixedCategories, variableCategories]);

  // When category is selected, set budget if available
  useEffect(() => {
    if (category && type === "fixed") {
      const selectedCategory = fixedCategories.find(c => c.id === category);
      if (selectedCategory && selectedCategory.defaultBudget) {
        setBudget(new Intl.NumberFormat('id-ID').format(selectedCategory.defaultBudget));
      } else {
        setBudget("");
      }
    }
  }, [category, fixedCategories, type]);

  // Format the amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove dots and convert to number
    const numericValue = e.target.value.replace(/\./g, "");
    
    // Format with dots as thousand separators
    if (numericValue) {
      const formattedValue = new Intl.NumberFormat('id-ID').format(
        parseInt(numericValue)
      );
      setAmount(formattedValue);
    } else {
      setAmount("");
    }
  };

  // Format the budget input (for fixed expenses)
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\./g, "");
    
    if (numericValue) {
      const formattedValue = new Intl.NumberFormat('id-ID').format(
        parseInt(numericValue)
      );
      setBudget(formattedValue);
    } else {
      setBudget("");
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!description || !amount) {
      alert("Harap isi semua field yang diperlukan");
      return;
    }

    const selectedCategory = categoryOptions.find(c => c.id === category);
    
    const newTransaction: Transaction = {
      id: uuidv4(),
      date: format(date, "yyyy-MM-dd"),
      type,
      description,
      amount: parseFloat(amount.replace(/\./g, "")),
      category: selectedCategory ? selectedCategory.name : undefined,
      isPaid: false, // Default to unpaid
      budget: type === "fixed" && budget ? parseFloat(budget.replace(/\./g, "")) : undefined
    };

    onAddTransaction(newTransaction);
    resetForm();
  };

  // Reset form fields
  const resetForm = () => {
    setDate(new Date());
    setType("fixed");
    setCategory("");
    setDescription("");
    setAmount("");
    setBudget("");
  };

  // Handle close modal
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get category name from id
  const getCategoryNameById = (id: string): string => {
    const found = categoryOptions.find(c => c.id === id);
    return found ? found.name : "";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Baru</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Date field */}
          <div className="grid gap-2">
            <Label htmlFor="date">Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
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
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Type field */}
          <div className="grid gap-2">
            <Label htmlFor="type">Jenis Pengeluaran</Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as "fixed" | "variable")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis pengeluaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Pengeluaran Tetap</SelectItem>
                <SelectItem value="variable">Pengeluaran Tidak Tetap</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Category field */}
          <div className="grid gap-2">
            <Label htmlFor="category">Kategori</Label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.length > 0 ? (
                  categoryOptions.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="no-categories">
                    Tidak ada kategori tersedia
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          {/* Description field */}
          <div className="grid gap-2">
            <Label htmlFor="description">Keterangan</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Masukkan keterangan transaksi"
            />
          </div>
          
          {/* Budget field for fixed expenses */}
          {type === "fixed" && (
            <div className="grid gap-2">
              <Label htmlFor="budget">Anggaran (Budget)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  Rp
                </span>
                <Input
                  id="budget"
                  className="pl-9"
                  value={budget}
                  onChange={handleBudgetChange}
                  placeholder="0"
                />
              </div>
            </div>
          )}
          
          {/* Amount field */}
          <div className="grid gap-2">
            <Label htmlFor="amount">Jumlah</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <Input
                id="amount"
                className="pl-9"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Batal
          </Button>
          <Button onClick={handleSubmit}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
