
import { useRef, useEffect, useState } from "react";
import { Invoice, Vendor, BankAccount } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

interface InvoiceViewModalProps {
  invoice: Invoice;
  vendor?: Vendor;
  onClose: () => void;
}

// Default invoice settings
const defaultInvoiceSettings = {
  logoUrl: "",
  brandName: "Undangan Digital",
  businessAddress: "Jl. Pemuda No. 123, Surabaya",
  contactEmail: "contact@undangandigital.com",
  contactPhone: "+62 812 3456 7890",
  bankAccounts: [
    {
      id: "1",
      bankName: "BCA",
      accountNumber: "1234567890",
      accountHolderName: "PT Undangan Digital Indonesia",
    }
  ],
  invoiceFooter: "Terima kasih atas pesanan Anda."
};

export function InvoiceViewModal({ invoice, vendor, onClose }: InvoiceViewModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceSettings, setInvoiceSettings] = useState(defaultInvoiceSettings);
  
  useEffect(() => {
    // Load invoice settings from localStorage if available
    const savedSettings = localStorage.getItem("invoiceSettings");
    if (savedSettings) {
      try {
        setInvoiceSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error("Error parsing invoice settings:", e);
      }
    }
  }, []);
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const downloadInvoiceImage = async () => {
    if (invoiceRef.current) {
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        
        const image = canvas.toDataURL("image/png", 1.0);
        const downloadLink = document.createElement("a");
        downloadLink.href = image;
        downloadLink.download = `invoice-${invoice.invoiceNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } catch (error) {
        console.error("Error generating invoice image:", error);
      }
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice #{invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4" ref={invoiceRef}>
          <div className="bg-white p-6 rounded-lg border">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {invoiceSettings.logoUrl && (
                  <div className="w-16 h-16 rounded overflow-hidden">
                    <img 
                      src={invoiceSettings.logoUrl} 
                      alt="Business Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-wedding-primary">{invoiceSettings.brandName}</h2>
                  <p className="text-sm text-muted-foreground">{invoiceSettings.businessAddress}</p>
                  <p className="text-sm text-muted-foreground">{invoiceSettings.contactEmail}</p>
                  <p className="text-sm text-muted-foreground">{invoiceSettings.contactPhone}</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-semibold">INVOICE</h3>
                <p className="text-sm font-medium">#{invoice.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">
                  Tanggal: {format(new Date(invoice.dateIssued), "dd MMMM yyyy")}
                </p>
              </div>
            </div>
            
            {/* Vendor Info */}
            <div className="mt-8 p-4 bg-muted rounded-md">
              <h4 className="text-sm font-medium text-muted-foreground">VENDOR:</h4>
              <p className="font-medium">{vendor?.name || invoice.vendor}</p>
              {vendor && <p className="text-sm">Kode: {vendor.code}</p>}
            </div>
            
            {/* Orders Table */}
            <div className="mt-6">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-3 px-4 text-left">Order ID</th>
                      <th className="py-3 px-4 text-left">Tanggal</th>
                      <th className="py-3 px-4 text-left">Client</th>
                      <th className="py-3 px-4 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.orders.map((order) => (
                      <tr key={order.orderId} className="border-t">
                        <td className="py-3 px-4">#{order.orderId}</td>
                        <td className="py-3 px-4">
                          {format(new Date(order.orderDate), "dd/MM/yyyy")}
                        </td>
                        <td className="py-3 px-4">{order.clientName}</td>
                        <td className="py-3 px-4 text-right font-medium">
                          {formatCurrency(order.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mt-6 flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between py-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="mt-4 p-2 rounded bg-muted">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-semibold ${
                      invoice.status === "Paid" ? "text-green-600" : "text-destructive"
                    }`}>
                      {invoice.status === "Paid" ? "LUNAS" : "BELUM LUNAS"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer - Bank Information */}
            <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
              <p>{invoiceSettings.invoiceFooter || "Terima kasih atas pesanan Anda."}</p>
              <p className="mt-1">Pembayaran dapat dilakukan melalui transfer ke:</p>
              <div className="mt-2 space-y-1">
                {invoiceSettings.bankAccounts?.map((account, index) => (
                  <p key={account.id || index}>
                    {account.bankName} {account.accountNumber} a.n. {account.accountHolderName}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Tutup</Button>
          <Button onClick={downloadInvoiceImage}>
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
