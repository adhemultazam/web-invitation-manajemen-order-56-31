
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction } from "@/types/types";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

export default function ViewTransactionModal({
  isOpen,
  onClose,
  transaction,
}: ViewTransactionModalProps) {
  // Get category label
  const getCategoryLabel = (type: string): string => {
    switch (type) {
      case "fixed":
        return "Pengeluaran Tetap";
      case "variable":
        return "Pengeluaran Tidak Tetap";
      default:
        return "Lainnya";
    }
  };

  // Get badge color based on transaction type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "fixed":
        return "warning";
      case "variable":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Tanggal</p>
              <p className="text-sm">{format(new Date(transaction.date), "dd MMMM yyyy")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Kategori</p>
              <Badge variant={getBadgeVariant(transaction.type) as "warning" | "destructive" | "outline"}>
                {getCategoryLabel(transaction.type)}
              </Badge>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Keterangan</p>
            <p className="text-sm">{transaction.description}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Jumlah</p>
            <p className="text-lg font-semibold">{formatCurrency(transaction.amount)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
