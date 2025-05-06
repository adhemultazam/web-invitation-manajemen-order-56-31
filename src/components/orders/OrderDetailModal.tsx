
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/types";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
  isOpen: boolean;
}

export function OrderDetailModal({ order, onClose, isOpen }: OrderDetailModalProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    // Keeping the long format for the detail modal as it has more space
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  // Function to safely format payment amount
  const safeFormatCurrency = (amount: number | string) => {
    // If it's a string, try to convert to number
    if (typeof amount === 'string') {
      const parsedAmount = parseFloat(amount);
      if (!isNaN(parsedAmount)) {
        return formatCurrency(parsedAmount);
      }
      return amount; // If conversion fails, return the original string
    }
    return formatCurrency(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pesanan</DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang pesanan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <section>
            <h3 className="text-lg font-medium">Informasi Client</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm text-muted-foreground">Nama Pemesan</div>
              <div className="text-sm font-medium">{order.customerName}</div>
              
              <div className="text-sm text-muted-foreground">Nama Client</div>
              <div className="text-sm font-medium">{order.clientName}</div>
              
              {order.clientUrl && (
                <>
                  <div className="text-sm text-muted-foreground">URL Undangan</div>
                  <div className="text-sm font-medium">
                    <a 
                      href={order.clientUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-wedding-primary hover:underline"
                    >
                      {order.clientUrl}
                    </a>
                  </div>
                </>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium">Detail Pesanan</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm text-muted-foreground">Tanggal Pesan</div>
              <div className="text-sm font-medium">{formatDate(order.orderDate)}</div>
              
              <div className="text-sm text-muted-foreground">Tanggal Acara</div>
              <div className="text-sm font-medium">{formatDate(order.eventDate)}</div>
              
              <div className="text-sm text-muted-foreground">Countdown</div>
              <div className="text-sm font-medium">{order.countdownDays} hari</div>
              
              <div className="text-sm text-muted-foreground">Paket</div>
              <div className="text-sm font-medium">{order.package}</div>
              
              <div className="text-sm text-muted-foreground">Tema</div>
              <div className="text-sm font-medium">{order.theme}</div>

              <div className="text-sm text-muted-foreground">Vendor</div>
              <div className="text-sm font-medium">{order.vendor}</div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium">Status</h3>
            <Separator className="my-2" />
            <div className="grid grid-cols-2 gap-y-2">
              <div className="text-sm text-muted-foreground">Status Pembayaran</div>
              <div className="text-sm">
                <Badge 
                  variant={order.paymentStatus === "Lunas" ? "outline" : "default"}
                  className={order.paymentStatus === "Lunas" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}
                >
                  {order.paymentStatus}
                </Badge>
                <div className="mt-1 text-xs font-mono">{safeFormatCurrency(order.paymentAmount)}</div>
              </div>
              
              <div className="text-sm text-muted-foreground">Status Pengerjaan</div>
              <div className="text-sm">
                <Badge className={getStatusColor(order.workStatus)}>
                  {order.workStatus}
                </Badge>
              </div>
            </div>
          </section>

          {(order.addons.length > 0 || (order.bonuses && order.bonuses.length > 0)) && (
            <section>
              <h3 className="text-lg font-medium">Fitur Tambahan</h3>
              <Separator className="my-2" />
              
              {order.addons.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium mb-1">Addon:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {order.addons.map((addon, index) => (
                      <li key={index} className="text-sm">{addon}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {order.bonuses && order.bonuses.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Bonus:</div>
                  <ul className="list-disc pl-5 space-y-1">
                    {order.bonuses.map((bonus, index) => (
                      <li key={index} className="text-sm">{bonus}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {order.notes && (
            <section>
              <h3 className="text-lg font-medium">Catatan</h3>
              <Separator className="my-2" />
              <p className="text-sm">{order.notes}</p>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
