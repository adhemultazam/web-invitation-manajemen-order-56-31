
import { useState, useEffect } from "react";
import { Vendor } from "@/types/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseVendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch vendors from Supabase
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

      if (error) throw error;

      setVendors(data || []);
    } catch (err) {
      console.error("Error loading vendors:", err);
      setError(err.message || "Failed to load vendors");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const addVendor = async (vendor: Omit<Vendor, "id">) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .insert(vendor)
        .select();

      if (error) throw error;

      setVendors(prev => [...prev, data[0]]);
      toast.success("Vendor added successfully");
      return data[0];
    } catch (err) {
      toast.error("Failed to add vendor", {
        description: err.message
      });
      return null;
    }
  };

  const updateVendor = async (id: string, updates: Partial<Vendor>) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      setVendors(prev => prev.map(vendor => 
        vendor.id === id ? { ...vendor, ...updates } : vendor
      ));
      
      toast.success("Vendor updated successfully");
      return data[0];
    } catch (err) {
      toast.error("Failed to update vendor", {
        description: err.message
      });
      return null;
    }
  };

  const deleteVendor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVendors(prev => prev.filter(vendor => vendor.id !== id));
      toast.success("Vendor deleted successfully");
      return true;
    } catch (err) {
      toast.error("Failed to delete vendor", {
        description: err.message
      });
      return false;
    }
  };

  return {
    vendors,
    isLoading,
    error,
    addVendor,
    updateVendor,
    deleteVendor,
    refreshVendors: fetchVendors
  };
};
