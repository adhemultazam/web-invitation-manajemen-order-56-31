
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface InvoiceSettingsPreviewProps {
  settings: {
    logoUrl: string;
    brandName: string;
    businessAddress: string;
    contactEmail: string;
    contactPhone: string;
    bankAccounts: BankAccount[];
    invoiceFooter: string;
  };
}

export function InvoiceSettingsPreview({ settings }: InvoiceSettingsPreviewProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  // Sample invoice data for preview
  const sampleInvoice = {
    id: "INV-001",
    dateIssued: new Date(),
    orders: [
      { 
        orderId: "ORD-001", 
        orderDate: new Date(), 
        clientName: "Agus Budiman", 
        amount: 1500000 
      },
      { 
        orderId: "ORD-002", 
        orderDate: new Date(), 
        clientName: "Budi Santoso", 
        amount: 2000000 
      }
    ],
    totalAmount: 3500000,
    status: "Unpaid"
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="text-base">Preview Invoice</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white mx-1 mb-1 rounded-md border shadow-sm" ref={invoiceRef}>
          <div className="max-h-[600px] overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  {settings.logoUrl && (
                    <div className="w-16 h-16 rounded overflow-hidden">
                      <img
                        src={settings.logoUrl}
                        alt="Business Logo"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/64?text=Logo";
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-wedding-primary">{settings.brandName}</h2>
                    <p className="text-xs text-muted-foreground">{settings.businessAddress}</p>
                    <p className="text-xs text-muted-foreground">{settings.contactEmail}</p>
                    <p className="text-xs text-muted-foreground">{settings.contactPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-semibold">INVOICE</h3>
                  <p className="text-xs font-medium">#{sampleInvoice.id}</p>
                  <p className="text-xs text-muted-foreground">
                    Tanggal: {format(sampleInvoice.dateIssued, "dd MMMM yyyy")}
                  </p>
                </div>
              </div>
              
              {/* Vendor Info */}
              <div className="p-3 bg-muted rounded-md">
                <h4 className="text-xs font-medium text-muted-foreground">VENDOR:</h4>
                <p className="font-medium">Nama Vendor</p>
                <p className="text-xs">Kode: VDR-001</p>
              </div>
              
              {/* Orders Table */}
              <div className="mt-6">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted">
                      <tr>
                        <th className="py-2 px-3 text-left">Order ID</th>
                        <th className="py-2 px-3 text-left">Tanggal</th>
                        <th className="py-2 px-3 text-left">Client</th>
                        <th className="py-2 px-3 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleInvoice.orders.map((order, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-3">#{order.orderId}</td>
                          <td className="py-2 px-3">
                            {format(order.orderDate, "dd/MM/yyyy")}
                          </td>
                          <td className="py-2 px-3">{order.clientName}</td>
                          <td className="py-2 px-3 text-right font-medium">
                            {formatCurrency(order.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-1/2">
                  <div className="flex justify-between py-2 text-sm">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">{formatCurrency(sampleInvoice.totalAmount)}</span>
                  </div>
                  <div className="mt-4 p-2 rounded bg-muted">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold text-destructive">
                        BELUM LUNAS
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer - Bank Information */}
              <div className="pt-4 border-t text-center text-xs text-muted-foreground">
                <p>{settings.invoiceFooter || "Terima kasih atas pesanan Anda."}</p>
                <p className="mt-1">Pembayaran dapat dilakukan melalui transfer ke:</p>
                <div className="mt-2 space-y-1">
                  {settings.bankAccounts?.map((account, index) => (
                    <p key={account.id || index}>
                      {account.bankName} {account.accountNumber} a.n. {account.accountHolderName}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
