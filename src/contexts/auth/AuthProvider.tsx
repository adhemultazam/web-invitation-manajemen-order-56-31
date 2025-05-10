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
  const [rememberSession, setRememberSession] = useState<boolean>(() => {
    return localStorage.getItem('rememberSession') === 'true';
  });

  useEffect(() => {
    const storage = rememberSession ? localStorage : sessionStorage;
    supabase.auth.setSession({
      access_token: storage.getItem('sb-access-token') || '',
      refresh_token: storage.getItem('sb-refresh-token') || '',
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession) {
        if (rememberSession) {
          localStorage.setItem('sb-access-token', currentSession.access_token);
          localStorage.setItem('sb-refresh-token', currentSession.refresh_token);
        } else {
          sessionStorage.setItem('sb-access-token', currentSession.access_token);
          sessionStorage.setItem('sb-refresh-token', currentSession.refresh_token);
        }
      }

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
  }, [rememberSession]);

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

  const handleSignIn = async (email: string, password: string, remember: boolean) => {
    setRememberSession(remember);
    localStorage.setItem('rememberSession', remember ? 'true' : 'false');
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
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
        sessionStorage.removeItem('sb-access-token');
        sessionStorage.removeItem('sb-refresh-token');
      }
    },
    updateProfile: handleUpdateProfile,
    updatePassword,
    resetPassword,
    fetchProfile: handleFetchProfile,
    migrateData: handleMigrateData,
    rememberSession,
    setRememberSession,
    setSession, // Tambahkan setter di sini
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
