import React, { useState } from "react";
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
import { Order, Theme, Addon, Vendor } from "@/types/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EditOrderDialogProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<Order>) => void;
  vendors: Vendor[]; // Updated to accept Vendor[] instead of string[]
  workStatuses: string[];
  themes: Theme[];
  addons: Addon[];
}

export function EditOrderDialog({
  order,
  isOpen,
  onClose,
  onSave,
  vendors,
  workStatuses,
  themes,
  addons
}: EditOrderDialogProps) {
  const [selectedAddons, setSelectedAddons] = useState<string[]>(order?.addons || []);

  const form = useForm({
    defaultValues: {
      customerName: order?.customerName || "",
      clientName: order?.clientName || "",
      clientUrl: order?.clientUrl || "",
      orderDate: order?.orderDate || "",
      eventDate: order?.eventDate || "",
      vendor: order?.vendor || "",
      package: order?.package || "",
      theme: order?.theme || "",
      paymentStatus: order?.paymentStatus || "Pending",
      paymentAmount: order?.paymentAmount || 0,
      workStatus: order?.workStatus || "Data Belum",
      postPermission: order?.postPermission || false,
      notes: order?.notes || "",
    },
  });

  const onSubmit = (values: any) => {
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

    if (order) {
      onSave(order.id, data);
    }

    onClose();
  };

  const handleAddonChange = (addonId: string) => {
    setSelectedAddons((prevAddons) => {
      if (prevAddons.includes(addonId)) {
        return prevAddons.filter((id) => id !== addonId);
      } else {
        return [...prevAddons, addonId];
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Pesanan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pemesan</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Lengkap Pemesan" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Client (contoh: Rizki & Putri)" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="clientUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Client</FormLabel>
                  <FormControl>
                    <Input placeholder="https://wedding.com/rizki-putri" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Order</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Acara</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih vendor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>{vendor.name}</SelectItem>
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
                  <FormControl>
                    <Input placeholder="Pilih paket" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tema</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tema" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themes.map((theme) => (
                        <SelectItem key={theme.id} value={theme.name}>{theme.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              {addons.map((addon) => (
                <FormField
                  key={addon.id}
                  control={form.control}
                  name={`addon_${addon.id}`}
                  render={() => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        {addon.name}
                      </FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => handleAddonChange(addon.id)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pembayaran</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Lunas">Lunas</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah Pembayaran</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Jumlah pembayaran" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Pengerjaan</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {workStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postPermission"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                    Izin Posting
                  </FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Input placeholder="Catatan tambahan" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Simpan</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
