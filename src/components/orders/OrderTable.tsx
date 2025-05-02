
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/types";
import { Link } from "react-router-dom";
import { ChevronDown, Edit, Eye } from "lucide-react";

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'selesai':
        return 'bg-green-500';
      case 'progress':
        return 'bg-blue-500';
      case 'review':
        return 'bg-amber-500';
      case 'revisi':
        return 'bg-orange-500';
      case 'data belum':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'lunas':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      case 'belum bayar':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[100px]">Tgl Pesan</TableHead>
            <TableHead className="w-[100px]">Tgl Acara</TableHead>
            <TableHead className="w-[80px]">Countdown</TableHead>
            <TableHead className="w-[150px]">Nama Pemesan</TableHead>
            <TableHead className="w-[150px]">Nama Klien</TableHead>
            <TableHead className="w-[120px]">Vendor</TableHead>
            <TableHead className="w-[120px]">Paket</TableHead>
            <TableHead className="w-[120px]">Tema</TableHead>
            <TableHead className="w-[150px]">Status Pembayaran</TableHead>
            <TableHead className="w-[150px]">Status Pengerjaan</TableHead>
            <TableHead className="w-[80px]">Izin Post</TableHead>
            <TableHead className="w-[60px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                Tidak ada data pesanan
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {new Date(order.orderDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {new Date(order.eventDate).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {order.countdownDays} hari
                </TableCell>
                <TableCell className="font-medium">{order.customerName}</TableCell>
                <TableCell>
                  <Link to={`/order/${order.id}`} className="text-wedding-primary hover:underline">
                    {order.clientName}
                  </Link>
                </TableCell>
                <TableCell>{order.vendor}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 text-xs px-2">
                        {order.package}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64">
                      <div className="p-2">
                        <div className="mb-2">
                          <span className="font-semibold text-xs">Addons:</span>
                          {order.addons.length ? (
                            <ul className="text-xs ml-2 mt-1 list-disc pl-3">
                              {order.addons.map((addon, i) => (
                                <li key={i}>{addon}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground ml-2 mt-1">Tidak ada</p>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-xs">Bonus:</span>
                          {order.bonuses.length ? (
                            <ul className="text-xs ml-2 mt-1 list-disc pl-3">
                              {order.bonuses.map((bonus, i) => (
                                <li key={i}>{bonus}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-muted-foreground ml-2 mt-1">Tidak ada</p>
                          )}
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{order.theme}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                    <div className="text-xs font-mono">{formatCurrency(order.paymentAmount)}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.workStatus)}>
                    {order.workStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox checked={order.postPermission} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/order/${order.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Link to={`/order/${order.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
