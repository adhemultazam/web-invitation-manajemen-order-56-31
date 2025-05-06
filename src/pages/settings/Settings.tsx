
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
    <div className="px-1 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold mb-2">Pengaturan</h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
        Konfigurasikan pengaturan aplikasi sesuai kebutuhan Anda
      </p>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className="mb-4 w-auto h-9 sm:h-10 px-1">
            <TabsTrigger value="resources" className="text-sm px-3">Data Master</TabsTrigger>
            <TabsTrigger value="account" className="text-sm px-3">Akun</TabsTrigger>
            <TabsTrigger value="invoice" className="text-sm px-3">Invoice</TabsTrigger>
          </TabsList>
        </div>
        
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
