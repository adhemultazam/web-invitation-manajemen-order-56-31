
import { useState } from "react";
import { Transaction } from "@/types/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import TransactionActions from "@/components/transactions/TransactionActions";
import ViewTransactionModal from "@/components/transactions/ViewTransactionModal";
import EditTransactionModal from "@/components/transactions/EditTransactionModal";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  
  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });
  
  // Get badge color based on transaction type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "fixed":
        return "warning"; // Using our warning variant
      case "variable":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  // Get category label
  const getCategoryLabel = (type: string): string => {
    switch (type) {
      case "fixed":
        return "Tetap";
      case "variable":
        return "Tidak Tetap";
      default:
        return "Lainnya";
    }
  };

  const handleViewTransaction = (transaction: Transaction) => {
    setViewingTransaction(transaction);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDeletePrompt = (id: string) => {
    setDeletingTransactionId(id);
  };

  const confirmDelete = () => {
    if (deletingTransactionId) {
      onDelete(deletingTransactionId);
      setDeletingTransactionId(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="fixed">Pengeluaran Tetap</TabsTrigger>
          <TabsTrigger value="variable">Pengeluaran Tidak Tetap</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="rounded-md border overflow-hidden">
            <Table className="w-full">
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="py-3 font-poppins text-xs tracking-wide">Tanggal</TableHead>
                  <TableHead className="py-3 font-poppins text-xs tracking-wide">Kategori</TableHead>
                  <TableHead className="py-3 font-poppins text-xs tracking-wide">Keterangan</TableHead>
                  <TableHead className="text-right py-3 font-poppins text-xs tracking-wide">Jumlah</TableHead>
                  <TableHead className="text-right py-3 font-poppins text-xs tracking-wide w-[100px]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <TableRow key={transaction.id} className="h-14">
                      <TableCell className="py-3">
                        {format(new Date(transaction.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant={getBadgeVariant(transaction.type) as "warning" | "destructive" | "outline"}>
                          {getCategoryLabel(transaction.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">{transaction.description}</TableCell>
                      <TableCell className="text-right py-3 font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell className="text-right py-3">
                        <TransactionActions
                          transaction={transaction}
                          onView={() => handleViewTransaction(transaction)}
                          onEdit={() => handleEditTransaction(transaction)}
                          onDelete={() => handleDeletePrompt(transaction.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada data transaksi
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length > 0 && (
            <div className="flex justify-end mt-4">
              <div className="text-sm font-medium">
                Total: {formatCurrency(filteredTransactions.reduce((sum, t) => sum + t.amount, 0))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Transaction Modal */}
      {viewingTransaction && (
        <ViewTransactionModal 
          isOpen={viewingTransaction !== null}
          onClose={() => setViewingTransaction(null)}
          transaction={viewingTransaction}
        />
      )}

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal 
          isOpen={editingTransaction !== null}
          onClose={() => setEditingTransaction(null)}
          onSave={(updatedTransaction) => {
            onEdit(updatedTransaction);
            setEditingTransaction(null);
          }}
          transaction={editingTransaction}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletingTransactionId !== null} onOpenChange={(open) => !open && setDeletingTransactionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Transaksi</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
