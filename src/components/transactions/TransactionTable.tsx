
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

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Filter transactions based on active tab
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.type === activeTab;
  });
  
  // Get badge color based on transaction type
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "fixed":
        return "warning"; // Using our new warning variant
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
                        <Badge variant={getBadgeVariant(transaction.type)}>
                          {getCategoryLabel(transaction.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">{transaction.description}</TableCell>
                      <TableCell className="text-right py-3 font-medium">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
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
    </div>
  );
}
