
import { Order } from "@/types/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface CompactOrdersTableProps {
  orders: Order[];
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
}

export function CompactOrdersTable({ orders, onEditOrder, onDeleteOrder }: CompactOrdersTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        Tidak ada pesanan untuk ditampilkan
      </div>
    );
  }

  const formatCurrency = (amount: number | string): string => {
    if (typeof amount === 'string') {
      // Convert string representation to number
      amount = parseFloat(amount.replace(/[^\d.-]/g, ''));
    }
    
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <Table className="compact-table">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="w-[120px]">Tanggal</TableHead>
            <TableHead>Klien</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Jumlah</TableHead>
            <TableHead className="w-[100px] text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
              <TableCell className="text-xs">
                {order.orderDate && (
                  <div className="text-[10px] text-gray-600 dark:text-gray-400">
                    {format(new Date(order.orderDate), "dd/MM/yy")}
                  </div>
                )}
              </TableCell>
              <TableCell>{order.clientName}</TableCell>
              <TableCell>
                <Badge
                  variant={order.paymentStatus === "Lunas" ? "outline" : "secondary"}
                  className={
                    order.paymentStatus === "Lunas"
                      ? "compact-badge bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "compact-badge bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(order.paymentAmount || 0)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditOrder(order)}
                    className="h-7 w-7 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteOrder(order.id)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
