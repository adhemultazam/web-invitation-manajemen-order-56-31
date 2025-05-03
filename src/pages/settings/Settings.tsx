
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { InvoiceSettings } from "@/components/settings/InvoiceSettings";
import { PackageSettings } from "@/components/settings/PackageSettings";
import { StatusSettings } from "@/components/settings/StatusSettings";
import { AccountSettings } from "@/components/settings/AccountSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <div>
          <Button variant="outline">Batal</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="packages">Paket</TabsTrigger>
          <TabsTrigger value="statuses">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="space-y-4">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="invoice" className="space-y-4">
          <InvoiceSettings />
        </TabsContent>
        <TabsContent value="packages" className="space-y-4">
          <PackageSettings />
        </TabsContent>
        <TabsContent value="statuses" className="space-y-4">
          <StatusSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
