
import { useState, useEffect } from "react";
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
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { AddonSettings } from "@/components/settings/AddonSettings";
import { VendorSettings } from "@/components/settings/VendorSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  // Load the selected tab from localStorage when the component mounts
  useEffect(() => {
    const savedTab = localStorage.getItem('settingsActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save the selected tab to localStorage when it changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem('settingsActiveTab', value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
        <div>
          <Button variant="outline">Batal</Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid grid-cols-7 md:w-[900px]">
          <TabsTrigger value="account">Akun</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="packages">Paket</TabsTrigger>
          <TabsTrigger value="statuses">Status</TabsTrigger>
          <TabsTrigger value="themes">Tema Undangan</TabsTrigger>
          <TabsTrigger value="addons">Addons</TabsTrigger>
          <TabsTrigger value="vendors">Vendor</TabsTrigger>
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
        <TabsContent value="themes" className="space-y-4">
          <ThemeSettings />
        </TabsContent>
        <TabsContent value="addons" className="space-y-4">
          <AddonSettings />
        </TabsContent>
        <TabsContent value="vendors" className="space-y-4">
          <VendorSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
