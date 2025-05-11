import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { fetchProfile } from "./profileActions";

export const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
  try {
    console.log("Signing in user with email:", email, "with rememberMe:", rememberMe);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email, 
      password,
      options: {
        // Fix: remove persistSession from options
      }
    });

    console.log('Supabase SignIn Data:', data);
    console.log('Supabase SignIn Error:', error);

    if (error) {
      console.error('SignIn Error:', error);
      return { error };
    }

    // Update last_login in profiles table
    if (data.user) {
      try {
        await supabase
          .from('profiles')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      } catch (profileError) {
        console.error("Failed to update last login:", profileError);
      }
    }

    toast.success("Login berhasil");
    return { error: null };
  } catch (error: any) {
    console.error('SignIn Exception:', error);
    return { error };
  }
};

export const signUp = async (email: string, password: string, userData: object = {}) => {
  try {
    console.log("Signing up user with email:", email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });

    console.log('Supabase SignUp Data:', data);
    console.log('Supabase SignUp Error:', error);

    if (error) {
      console.error('SignUp Error:', error);
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

export const signOut = async () => {
  try {
    console.log("Signing out user");
    await supabase.auth.signOut();
    toast.success("Logout berhasil");
    return { error: null };
  } catch (error: any) {
    console.error('SignOut Exception:', error);
    toast.error("Logout gagal");
    return { error };
  }
};

export const updatePassword = async (password: string) => {
  try {
    console.log("Updating password");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error('Update Password Error:', error);
    }
    return { error };
  } catch (error: any) {
    console.error('Update Password Exception:', error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    console.log("Resetting password for email:", email);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) {
      console.error('Reset Password Error:', error);
    }
    return { error };
  } catch (error: any) {
    console.error('Reset Password Exception:', error);
    return { error };
  }
};
