
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
import { Download, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

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

  const copyInvoiceToClipboard = async () => {
    if (invoiceRef.current) {
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          backgroundColor: "#ffffff",
        });
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // Create a ClipboardItem and write it to clipboard
              const item = new ClipboardItem({ "image/png": blob });
              await navigator.clipboard.write([item]);
              toast.success("Invoice berhasil disalin ke clipboard");
            } catch (error) {
              console.error("Error copying to clipboard:", error);
              toast.error("Gagal menyalin ke clipboard", { 
                description: "Browser Anda mungkin tidak mendukung fitur ini"
              });
            }
          }
        }, "image/png");
      } catch (error) {
        console.error("Error generating invoice image for clipboard:", error);
        toast.error("Gagal menyalin invoice");
      }
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Invoice #{invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2" ref={invoiceRef}>
          <div className="bg-white p-4 rounded-lg border">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                {invoiceSettings.logoUrl && (
                  <div className="w-12 h-12 rounded overflow-hidden">
                    <img 
                      src={invoiceSettings.logoUrl} 
                      alt="Business Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-wedding-primary">{invoiceSettings.brandName}</h2>
                  <p className="text-xs text-muted-foreground">{invoiceSettings.businessAddress}</p>
                  <p className="text-xs text-muted-foreground">{invoiceSettings.contactEmail}</p>
                  <p className="text-xs text-muted-foreground">{invoiceSettings.contactPhone}</p>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-lg font-semibold">INVOICE</h3>
                <p className="text-xs font-medium">#{invoice.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">
                  Tanggal: {format(new Date(invoice.dateIssued), "dd MMM yyyy")}
                </p>
              </div>
            </div>
            
            {/* Vendor Info */}
            <div className="mt-4 p-3 bg-muted rounded-md">
              <h4 className="text-xs font-medium text-muted-foreground">VENDOR:</h4>
              <p className="font-medium text-sm">{vendor?.name || invoice.vendor}</p>
              {vendor && <p className="text-xs">Kode: {vendor.code}</p>}
            </div>
            
            {/* Orders Table */}
            <div className="mt-4">
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-2 text-left">Order ID</th>
                      <th className="py-2 px-2 text-left">Tanggal</th>
                      <th className="py-2 px-2 text-left">Client</th>
                      <th className="py-2 px-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.orders.map((order) => (
                      <tr key={order.orderId} className="border-t">
                        <td className="py-1.5 px-2">#{order.orderId}</td>
                        <td className="py-1.5 px-2">
                          {format(new Date(order.orderDate), "dd/MM/yy")}
                        </td>
                        <td className="py-1.5 px-2">{order.clientName}</td>
                        <td className="py-1.5 px-2 text-right font-medium">
                          {formatCurrency(order.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Summary */}
            <div className="mt-4 flex justify-end">
              <div className="w-1/2">
                <div className="flex justify-between py-1.5">
                  <span className="font-medium text-sm">Total:</span>
                  <span className="font-bold text-sm">{formatCurrency(invoice.totalAmount)}</span>
                </div>
                <div className="mt-2 p-2 rounded bg-muted">
                  <div className="flex justify-between">
                    <span className="text-xs">Status:</span>
                    <span className={`font-semibold text-xs ${
                      invoice.status === "Paid" ? "text-green-600" : "text-destructive"
                    }`}>
                      {invoice.status === "Paid" ? "LUNAS" : "BELUM LUNAS"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer - Bank Information */}
            <div className="mt-4 pt-3 border-t text-center text-xs text-muted-foreground">
              <p>{invoiceSettings.invoiceFooter || "Terima kasih atas pesanan Anda."}</p>
              <p className="mt-0.5">Pembayaran dapat dilakukan melalui transfer ke:</p>
              <div className="mt-1 space-y-0.5">
                {invoiceSettings.bankAccounts?.map((account, index) => (
                  <p key={account.id || index}>
                    {account.bankName} {account.accountNumber} a.n. {account.accountHolderName}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={onClose} size="sm">Tutup</Button>
          <Button onClick={copyInvoiceToClipboard} size="sm" variant="secondary" className="ml-2">
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Salin ke Clipboard
          </Button>
          <Button onClick={downloadInvoiceImage} size="sm">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
