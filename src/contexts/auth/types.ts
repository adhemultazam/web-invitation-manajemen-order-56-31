
import { User, Session } from "@supabase/supabase-js";
import { ProfileType } from "@/types/supabase-types";

export interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  profile: ProfileType | null;
  isLoading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ error: any }>;
  signUp: (email: string, password: string, userData?: object) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<ProfileType>) => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  fetchProfile: (userId: string) => Promise<ProfileType | null>;
  migrateData: (clearLocalStorage?: boolean) => Promise<{ success: boolean; error?: any; message?: string }>;
  rememberSession: boolean;
  // Remove setRememberSession and setSession
}
