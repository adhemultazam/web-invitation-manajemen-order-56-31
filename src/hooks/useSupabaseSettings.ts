
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * A hook for managing settings in Supabase instead of localStorage
 * @param key The key to identify this setting in the database
 * @param defaultValue Default value if no setting is found
 * @returns [value, setValue, isLoading, error]
 */
export function useSupabaseSettings<T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => Promise<void>, boolean, string | null] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          console.log("User not authenticated, using default value");
          setValue(defaultValue);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('user_settings')
          .select('value')
          .eq('user_id', userData.user.id)
          .eq('key', key)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setValue(data.value as T);
        } else {
          // If no settings found, set the default and save it to Supabase
          setValue(defaultValue);
          await saveSetting(defaultValue);
        }
      } catch (err) {
        console.error(`Error loading settings for key ${key}:`, err);
        setError(err.message || "Error loading settings");
        setValue(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [key]);

  const saveSetting = async (newValue: T) => {
    setError(null);
    
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user) {
        toast.error("You must be logged in to save settings");
        return;
      }

      setValue(newValue);
      
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            key,
            value: newValue,
            user_id: userData.user.id,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'user_id,key',
            ignoreDuplicates: false
          }
        );

      if (error) throw error;
    } catch (err) {
      console.error(`Error saving settings for key ${key}:`, err);
      setError(err.message || "Error saving settings");
      toast.error("Failed to save settings", {
        description: err.message || "Please try again"
      });
    }
  };

  return [value, saveSetting, isLoading, error];
}
