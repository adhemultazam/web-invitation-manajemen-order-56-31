
import { supabase } from "@/integrations/supabase/client";
import { migrateLocalStorageToSupabase } from "@/utils/supabaseMigration";

export const migrateData = async (userId: string) => {
  try {
    if (!userId) {
      console.error("Migration error: No user ID provided");
      return { success: false, error: "User not authenticated" };
    }
    
    console.log("Migrating data for userId:", userId);
    return await migrateLocalStorageToSupabase(userId);
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, error };
  }
};
