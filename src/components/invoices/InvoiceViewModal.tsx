
import { useRef, useEffect, useState } from "react";
import { Invoice, Vendor } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Copy } from "lucide-react";
import { InvoiceDisplay } from "./InvoiceDisplay";
import { downloadInvoiceImage, copyInvoiceToClipboard } from "./invoiceUtils";

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

  const handleDownload = () => {
    downloadInvoiceImage(invoiceRef, invoice.invoiceNumber);
  };

  const handleCopy = () => {
    copyInvoiceToClipboard(invoiceRef);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Invoice #{invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-2" ref={invoiceRef}>
          <InvoiceDisplay 
            invoice={invoice}
            vendor={vendor}
            invoiceSettings={invoiceSettings}
          />
        </div>
        
        <DialogFooter className="mt-3">
          <Button variant="outline" onClick={onClose} size="sm">Tutup</Button>
          <Button onClick={handleCopy} size="sm" variant="secondary" className="ml-2">
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Salin ke Clipboard
          </Button>
          <Button onClick={handleDownload} size="sm">
            <Download className="mr-1.5 h-3.5 w-3.5" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
