
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string | number;
  type?: "default" | "success" | "warning" | "danger";
  trend?: number;
}

export function StatCard({ title, value, icon, description, type = "default", trend }: StatCardProps) {
  // Get background color class based on card type
  const getBackgroundClass = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40";
      case "warning":
        return "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40";
      case "danger":
        return "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40";
      default:
        return "bg-gradient-to-br from-wedding-light to-white dark:from-wedding-primary/10 dark:to-wedding-primary/5";
    }
  };

  // Get icon color based on card type
  const getIconColorClass = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white dark:bg-green-500";
      case "warning":
        return "bg-amber-500 text-white dark:bg-amber-500";
      case "danger":
        return "bg-red-500 text-white dark:bg-red-500";
      default:
        return "bg-wedding-primary text-white dark:bg-wedding-primary";
    }
  };

  // Get text color class based on card type
  const getTextColorClass = () => {
    switch (type) {
      case "success":
        return "text-green-800 dark:text-green-300";
      case "warning":
        return "text-amber-800 dark:text-amber-300";
      case "danger":
        return "text-red-800 dark:text-red-300";
      default:
        return "text-wedding-primary dark:text-wedding-secondary";
    }
  };
  
  // Get trend color and icon
  const getTrendElement = () => {
    if (trend === undefined) return null;
    
    if (trend > 0) {
      return (
        <div className="flex items-center text-green-600 text-xs font-medium">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
          {trend}%
        </div>
      );
    } else {
      return (
        <div className="flex items-center text-red-600 text-xs font-medium">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
          {Math.abs(trend)}%
        </div>
      );
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
    <Card className={`overflow-hidden border shadow-card ${getBackgroundClass()}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className={`rounded-full w-8 h-8 flex items-center justify-center ${getIconColorClass()}`}>
            {icon}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className={`text-xl lg:text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap ${getTextColorClass()}`}>
              {formatValue()}
            </div>
            {description && (
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {formatDescription()}
              </p>
            )}
          </div>
          {getTrendElement()}
        </div>
      </CardContent>
    </Card>
  );
}
