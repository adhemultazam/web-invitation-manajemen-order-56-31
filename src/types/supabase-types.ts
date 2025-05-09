// Custom type definitions for Supabase data
// These complement the auto-generated types from src/integrations/supabase/types.ts

export interface ProfileType {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  updated_at?: string;
  // Adding properties needed for our application
  name?: string;
  email?: string;
  profile_image?: string;
}

export interface OrderTable {
  id: string;
  client_name: string;
  customer_name?: string;
  client_phone?: string;
  client_email?: string;
  client_url?: string;
  event_name?: string;
  bride_and_groom?: string;
  event_date: string;
  order_date: string;
  package: string;
  theme: string;
  work_status: string;
  vendor: string;
  addons: string[];
  bonuses?: string[];
  payment_amount: number;
  payment_status: "Lunas" | "Pending";
  countdown_days?: number;
  post_permission?: boolean;
  notes?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface VendorTable {
  id: string;
  name: string;
  code: string;
  color: string;
  landing_page_url?: string;
  user_id: string;
}

export interface ThemeTable {
  id: string;
  name: string;
  thumbnail?: string;
  category?: string;
  user_id: string;
}

export interface AddonTable {
  id: string;
  name: string;
  color: string;
  user_id: string;
}

export interface PackageTable {
  id: string;
  name: string;
  price: number;
  themes?: string[];
  user_id: string;
}

export interface WorkStatusTable {
  id: string;
  name: string;
  color: string;
  order_number: number;
  user_id: string;
}
