
import React, { createContext, useState, useContext, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ProfileType } from "@/types/supabase-types";
import { setupDatabaseTriggers, migrateLocalStorageToSupabase } from "@/utils/supabaseMigration";

interface SupabaseAuthContextType {
  session: Session | null;
  user: User | null;
  profile: ProfileType | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, userData?: { name: string }) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<ProfileType>) => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: any | null }>;
  migrateData: () => Promise<{ success: boolean, error?: any }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => {},
  updatePassword: async () => ({ error: null }),
  migrateData: async () => ({ success: false }),
});

export const useSupabaseAuth = () => useContext(SupabaseAuthContext);

export const SupabaseAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (data) {
        setProfile(data as ProfileType);
        return data as ProfileType;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // First, set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Using setTimeout to prevent potential Supabase client deadlock
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );
    
    // Then check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Set up database triggers if needed
        await setupDatabaseTriggers();
        
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const profileData = await fetchProfile(currentSession.user.id);
          
          // If we have a user and profile, attempt to migrate data
          if (profileData) {
            setTimeout(() => {
              migrateLocalStorageToSupabase(currentSession.user.id);
            }, 1000);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeAuth();
    
    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        return { error };
      }
      
      toast.success("Login berhasil");
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData?: { name: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: userData
        }
      });
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout berhasil");
      setProfile(null);
    } catch (error: any) {
      toast.error("Logout gagal", {
        description: error.message
      });
    }
  };

  // Update user profile
  const updateProfile = async (profileData: Partial<ProfileType>) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state with new profile data
      setProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      toast.success("Profil berhasil diperbarui");
    } catch (error: any) {
      toast.error("Gagal memperbarui profil", {
        description: error.message
      });
    }
  };

  // Update password
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      });
      
      if (error) {
        toast.error("Gagal memperbarui password", {
          description: error.message
        });
        return { error };
      }
      
      toast.success("Password berhasil diperbarui");
      return { error: null };
    } catch (error: any) {
      toast.error("Gagal memperbarui password", {
        description: error.message
      });
      return { error };
    }
  };

  // Function to migrate data from localStorage to Supabase
  const migrateData = async () => {
    if (!user) {
      return { success: false, error: "User not logged in" };
    }
    return await migrateLocalStorageToSupabase(user.id);
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    migrateData,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
