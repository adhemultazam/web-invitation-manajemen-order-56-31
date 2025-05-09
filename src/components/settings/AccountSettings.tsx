
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupabaseProfileSettings } from "./SupabaseProfileSettings";
import { SupabasePasswordSettings } from "./SupabasePasswordSettings";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";

export function AccountSettings() {
  const { user } = useSupabaseAuth();
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Pengaturan Akun</h3>
        <p className="text-sm text-muted-foreground">
          Kelola informasi akun dan preferensi keamanan Anda
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4 mt-4">
          <SupabaseProfileSettings />
        </TabsContent>
        <TabsContent value="password" className="space-y-4 mt-4">
          <SupabasePasswordSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
