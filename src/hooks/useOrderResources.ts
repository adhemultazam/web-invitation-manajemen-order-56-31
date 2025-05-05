
import { useState, useEffect } from "react";
import { Vendor, WorkStatus, Theme, Package, Addon } from "@/types/types";

export const useOrderResources = () => {
  // State for available data
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [workStatuses, setWorkStatuses] = useState<WorkStatus[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  
  // State for UI updates
  const [vendorColors, setVendorColors] = useState<Record<string, string>>({});
  const [addonStyles, setAddonStyles] = useState<Record<string, { color: string }>>({});

  // Load vendors, work statuses, themes, and packages from localStorage
  useEffect(() => {
    const loadVendors = () => {
      try {
        const storedVendors = localStorage.getItem("vendors");
        if (storedVendors) {
          const parsedVendors = JSON.parse(storedVendors);
          setVendors(parsedVendors);
          
          // Create a map of vendor IDs to colors
          const colors: Record<string, string> = {};
          parsedVendors.forEach((vendor: Vendor) => {
            colors[vendor.id] = vendor.color || '#6366f1';
          });
          setVendorColors(colors);
        }
      } catch (error) {
        console.error("Error loading vendors:", error);
      }
    };
    
    const loadWorkStatuses = () => {
      try {
        const storedStatuses = localStorage.getItem("workStatuses");
        if (storedStatuses) {
          const parsedStatuses = JSON.parse(storedStatuses);
          setWorkStatuses(parsedStatuses);
        }
      } catch (error) {
        console.error("Error loading work statuses:", error);
      }
    };
    
    const loadThemes = () => {
      try {
        const storedThemes = localStorage.getItem("themes");
        if (storedThemes) {
          const parsedThemes = JSON.parse(storedThemes);
          setThemes(parsedThemes);
        }
      } catch (error) {
        console.error("Error loading themes:", error);
      }
    };
    
    const loadPackages = () => {
      try {
        const storedPackages = localStorage.getItem("packages");
        if (storedPackages) {
          const parsedPackages = JSON.parse(storedPackages);
          setPackages(parsedPackages);
        }
      } catch (error) {
        console.error("Error loading packages:", error);
      }
    };
    
    const loadAddons = () => {
      try {
        const storedAddons = localStorage.getItem("addons");
        if (storedAddons) {
          const parsedAddons = JSON.parse(storedAddons);
          setAddons(parsedAddons);
          
          // Create a map of addon names to styles
          const styles: Record<string, { color: string }> = {};
          parsedAddons.forEach((addon: Addon) => {
            styles[addon.name] = { color: addon.color || '#6366f1' };
          });
          setAddonStyles(styles);
        }
      } catch (error) {
        console.error("Error loading addons:", error);
      }
    };
    
    loadVendors();
    loadWorkStatuses();
    loadThemes();
    loadPackages();
    loadAddons();
  }, []);

  return {
    vendors,
    workStatuses,
    themes,
    packages,
    addons,
    vendorColors,
    addonStyles
  };
};
