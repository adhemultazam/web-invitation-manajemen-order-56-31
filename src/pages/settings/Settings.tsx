
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { InvoiceSettings } from "@/components/settings/InvoiceSettings";
import { ThemeSettings } from "@/components/settings/ThemeSettings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  // Load active tab from localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("settingsActiveTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage when it changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem("settingsActiveTab", value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pengaturan</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola semua pengaturan untuk aplikasi manajemen pesanan Anda
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="theme">Tampilan</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="invoice" className="space-y-4">
          <InvoiceSettings />
        </TabsContent>
        <TabsContent value="theme" className="space-y-4">
          <ThemeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
