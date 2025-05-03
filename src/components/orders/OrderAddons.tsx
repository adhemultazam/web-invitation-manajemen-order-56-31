
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OrderAddonsProps {
  addons: string[];
  addonStyles: Record<string, { color: string }>;
}

const OrderAddons: React.FC<OrderAddonsProps> = ({ addons, addonStyles }) => {
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
        <Badge key={i} style={getAddonStyle(addon)} variant="secondary" className="text-xs">
          {addon}
        </Badge>
      ))}
    </div>
  );
};

export default OrderAddons;
