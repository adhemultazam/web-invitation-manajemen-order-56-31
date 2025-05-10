
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { migrateLocalStorageToSupabase, setupDatabaseTriggers } from "@/utils/supabaseMigration";
import { ProfileType } from "@/types/supabase-types";

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileType | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileType>) => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  fetchProfile: (userId: string) => Promise<ProfileType | null>;
  migrateData: () => Promise<{ success: boolean; error?: any }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch profile using setTimeout to prevent Supabase auth lock issues
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch profile if we have a user
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      
      setIsLoading(false);
    });

    // Setup database triggers if needed
    setupDatabaseTriggers().catch(error => {
      console.error("Error setting up triggers:", error);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string): Promise<ProfileType | null> => {
    try {
      // Fetch user profile from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const newProfile = {
            id: userId,
            name: user?.user_metadata?.name || '',
            email: user?.email || '',
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newProfile);

          if (insertError) {
            throw insertError;
          }

          setProfile(newProfile);
          return newProfile;
        }
        throw error;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      console.log('Supabase SignIn Data:', data);
      console.log('Supabase SignIn Error:', error);

      if (error) {
        return { error };
      }

      setSession(data.session);
      setUser(data.user);

      if (data.user) {
        fetchProfile(data.user.id);
      }

      toast.success("Login berhasil");
      return { error: null };
    } catch (error: any) {
      console.error('SignIn Exception:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: object = {}) => {
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

      toast.success("Registrasi berhasil", {
        description: "Silahkan cek email Anda untuk verifikasi, atau langsung login jika verifikasi email dinonaktifkan"
      });

      return { error: null };
    } catch (error: any) {
      console.error('SignUp Exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      toast.success("Logout berhasil");
    } catch (error) {
      console.error('SignOut Exception:', error);
      toast.error("Logout gagal");
    }
  };

  const updateProfile = async (updates: Partial<ProfileType>) => {
    try {
      if (!user) throw new Error("No user logged in");

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      const updatedProfile = { ...profile, ...updates } as ProfileType;
      setProfile(updatedProfile);
      
      return;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const migrateData = async () => {
    try {
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }
      
      return await migrateLocalStorageToSupabase(user.id);
    } catch (error) {
      console.error("Migration error:", error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updatePassword,
    resetPassword,
    fetchProfile,
    migrateData,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
