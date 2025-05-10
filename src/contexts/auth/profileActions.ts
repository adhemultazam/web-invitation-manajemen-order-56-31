
import { supabase } from "@/integrations/supabase/client";
import { ProfileType } from "@/types/supabase-types";

export const fetchProfile = async (userId: string): Promise<ProfileType | null> => {
  try {
    console.log("Fetching profile for userId:", userId);
    // Fetch user profile from profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log("Profile doesn't exist, will create it");
        // Profile doesn't exist, create it
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
          console.error("No user found when trying to create profile");
          return null;
        }

        const newProfile = {
          id: userId,
          name: user?.user_metadata?.name || '',
          email: user?.email || '',
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }

        console.log("Created new profile:", newProfile);
        return newProfile;
      }
      console.error('Error fetching profile:', error);
      throw error;
    }

    console.log("Fetched profile:", data);
    return data;
  } catch (error) {
    console.error('Error in fetchProfile:', error);
    return null;
  }
};

export const updateProfile = async (userId: string, updates: Partial<ProfileType>): Promise<void> => {
  try {
    if (!userId) throw new Error("No user ID provided for profile update");

    console.log("Updating profile for userId:", userId, "with data:", updates);
    
    // Update profile in database
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    return;
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};
