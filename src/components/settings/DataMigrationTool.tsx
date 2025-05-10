
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Database, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DataMigrationTool() {
  const { user, migrateData } = useSupabaseAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);
  
  const handleMigration = async () => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }
    
    setIsMigrating(true);
    try {
      const result = await migrateData();
      if (result.success) {
        toast.success("Data berhasil dimigrasikan ke Supabase");
        setMigrationDone(true);
      } else {
        toast.error("Gagal migrasi data", {
          description: result.error?.message || "Terjadi kesalahan"
        });
      }
    } catch (error: any) {
      toast.error("Gagal migrasi data", {
        description: error.message
      });
    } finally {
      setIsMigrating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Migrasi Data
        </CardTitle>
        <CardDescription>
          Migrasi data dari localStorage ke Supabase Database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Perhatian</AlertTitle>
          <AlertDescription>
            Tool ini akan memigrasikan data dari localStorage ke database Supabase. 
            Pastikan Anda sudah login dan database telah disiapkan.
          </AlertDescription>
        </Alert>
        
        {migrationDone ? (
          <Alert variant="default" className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Sukses!</AlertTitle>
            <AlertDescription>
              Data telah berhasil dimigrasikan ke Supabase. Sekarang data Anda akan disimpan di database cloud.
            </AlertDescription>
          </Alert>
        ) : (
          <Button 
            onClick={handleMigration} 
            disabled={isMigrating || !user}
            className="w-full"
          >
            {isMigrating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Migrasi Data...
              </>
            ) : (
              "Migrasi Data ke Supabase"
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
