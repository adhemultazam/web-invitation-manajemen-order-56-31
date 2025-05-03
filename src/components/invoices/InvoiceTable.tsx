
import { useState, useEffect } from "react";
import { Invoice, Vendor, Addon } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Eye, Check } from "lucide-react";
import { InvoiceViewModal } from "./InvoiceViewModal";

interface InvoiceTableProps {
  invoices: Invoice[];
  vendors: Vendor[];
  onMarkAsPaid: (invoiceId: string) => void;
}

export function InvoiceTable({ invoices, vendors, onMarkAsPaid }: InvoiceTableProps) {
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [addonStyles, setAddonStyles] = useState<Record<string, {color: string}>>({});
  const [defaultAddons, setDefaultAddons] = useState<Addon[]>([]);
  
  // Load addon styles and default addons from localStorage
  useEffect(() => {
    try {
      const storedAddons = localStorage.getItem('addons');
      if (storedAddons) {
        const parsedAddons: Addon[] = JSON.parse(storedAddons);
        const styles: Record<string, {color: string}> = {};
        parsedAddons.forEach(addon => {
          styles[addon.name] = { color: addon.color || '#6366f1' };
        });
        setAddonStyles(styles);
        setDefaultAddons(parsedAddons);
      }
    } catch (e) {
      console.error("Error parsing addons:", e);
    }
  }, []);
  
  const getVendorName = (vendorId: string): string => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : "Unknown Vendor";
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const getDaysRemaining = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Function to get addon style based on its name
  const getAddonStyle = (addonName: string) => {
    const addonStyle = addonStyles[addonName];
    return addonStyle?.color || "#6366f1";
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Jumlah Pesanan</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Jatuh Tempo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => {
                const daysRemaining = getDaysRemaining(invoice.dueDate);
                
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {getVendorName(invoice.vendorId)}
                    </TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.orders.length} pesanan</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(invoice.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{format(new Date(invoice.dueDate), "dd MMM yyyy")}</span>
                        {invoice.status === "Unpaid" && (
                          <Badge 
                            variant={daysRemaining < 0 ? "destructive" : daysRemaining <= 7 ? "default" : "outline"}
                            className="w-fit mt-1"
                          >
                            {daysRemaining < 0 
                              ? `Terlambat ${Math.abs(daysRemaining)} hari` 
                              : `${daysRemaining} hari lagi`}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={invoice.status === "Paid" ? "outline" : "default"}
                        className={invoice.status === "Paid" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                      >
                        {invoice.status === "Paid" ? "Lunas" : "Belum Lunas"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setViewInvoice(invoice)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status === "Unpaid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 text-green-600 border-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onMarkAsPaid(invoice.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Tidak ada data invoice
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {viewInvoice && (
        <InvoiceViewModal 
          invoice={viewInvoice}
          vendor={vendors.find(v => v.id === viewInvoice.vendorId)}
          onClose={() => setViewInvoice(null)}
        />
      )}
    </>
  );
}
