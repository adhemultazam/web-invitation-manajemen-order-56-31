
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";

interface OrderAddonsProps {
  addons: string[];
  addonStyles: Record<string, { color: string }>;
  compact?: boolean; // Added compact prop
}

const OrderAddons: React.FC<OrderAddonsProps> = ({ 
  addons, 
  addonStyles,
  compact = false // Default to false
}) => {
  // Store last used addons in localStorage
  useEffect(() => {
    try {
      if (addons && addons.length > 0) {
        localStorage.setItem('last_used_addons', JSON.stringify(addons));
      }
    } catch (e) {
      console.error("Error saving addons to localStorage:", e);
    }
  }, [addons]);

  if (!addons || addons.length === 0) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  const getAddonStyle = (addonName: string) => {
    const addonStyle = addonStyles[addonName];
    return {
      backgroundColor: addonStyle?.color || "#6366f1",
      color: '#fff'
    };
  };

  return (
    <div className="flex flex-wrap gap-1">
      {addons.map((addon, i) => (
        <Badge 
          key={i} 
          style={getAddonStyle(addon)} 
          variant="secondary" 
          className={`${compact ? "compact-badge" : "text-xs"}`}
        >
          {addon}
        </Badge>
      ))}
    </div>
  );
};

export default OrderAddons;
