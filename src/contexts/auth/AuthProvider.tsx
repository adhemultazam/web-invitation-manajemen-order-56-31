
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { SupabaseAuthContextType } from "./types";
import { ProfileType } from "@/types/supabase-types";
import { setupDatabaseTriggers } from "@/utils/supabaseMigration";
import { signIn, signOut, signUp, updatePassword, resetPassword } from "./authActions";
import { fetchProfile, updateProfile as updateProfileAction } from "./profileActions";
import { migrateData as migrateDataAction } from "./migrationActions";

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Setting up Supabase Auth provider");
    
    // Set up auth state listener FIRST to prevent missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Fetch profile using setTimeout to prevent Supabase auth lock issues
        if (currentSession?.user) {
          console.log("Auth state changed with user, fetching profile");
          setTimeout(() => {
            fetchProfile(currentSession.user.id).then(profileData => {
              setProfile(profileData);
            });
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Got existing session:", currentSession?.user?.id || "none");
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Fetch profile if we have a user
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(profileData => {
          setProfile(profileData);
        });
      }
      
      setIsLoading(false);
    });

    // Setup database triggers if needed
    setupDatabaseTriggers().catch(error => {
      console.error("Error setting up triggers:", error);
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const handleFetchProfile = async (userId: string) => {
    const profileData = await fetchProfile(userId);
    setProfile(profileData);
    return profileData;
  };

  const handleUpdateProfile = async (updates: Partial<ProfileType>) => {
    if (!user) throw new Error("No user logged in");
    await updateProfileAction(user.id, updates);
    // Refresh profile data
    const updatedProfile = { ...profile, ...updates } as ProfileType;
    setProfile(updatedProfile);
  };

  const handleMigrateData = async () => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    return await migrateDataAction(user.id);
  };

  const value: SupabaseAuthContextType = {
    user,
    session,
    profile,
    isLoading,
    signIn: async (email, password) => {
      const result = await signIn(email, password);
      if (!result.error && session?.user) {
        // Refresh profile after successful login
        await handleFetchProfile(session.user.id);
      }
      return result;
    },
    signUp,
    signOut: async () => {
      const result = await signOut();
      if (!result.error) {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
    },
    updateProfile: handleUpdateProfile,
    updatePassword,
    resetPassword,
    fetchProfile: handleFetchProfile,
    migrateData: handleMigrateData,
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
