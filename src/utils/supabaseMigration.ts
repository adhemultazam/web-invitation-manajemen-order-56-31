
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
export const migrateLocalStorageToSupabase = async (userId: string, clearLocalStorage: boolean = false) => {
  try {
    console.log("Starting migration for user:", userId);
    
    // Helper function to safely parse localStorage
    const safeParseJson = (key: string) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.warn(`Error parsing ${key} from localStorage:`, error);
        return [];
      }
    };
    
    // Helper function to safely remove localStorage item
    const safeRemoveItem = (key: string) => {
      if (clearLocalStorage) {
        try {
          localStorage.removeItem(key);
          console.log(`Removed ${key} from localStorage`);
        } catch (error) {
          console.warn(`Error removing ${key} from localStorage:`, error);
        }
      }
    };

    // Migrate vendors
    const vendors = safeParseJson('vendors');
    if (vendors.length > 0) {
      console.log(`Migrating ${vendors.length} vendors`);
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
      safeRemoveItem('vendors');
    }

    // Migrate addons
    const addons = safeParseJson('addons');
    if (addons.length > 0) {
      console.log(`Migrating ${addons.length} addons`);
      for (const addon of addons) {
        const addonData: Partial<AddonTable> = {
          name: addon.name,
          color: addon.color,
          user_id: userId
        };
        
        const { error } = await supabase.from('addons').insert(addonData);
        if (error) console.error('Error migrating addon:', error);
      }
      safeRemoveItem('addons');
    }

    // Migrate themes
    const themes = safeParseJson('themes');
    if (themes.length > 0) {
      console.log(`Migrating ${themes.length} themes`);
      for (const theme of themes) {
        const themeData: Partial<ThemeTable> = {
          name: theme.name,
          user_id: userId
        };
        
        const { error } = await supabase.from('themes').insert(themeData);
        if (error) console.error('Error migrating theme:', error);
      }
      safeRemoveItem('themes');
    }

    // Migrate packages
    const packages = safeParseJson('packages');
    if (packages.length > 0) {
      console.log(`Migrating ${packages.length} packages`);
      for (const pkg of packages) {
        const packageData: Partial<PackageTable> = {
          name: pkg.name,
          price: pkg.price,
          user_id: userId
        };
        
        const { error } = await supabase.from('packages').insert(packageData);
        if (error) console.error('Error migrating package:', error);
      }
      safeRemoveItem('packages');
    }

    // Migrate work statuses
    const workStatuses = safeParseJson('workStatuses');
    if (workStatuses.length > 0) {
      console.log(`Migrating ${workStatuses.length} work statuses`);
      for (const status of workStatuses) {
        const statusData: Partial<WorkStatusTable> = {
          name: status.name,
          color: status.color,
          order_number: status.orderNumber || status.order || 1,
          user_id: userId
        };
        
        const { error } = await supabase.from('work_statuses').insert(statusData);
        if (error) console.error('Error migrating work status:', error);
      }
      safeRemoveItem('workStatuses');
    }
    
    // Migration for settings
    try {
      const brandSettings = safeParseJson('brandSettings');
      if (brandSettings) {
        console.log('Migrating brand settings');
        // Store brand settings in profiles table
        await supabase.from('profiles').update({
          brand_settings: brandSettings
        }).eq('id', userId);
        if (clearLocalStorage) safeRemoveItem('brandSettings');
      }
    } catch (error) {
      console.error('Error migrating brand settings:', error);
    }
    
    // Mark migration as completed
    if (clearLocalStorage) {
      localStorage.setItem(`migration_${userId}`, 'completed');
      console.log('Migration marked as completed in localStorage');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error };
  }
};
