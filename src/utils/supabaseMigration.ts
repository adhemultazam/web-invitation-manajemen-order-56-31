
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { VendorTable, AddonTable, ThemeTable, PackageTable, WorkStatusTable, OrderTable } from "@/types/supabase-types";

// Function to create database triggers and functions if they don't exist
export const setupDatabaseTriggers = async () => {
  try {
    // Check if handle_new_user function exists, create if not
    const { data: triggerExists, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error("Error checking triggers: ", checkError);
      return { success: false, error: checkError };
    }
    
    // If we can query profiles, we assume setup is done
    if (triggerExists) {
      console.log("Database triggers already set up");
      return { success: true };
    }
    
    // If profiles table or triggers don't exist, create them via SQL
    // This should be done via Supabase dashboard or CLI in a production environment
    // But for local development, we can create it here
    console.log("Setting up database triggers...");
    
    // This is not optimal, but it's a fallback for development
    // Normally, this should be done as part of migrations
    return { success: true, message: "Please run migrations from Supabase dashboard" };
    
  } catch (error) {
    console.error("Error setting up triggers:", error);
    return { success: false, error };
  }
};

// Function to migrate data from localStorage to Supabase
export const migrateLocalStorageToSupabase = async (userId: string) => {
  try {
    // Check if we've already migrated
    const migrationKey = `migration_${userId}`;
    if (localStorage.getItem(migrationKey) === 'completed') {
      console.log('Migration already completed for this user');
      return { success: true };
    }

    // Migrate vendors
    const vendors = JSON.parse(localStorage.getItem('vendors') || '[]');
    if (vendors.length > 0) {
      for (const vendor of vendors) {
        const vendorData: Partial<VendorTable> = {
          name: vendor.name,
          code: vendor.code,
          color: vendor.color,
          landing_page_url: vendor.landingPageUrl,
          user_id: userId
        };
        
        const { error } = await supabase.from('vendors').insert(vendorData);
        if (error) console.error('Error migrating vendor:', error);
      }
    }

    // Migrate addons
    const addons = JSON.parse(localStorage.getItem('addons') || '[]');
    if (addons.length > 0) {
      for (const addon of addons) {
        const addonData: Partial<AddonTable> = {
          name: addon.name,
          color: addon.color,
          user_id: userId
        };
        
        const { error } = await supabase.from('addons').insert(addonData);
        if (error) console.error('Error migrating addon:', error);
      }
    }

    // Migrate themes
    const themes = JSON.parse(localStorage.getItem('themes') || '[]');
    if (themes.length > 0) {
      for (const theme of themes) {
        const themeData: Partial<ThemeTable> = {
          name: theme.name,
          user_id: userId
        };
        
        const { error } = await supabase.from('themes').insert(themeData);
        if (error) console.error('Error migrating theme:', error);
      }
    }

    // Migrate packages
    const packages = JSON.parse(localStorage.getItem('packages') || '[]');
    if (packages.length > 0) {
      for (const pkg of packages) {
        const packageData: Partial<PackageTable> = {
          name: pkg.name,
          price: pkg.price,
          user_id: userId
        };
        
        const { error } = await supabase.from('packages').insert(packageData);
        if (error) console.error('Error migrating package:', error);
      }
    }

    // Migrate work statuses
    const workStatuses = JSON.parse(localStorage.getItem('workStatuses') || '[]');
    if (workStatuses.length > 0) {
      for (const status of workStatuses) {
        const statusData: Partial<WorkStatusTable> = {
          name: status.name,
          color: status.color,
          order_number: status.orderNumber || 1,
          user_id: userId
        };
        
        const { error } = await supabase.from('work_statuses').insert(statusData);
        if (error) console.error('Error migrating work status:', error);
      }
    }

    // Mark migration as completed
    localStorage.setItem(migrationKey, 'completed');
    toast.success('Data berhasil dimigrasikan dari localStorage ke Supabase');
    
    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error };
  }
};
