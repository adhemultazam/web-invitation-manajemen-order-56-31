
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { format, addDays } from "date-fns";
import { toast } from "sonner";
import { Order, Vendor } from "@/types/types";
import { 
  generateInvoice, 
  filterOrdersByVendor, 
  isOrderInvoiced, 
  loadInvoices, 
  saveInvoices, 
  getVendorsWithUnpaidOrders 
} from "@/lib/invoiceUtils";

interface CreateInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  vendors: Vendor[];
  orders: Order[];
  onInvoiceCreated: () => void;
}

export function CreateInvoiceDialog({
  open,
  onClose,
  vendors,
  orders,
  onInvoiceCreated,
}: CreateInvoiceDialogProps) {
  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [vendorOrders, setVendorOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 14)); // Default due date: 14 days from today
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [existingInvoices, setExistingInvoices] = useState([]);
  const [vendorOrderCounts, setVendorOrderCounts] = useState<Record<string, number>>({});
  
  // Load existing invoices to check for already invoiced orders
  useEffect(() => {
    if (open) {
      const invoices = loadInvoices();
      setExistingInvoices(invoices);
      
      // Calculate number of uninvoiced orders per vendor
      const orderCounts = getVendorsWithUnpaidOrders(orders, invoices);
      setVendorOrderCounts(orderCounts);
      
      // Reset selection when dialog opens
      setSelectedVendor("");
      setVendorOrders([]);
      setSelectedOrders([]);
    }
  }, [open, orders]);

  // Filter orders when vendor changes
  useEffect(() => {
    if (selectedVendor) {
      // Fix: Use proper filtering for vendor orders
      const filteredOrders = orders.filter(order => {
        return order.vendor === selectedVendor && 
               order.paymentStatus === 'Lunas' && 
               !isOrderInvoiced(order.id, existingInvoices);
      });
      
      setVendorOrders(filteredOrders);
      setSelectedOrders([]); // Reset selections when vendor changes
    } else {
      setVendorOrders([]);
    }
  }, [selectedVendor, orders, existingInvoices]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(vendorOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleOrderSelection = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateInvoice = () => {
    if (!selectedVendor || selectedOrders.length === 0 || !dueDate) {
      toast.error("Pilih vendor, pesanan, dan tanggal jatuh tempo");
      return;
    }

    setIsLoading(true);

    try {
      const selectedVendorObj = vendors.find(v => v.id === selectedVendor);
      if (!selectedVendorObj) {
        toast.error("Data vendor tidak valid");
        setIsLoading(false);
        return;
      }

      const ordersToInvoice = vendorOrders.filter(order => selectedOrders.includes(order.id));
      
      const invoice = generateInvoice(
        selectedVendorObj.id,
        selectedVendorObj.name,
        ordersToInvoice,
        dueDate.toISOString().split('T')[0]
      );

      // Save to local storage
      const existingInvoices = loadInvoices();
      saveInvoices([...existingInvoices, invoice]);

      toast.success("Invoice berhasil dibuat");
      onInvoiceCreated();
      onClose();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error("Gagal membuat invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const totalSelectedAmount = vendorOrders
    .filter(order => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + order.paymentAmount, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buat Invoice Baru</DialogTitle>
          <DialogDescription>
            Pilih vendor dan pesanan untuk membuat invoice baru
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Select
              value={selectedVendor}
              onValueChange={setSelectedVendor}
            >
              <SelectTrigger id="vendor">
                <SelectValue placeholder="Pilih vendor" />
              </SelectTrigger>
              <SelectContent>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{vendor.name}</span>
                      {vendorOrderCounts[vendor.id] > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {vendorOrderCounts[vendor.id]} pesanan
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Tanggal Jatuh Tempo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  id="dueDate"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => date && setDueDate(date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Daftar Pesanan</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAll" 
                  checked={selectedOrders.length === vendorOrders.length && vendorOrders.length > 0}
                  onCheckedChange={handleSelectAll}
                  disabled={vendorOrders.length === 0}
                />
                <Label htmlFor="selectAll" className="text-sm font-normal">
                  Pilih Semua
                </Label>
              </div>
            </div>
            
            {vendorOrders.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Tgl Pesanan</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order.id)}
                            onCheckedChange={(checked) =>
                              handleOrderSelection(order.id, !!checked)
                            }
                          />
                        </TableCell>
                        <TableCell>{order.id.substring(0, 8)}</TableCell>
                        <TableCell>{order.clientName}</TableCell>
                        <TableCell>{format(new Date(order.orderDate), "dd MMM yyyy")}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.paymentAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                {selectedVendor
                  ? "Tidak ada pesanan yang tersedia untuk vendor ini"
                  : "Pilih vendor terlebih dahulu"}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Invoice:</span>
              <span className="font-bold text-lg">
                {formatCurrency(totalSelectedAmount)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Batal
          </Button>
          <Button
            onClick={handleCreateInvoice}
            disabled={selectedOrders.length === 0 || isLoading}
          >
            {isLoading ? "Membuat..." : "Buat Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
