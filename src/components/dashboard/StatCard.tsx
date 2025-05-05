
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;  // Allow both string and number
  icon: React.ReactNode;
  description?: string | number;  // Allow both string and number for description too
  type?: "default" | "success" | "warning" | "danger";
}

export function StatCard({ title, value, icon, description, type = "default" }: StatCardProps) {
  // Get background color class based on card type
  const getBackgroundClass = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800";
      case "warning":
        return "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800";
      case "danger":
        return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border border-red-200 dark:border-red-800";
      default:
        return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800";
    }
  };

  // Get icon color based on card type
  const getIconColorClass = () => {
    switch (type) {
      case "success":
        return "bg-green-500 dark:bg-green-400";
      case "warning":
        return "bg-amber-500 dark:bg-amber-400";
      case "danger":
        return "bg-red-500 dark:bg-red-400";
      default:
        return "bg-blue-500 dark:bg-blue-400";
    }
  };

  // Get text color class based on card type
  const getTextColorClass = () => {
    switch (type) {
      case "success":
        return "text-green-800 dark:text-green-200";
      case "warning":
        return "text-amber-800 dark:text-amber-200";
      case "danger":
        return "text-red-800 dark:text-red-200";
      default:
        return "text-blue-800 dark:text-blue-200";
    }
  };

  // Format the value if it's a large number to prevent overflow
  const formatValue = () => {
    // If it's already a string (pre-formatted), return as is
    if (typeof value === 'string') {
      return value;
    }
    
    // For numeric values, apply formatting
    if (typeof value === 'number') {
      // Format to Indonesian currency if the value is over 1000
      if (value >= 1000) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      } else {
        return value.toString();
      }
    }
    
    // Fallback for unexpected types
    return String(value);
  };

  // Format description if it's a number (for currency values)
  const formatDescription = () => {
    if (typeof description === 'number') {
      // Format numbers as currency
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(description);
    }
    return description;
  };

  return (
    <Card className={`overflow-hidden shadow-sm ${getBackgroundClass()}`}>
      <CardContent className="px-3 py-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xs font-medium">{title}</h3>
          <div className={`rounded-full w-6 h-6 flex items-center justify-center ${getIconColorClass()}`}>
            {icon}
          </div>
        </div>
        <div className={`text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap ${getTextColorClass()}`}>
          {formatValue()}
        </div>
        {description && (
          <p className="text-xs mt-1 opacity-90">
            {formatDescription()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
