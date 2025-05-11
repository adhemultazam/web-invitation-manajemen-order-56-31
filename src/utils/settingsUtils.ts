
import { supabase } from "@/integrations/supabase/client";
import { UserSetting } from "@/types/types";
import { toast } from "sonner";

// Get a user setting from Supabase
export const getSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.log("User not authenticated, using default value for", key);
      return defaultValue;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('value')
      .eq('user_id', userData.user.id)
      .eq('key', key)
      .maybeSingle();

    if (error) throw error;
    
    return data ? data.value : defaultValue;
  } catch (err) {
    console.error(`Error getting setting ${key}:`, err);
    return defaultValue;
  }
};

// Save a user setting to Supabase using upsert
export const saveSetting = async <T>(key: string, value: T): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.error("Cannot save setting: user not authenticated");
      return false;
    }

    const settingData = {
      user_id: userData.user.id,
      key,
      value,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('user_settings')
      .upsert(settingData, { 
        onConflict: 'user_id,key',
        ignoreDuplicates: false
      });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error saving setting ${key}:`, err);
    toast.error(`Failed to save setting ${key}`);
    return false;
  }
};

// Delete a user setting from Supabase
export const deleteSetting = async (key: string): Promise<boolean> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.error("Cannot delete setting: user not authenticated");
      return false;
    }

    const { error } = await supabase
      .from('user_settings')
      .delete()
      .match({ user_id: userData.user.id, key });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting setting ${key}:`, err);
    return false;
  }
};

// Initialize settings with default values if they don't exist
export const initSettings = async (defaults: Record<string, any>): Promise<void> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      console.log("User not authenticated, skipping settings initialization");
      return;
    }

    // Get all existing settings for the user
    const { data: existingSettings, error } = await supabase
      .from('user_settings')
      .select('key')
      .eq('user_id', userData.user.id);

    if (error) throw error;
    
    // Create a set of existing keys for quick lookup
    const existingKeys = new Set(existingSettings?.map(setting => setting.key) || []);

    // For each default setting that doesn't exist, create it
    for (const [key, value] of Object.entries(defaults)) {
      if (!existingKeys.has(key)) {
        await saveSetting(key, value);
      }
    }
  } catch (err) {
    console.error("Error initializing settings:", err);
  }
};
