
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorSettings } from "@/components/settings/VendorSettings";
import { PackageSettings } from "@/components/settings/PackageSettings";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { StatusSettings } from "@/components/settings/StatusSettings";
import { InvoiceSettings } from "@/components/settings/InvoiceSettings";

export default function Settings() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Atur konfigurasi sistem manajemen undangan digital
        </p>
      </div>

      <Tabs defaultValue="vendors" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="vendors">Vendor</TabsTrigger>
          <TabsTrigger value="packages">Paket</TabsTrigger>
          <TabsTrigger value="themes">Tema</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vendors" className="space-y-4">
          <VendorSettings />
        </TabsContent>
        
        <TabsContent value="packages" className="space-y-4">
          <PackageSettings />
        </TabsContent>
        
        <TabsContent value="themes" className="space-y-4">
          <ThemeSettings />
        </TabsContent>
        
        <TabsContent value="status" className="space-y-4">
          <StatusSettings />
        </TabsContent>
        
        <TabsContent value="invoice" className="space-y-4">
          <InvoiceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
