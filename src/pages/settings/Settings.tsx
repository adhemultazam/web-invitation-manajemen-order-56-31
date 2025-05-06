
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { InvoiceSettings } from "@/components/settings/InvoiceSettings";
import { OrderResourcesSettings } from "@/components/settings/OrderResourcesSettings";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Settings() {
  // Use localStorage to persist the active tab
  const [activeTab, setActiveTab] = useLocalStorage<string>("settingsActiveTab", "resources");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Pengaturan</h1>
      <p className="text-muted-foreground mb-6">
        Konfigurasikan pengaturan aplikasi sesuai kebutuhan Anda
      </p>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="resources">Data Master</TabsTrigger>
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <OrderResourcesSettings />
        </TabsContent>
        
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="invoice">
          <InvoiceSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
