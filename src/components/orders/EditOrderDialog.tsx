
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Order, Theme, Addon, Vendor, WorkStatus, Package } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface EditOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Order>) => void;
  vendors: Vendor[];
  workStatuses: WorkStatus[];
  themes: Theme[];
  addons: Addon[];
  packages: Package[];
}

export function EditOrderDialog({
  order,
  isOpen,
  onClose,
  onSave,
  vendors,
  workStatuses,
  themes,
  addons,
  packages = []
}: EditOrderDialogProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  
  // Initialize the form with default values
  const form = useForm({
    defaultValues: {
      customerName: "",
      clientName: "",
      clientUrl: "",
      orderDate: "",
      eventDate: "",
      vendor: "",
      package: "",
      theme: "",
      paymentStatus: "Pending",
      paymentAmount: 0,
      workStatus: "",
      postPermission: false,
      notes: "",
    },
  });
  
  // Update form values when order changes or dialog opens
  useEffect(() => {
    if (order && isOpen) {
      form.reset({
        customerName: order.customerName || "",
        clientName: order.clientName || "",
        clientUrl: order.clientUrl || "",
        orderDate: order.orderDate || "",
        eventDate: order.eventDate || "",
        vendor: order.vendor || "",
        package: order.package || "",
        theme: order.theme || "",
        paymentStatus: order.paymentStatus || "Pending",
        paymentAmount: order.paymentAmount || 0,
        workStatus: order.workStatus || "",
        postPermission: order.postPermission || false,
        notes: order.notes || "",
      });
      
      // Initialize selected addons from order
      setSelectedAddons(order.addons || []);
    }
  }, [order, isOpen, form]);

  const onSubmit = (values: any) => {
    if (!order) return;
    
    const data: Partial<Order> = {
      customerName: values.customerName,
      clientName: values.clientName,
      clientUrl: values.clientUrl,
      orderDate: values.orderDate,
      eventDate: values.eventDate,
      vendor: values.vendor,
      package: values.package,
      theme: values.theme,
      paymentStatus: values.paymentStatus,
      paymentAmount: values.paymentAmount,
      workStatus: values.workStatus,
      postPermission: values.postPermission,
      notes: values.notes,
      addons: selectedAddons,
    };

    onSave(order.id, data);
    onClose();
  };

  const handleAddonChange = (addonName: string) => {
    setSelectedAddons((prevAddons) => {
      if (prevAddons.includes(addonName)) {
        return prevAddons.filter((name) => name !== addonName);
      } else {
        return [...prevAddons, addonName];
      }
    });
  };

  const getAddonColor = (addonName: string) => {
    const addon = addons.find(a => a.name === addonName);
    return addon?.color || '#6E6E6E';
  };

  // Find the correct vendor name for display
  const getVendorName = (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId);
    return vendor ? vendor.name : vendorId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1 */}
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pemesan</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama pemesan" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Mempelai</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Rizki & Putri" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Row 2 */}
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Pemesanan</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd MMM yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Tanggal Acara</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal w-full",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd MMM yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              
              {/* Row 3 */}
              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih vendor">
                            {field.value ? getVendorName(field.value) : "Pilih vendor"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id}>
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 mr-2 rounded-full"
                                style={{ backgroundColor: vendor.color }}
                              />
                              {vendor.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="package"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paket</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih paket" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.name}>
                            {pkg.name} - Rp {pkg.price?.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Addons */}
            <div>
              <FormLabel>Addons</FormLabel>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {addons.map((addon) => (
                  <div key={addon.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`addon-${addon.id}`}
                      checked={selectedAddons.includes(addon.name)}
                      onCheckedChange={() => handleAddonChange(addon.name)}
                    />
                    <label
                      htmlFor={`addon-${addon.id}`}
                      className="text-sm font-medium leading-none flex items-center"
                    >
                      <div
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: addon.color }}
                      />
                      {addon.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 4 */}
              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Status Pembayaran</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Lunas" id="lunas" />
                          <label htmlFor="lunas" className="text-sm">Lunas</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Pending" id="pending" />
                          <label htmlFor="pending" className="text-sm">Pending</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Pembayaran (Rp)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {/* Row 5 */}
              <FormField
                control={form.control}
                name="workStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Pengerjaan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.name}>
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 mr-2 rounded-full"
                                style={{ backgroundColor: status.color }}
                              />
                              {status.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themes.map((theme) => (
                          <SelectItem key={theme.id} value={theme.name}>
                            {theme.name} {theme.category ? `(${theme.category})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* URL */}
            <FormField
              control={form.control}
              name="clientUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Undangan</FormLabel>
                  <FormControl>
                    <Input placeholder="https://undangandigital.com/nama-mempelai" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {/* Post Permission */}
            <FormField
              control={form.control}
              name="postPermission"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Izin posting sebagai portfolio
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Catatan tambahan" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 flex justify-between">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
