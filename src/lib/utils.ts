
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";
import { addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateVendorColor(): string {
  const colors = [
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#ef4444", // Red
    "#f97316", // Orange
    "#f59e0b", // Amber
    "#84cc16", // Lime
    "#10b981", // Emerald
    "#06b6d4", // Cyan
    "#3b82f6", // Blue
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}

// Format currency helper
export function formatCurrency(amount: number | string): string {
  // Convert string to number if needed
  if (typeof amount === 'string') {
    amount = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
  }
  
  // Handle NaN or invalid values
  if (isNaN(amount)) {
    amount = 0;
  }
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Migration function to convert commission to landingPageUrl in vendor data
export function migrateVendorData() {
  try {
    const savedVendors = localStorage.getItem("vendors");
    if (savedVendors) {
      const vendors = JSON.parse(savedVendors);
      
      // Check if any vendor has commission field
      const needsMigration = vendors.some((v: any) => 'commission' in v);
      
      if (needsMigration) {
        // Convert commission to landingPageUrl
        const migratedVendors = vendors.map((v: any) => {
          const { commission, ...rest } = v;
          return {
            ...rest,
            landingPageUrl: v.landingPageUrl || "", // Keep existing URL if present, or default to empty
          };
        });
        
        // Save migrated vendors
        localStorage.setItem("vendors", JSON.stringify(migratedVendors));
        console.log("Vendor data migrated: commission -> landingPageUrl");
      }
    }
  } catch (error) {
    console.error("Error migrating vendor data:", error);
  }
}
