
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
import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { BankAccount } from "@/types/types";
import { Plus, Trash2 } from "lucide-react";

// Default invoice settings
const defaultInvoiceSettings = {
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
  ]
};

// Type for our invoice settings
interface InvoiceSettingsType {
  brandName: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  bankAccounts: BankAccount[];
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
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bankAccounts",
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Informasi Rekening Bank</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => append({ 
                    id: Date.now().toString(), 
                    bankName: "", 
                    accountNumber: "", 
                    accountHolderName: "" 
                  })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Rekening
                </Button>
              </div>
              <Separator />
              
              {fields.map((field, index) => (
                <div key={field.id} className="space-y-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Rekening {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`bankAccounts.${index}.bankName`}
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
                      name={`bankAccounts.${index}.accountNumber`}
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
                    name={`bankAccounts.${index}.accountHolderName`}
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
              ))}
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
