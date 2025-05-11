
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { migrateToSupabase } from "@/utils/supabaseUtils";

// Setup database triggers and functions
export async function setupDatabaseTriggers() {
  try {
    console.log("Setting up database triggers...");
    
    // Check if users is authenticated
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      console.log("User not authenticated, skipping database setup");
      return false;
    }

    // Actually this setup is now done through migrations
    // that are run when the user first connects to Supabase
    
    return true;
  } catch (error) {
    console.error("Error setting up database triggers:", error);
    return false;
  }
}

// Migrate all localStorage data to Supabase
export async function migrateAllDataToSupabase(clearLocal = false) {
  try {
    const result = await migrateToSupabase();
    
    if (result.success && clearLocal) {
      // Clear localStorage but preserve auth token
      const authToken = localStorage.getItem('sb-grhwzhhjeiytjgtcllew-auth-token');
      localStorage.clear();
      if (authToken) {
        localStorage.setItem('sb-grhwzhhjeiytjgtcllew-auth-token', authToken);
      }
    }
    
    return result;
  } catch (error) {
    console.error("Migration failed:", error);
    toast.error("Failed to migrate data", { 
      description: error.message || "Unknown error occurred" 
    });
    return { success: false, error };
  }
}
