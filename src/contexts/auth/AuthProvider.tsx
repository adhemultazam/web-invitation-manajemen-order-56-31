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
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        setTimeout(() => {
          fetchProfile(currentSession.user.id).then(setProfile);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(setProfile);
      }
      setIsLoading(false);
    });

    setupDatabaseTriggers().catch(console.error);

    return () => {
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
    const updatedProfile = { ...profile, ...updates } as ProfileType;
    setProfile(updatedProfile);
  };

  const handleMigrateData = async (clearLocalStorage: boolean = false) => {
    if (!user) return { success: false, error: "User not authenticated" };
    return await migrateDataAction(clearLocalStorage);
  };

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (!result.error && session?.user) {
      await handleFetchProfile(session.user.id);
    }
    return result;
  };

  const value: SupabaseAuthContextType = {
    user,
    session,
    profile,
    isLoading,
    signIn: handleSignIn,
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
    rememberSession: true, // Default true karena Supabase yang atur
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}
