
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Database, Loader2, CheckCircle, Trash2, ArrowUpFromLine } from "lucide-react";
import { toast } from "sonner";
import { useSupabaseAuth } from "@/contexts/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

export function DataMigrationTool() {
  const { user, migrateData } = useSupabaseAuth();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationDone, setMigrationDone] = useState(false);
  const [clearLocalStorage, setClearLocalStorage] = useState(true);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStats, setMigrationStats] = useState<{
    total: number;
    completed: number;
    failed: number;
  }>({
    total: 0,
    completed: 0,
    failed: 0
  });
  
  const handleMigration = async () => {
    if (!user) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }
    
    setIsMigrating(true);
    setMigrationProgress(0);
    try {
      const result = await migrateData(clearLocalStorage, (progress) => {
        setMigrationProgress(progress.percentage);
        setMigrationStats({
          total: progress.total,
          completed: progress.completed,
          failed: progress.failed
        });
      });
      
      console.log("Migration result:", result);
      
      if (result.success) {
        toast.success("Data berhasil dimigrasikan ke Supabase");
        setMigrationDone(true);
      } else {
        toast.error("Gagal migrasi data", {
          description: result.error?.message || "Terjadi kesalahan"
        });
      }
    } catch (error: any) {
      console.error("Migration error:", error);
      toast.error("Gagal migrasi data", {
        description: error.message
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleClearLocalStorage = () => {
    try {
      const preserveKeys = ['sb-grhwzhhjeiytjgtcllew-auth-token']; // Preserve Supabase auth token
      
      Object.keys(localStorage).forEach(key => {
        if (!preserveKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      toast.success("Local storage berhasil dibersihkan", {
        description: "Data lokal telah dihapus kecuali data autentikasi"
      });
    } catch (error: any) {
      console.error("Error clearing localStorage:", error);
      toast.error("Gagal membersihkan local storage", {
        description: error.message
      });
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="clearLocalStorage" 
            checked={clearLocalStorage}
            onCheckedChange={(checked) => setClearLocalStorage(!!checked)}
          />
          <Label htmlFor="clearLocalStorage">
            Hapus data dari localStorage setelah migrasi
          </Label>
        </div>
        
        {isMigrating && (
          <div className="space-y-2">
            <Progress value={migrationProgress} className="h-2" />
            <div className="text-sm text-gray-500 flex justify-between">
              <span>Progres: {migrationProgress.toFixed(0)}%</span>
              <span>
                {migrationStats.completed}/{migrationStats.total} item berhasil
                {migrationStats.failed > 0 && `, ${migrationStats.failed} gagal`}
              </span>
            </div>
          </div>
        )}
        
        {migrationDone ? (
          <>
            <Alert variant="default" className="border-green-500 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Sukses!</AlertTitle>
              <AlertDescription>
                Data telah berhasil dimigrasikan ke Supabase. Sekarang data Anda akan disimpan di database cloud.
              </AlertDescription>
            </Alert>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleClearLocalStorage}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Data Local Storage
            </Button>
          </>
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
              <>
                <ArrowUpFromLine className="mr-2 h-4 w-4" /> Migrasi Data ke Supabase
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
