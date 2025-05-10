
import { supabase } from "@/integrations/supabase/client";
import { migrateLocalStorageToSupabase } from "@/utils/supabaseMigration";

export const migrateData = async (clearLocalStorage: boolean = false) => {
  try {
    // Get current user id
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user?.id) {
      console.error("Migration error: No user ID available");
      return { success: false, error: "User not authenticated" };
    }
    
    console.log("Migrating data for userId:", user.id);
    const result = await migrateLocalStorageToSupabase(user.id, clearLocalStorage);
    return result;
  } catch (error) {
    console.error("Migration error:", error);
    return { success: false, error };
  }
};
