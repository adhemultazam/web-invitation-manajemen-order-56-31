
import { createClient } from '@supabase/supabase-js';

// Supabase project URL and anon key
const supabaseUrl = 'https://grhwzhhjeiytjgtcllew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyaHd6aGhqZWl5dGpndGNsbGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3OTQxMDgsImV4cCI6MjA2MjM3MDEwOH0.Ipq8TMdpUyBaoTY41G40Ig5K3S2Ss8puJ0Pz6XMAmys';

// Create Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  }
});

// Helper methods for debugging
export const checkSession = async () => {
  const { data } = await supabase.auth.getSession();
  console.log("Current session:", data.session);
  return data.session;
};

export const checkUser = async () => {
  const { data } = await supabase.auth.getUser();
  console.log("Current user:", data.user);
  return data.user;
};
