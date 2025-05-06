
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageSettings } from "./PackageSettings";
import { WorkStatusSettings } from "./WorkStatusSettings";
import { ThemeSettings } from "./ThemeSettings";
import { AddonSettings } from "./AddonSettings";
import { VendorSettings } from "./VendorSettings";

export function OrderResourcesSettings() {
  const [activeResourceTab, setActiveResourceTab] = useState<string>("packages");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Data Master Pesanan</CardTitle>
        <CardDescription>
          Kelola data master untuk pesanan seperti paket, status pengerjaan, tema, addons, dan vendor
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeResourceTab} onValueChange={setActiveResourceTab} className="w-full">
          <TabsList className="mb-4 grid grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="packages">Paket</TabsTrigger>
            <TabsTrigger value="workStatus">Status Pengerjaan</TabsTrigger>
            <TabsTrigger value="themes">Tema</TabsTrigger>
            <TabsTrigger value="addons">Addons</TabsTrigger>
            <TabsTrigger value="vendors">Vendor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="packages">
            <PackageSettings />
          </TabsContent>
          
          <TabsContent value="workStatus">
            <WorkStatusSettings />
          </TabsContent>
          
          <TabsContent value="themes">
            <ThemeSettings />
          </TabsContent>
          
          <TabsContent value="addons">
            <AddonSettings />
          </TabsContent>
          
          <TabsContent value="vendors">
            <VendorSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
