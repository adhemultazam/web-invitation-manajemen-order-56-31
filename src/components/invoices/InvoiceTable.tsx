
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
import { Eye, Check, Trash } from "lucide-react";
import { InvoiceViewModal } from "./InvoiceViewModal";
import { cn } from "@/lib/utils";

interface InvoiceTableProps {
  invoices: Invoice[];
  vendors: Vendor[];
  onMarkAsPaid: (invoiceId: string) => void;
  onDeleteInvoice: (invoiceId: string) => void;
}

export function InvoiceTable({ invoices, vendors, onMarkAsPaid, onDeleteInvoice }: InvoiceTableProps) {
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
  
  // Function to get addon style based on its name
  const getAddonStyle = (addonName: string) => {
    const addonStyle = addonStyles[addonName];
    return addonStyle?.color || "#6366f1";
  };
  
  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table className="w-full font-inter">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="py-3 font-poppins text-xs tracking-wide">Vendor</TableHead>
              <TableHead className="py-3 font-poppins text-xs tracking-wide">Invoice #</TableHead>
              <TableHead className="py-3 font-poppins text-xs tracking-wide">Jumlah Pesanan</TableHead>
              <TableHead className="text-right py-3 font-poppins text-xs tracking-wide">Total</TableHead>
              <TableHead className="py-3 font-poppins text-xs tracking-wide">Status</TableHead>
              <TableHead className="text-right py-3 font-poppins text-xs tracking-wide">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length > 0 ? (
              invoices.map((invoice) => {
                return (
                  <TableRow key={invoice.id} className="h-14">
                    <TableCell className="py-3 font-medium">
                      {getVendorName(invoice.vendorId)}
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="py-3">
                      {invoice.orders.length} pesanan
                    </TableCell>
                    <TableCell className="text-right py-3 font-medium">
                      {formatCurrency(invoice.totalAmount)}
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge 
                        variant={invoice.status === "Paid" ? "outline" : "default"}
                        className={cn(
                          "font-medium",
                          invoice.status === "Paid" 
                            ? "bg-green-100 text-green-800 hover:bg-green-100" 
                            : ""
                        )}
                      >
                        {invoice.status === "Paid" ? "Lunas" : "Belum Lunas"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-3">
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 border-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDeleteInvoice(invoice.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center font-inter">
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
