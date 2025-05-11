
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { migrateToSupabase } from "@/utils/supabaseUtils";

type MigrationProgress = {
  percentage: number;
  total: number;
  completed: number;
  failed: number;
};

type ProgressCallback = (progress: MigrationProgress) => void;

// Migrate data from localStorage to Supabase
export const migrateData = async (
  clearLocalStorage: boolean = false, 
  onProgress?: ProgressCallback
) => {
  try {
    const result = await migrateToSupabase(onProgress);
    
    if (result.success && clearLocalStorage) {
      clearLocalStorageExceptAuth();
    }
    
    return result;
  } catch (error) {
    console.error("Migration error:", error);
    return {
      success: false,
      error: {
        message: error.message || "Error during migration"
      }
    };
  }
};

// Helper function to clear localStorage except for authentication data
const clearLocalStorageExceptAuth = () => {
  const authTokenKey = 'sb-grhwzhhjeiytjgtcllew-auth-token';
  const authToken = localStorage.getItem(authTokenKey);
  
  // Clear all localStorage
  localStorage.clear();
  
  // Restore auth token
  if (authToken) {
    localStorage.setItem(authTokenKey, authToken);
  }
  
  toast.success("localStorage successfully cleared while preserving authentication data");
};
