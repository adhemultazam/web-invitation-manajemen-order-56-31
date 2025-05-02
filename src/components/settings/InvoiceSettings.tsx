
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";

// Default invoice settings
const defaultInvoiceSettings = {
  brandName: "Undangan Digital",
  businessAddress: "Jl. Pemuda No. 123, Surabaya",
  contactEmail: "contact@undangandigital.com",
  contactPhone: "+62 812 3456 7890",
  bankName: "BCA",
  bankAccountNumber: "1234567890",
  accountHolderName: "PT Undangan Digital Indonesia",
};

// Type for our invoice settings
interface InvoiceSettingsType {
  brandName: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  bankName: string;
  bankAccountNumber: string;
  accountHolderName: string;
}

export function InvoiceSettings() {
  const [invoiceSettings, setInvoiceSettings] = useState<InvoiceSettingsType>(() => {
    // Try to load from localStorage on initial render
    const savedSettings = localStorage.getItem("invoiceSettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultInvoiceSettings;
  });
  
  const form = useForm<InvoiceSettingsType>({
    defaultValues: invoiceSettings,
  });
  
  // Update form values when invoiceSettings change
  useEffect(() => {
    form.reset(invoiceSettings);
  }, [invoiceSettings, form]);

  const onSubmit = (data: InvoiceSettingsType) => {
    // Save to localStorage
    localStorage.setItem("invoiceSettings", JSON.stringify(data));
    setInvoiceSettings(data);
    
    // Show success message
    toast.success("Pengaturan invoice berhasil disimpan", {
      description: "Detail bisnis telah diperbarui untuk invoice",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Invoice</CardTitle>
        <CardDescription>
          Atur detail bisnis untuk ditampilkan pada invoice
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi Bisnis</h3>
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Brand</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Undangan Digital" />
                      </FormControl>
                      <FormDescription>
                        Nama perusahaan atau brand yang akan ditampilkan
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Bisnis</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Jl. Pemuda No. 123, Surabaya" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Kontak</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="contact@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telepon Kontak</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="+62 812 3456 7890" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi Pembayaran</h3>
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Bank</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="BCA" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bankAccountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nomor Rekening</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="1234567890" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Pemilik Rekening</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="PT Undangan Digital Indonesia" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" className="mt-4">
              Simpan Pengaturan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
