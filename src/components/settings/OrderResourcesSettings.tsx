
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PackageSettings } from "./PackageSettings";
import { WorkStatusSettings } from "./WorkStatusSettings";
import { ThemeSettings } from "./ThemeSettings";
import { AddonSettings } from "./AddonSettings";
import { VendorSettings } from "./VendorSettings";

export function OrderResourcesSettings() {
  const [activeResourceTab, setActiveResourceTab] = useState<string>("packages");

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-0">
        <Tabs value={activeResourceTab} onValueChange={setActiveResourceTab} className="w-full">
          <div className="border-b bg-muted/20">
            <TabsList className="w-full h-12 bg-transparent justify-start px-4 gap-2">
              <TabsTrigger 
                value="packages" 
                className="px-3 py-1.5 text-sm font-medium data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Paket
              </TabsTrigger>
              <TabsTrigger 
                value="workStatus" 
                className="px-3 py-1.5 text-sm font-medium data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Status
              </TabsTrigger>
              <TabsTrigger 
                value="themes" 
                className="px-3 py-1.5 text-sm font-medium data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Tema
              </TabsTrigger>
              <TabsTrigger 
                value="addons" 
                className="px-3 py-1.5 text-sm font-medium data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Addons
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="px-3 py-1.5 text-sm font-medium data-[state=active]:shadow-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Vendor
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4">
            <TabsContent value="packages" className="mt-0">
              <PackageSettings />
            </TabsContent>
            
            <TabsContent value="workStatus" className="mt-0">
              <WorkStatusSettings />
            </TabsContent>
            
            <TabsContent value="themes" className="mt-0">
              <ThemeSettings />
            </TabsContent>
            
            <TabsContent value="addons" className="mt-0">
              <AddonSettings />
            </TabsContent>
            
            <TabsContent value="vendors" className="mt-0">
              <VendorSettings />
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
