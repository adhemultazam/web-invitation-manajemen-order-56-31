
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string | number;
  type?: "default" | "success" | "warning" | "danger";
  className?: string;
}

export function StatCard({ title, value, icon, description, type = "default", className }: StatCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Animate the value when component is mounted
  useEffect(() => {
    // Handle numeric values for count-up animation
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      let duration = 1500;
      
      // Faster animation for small numbers
      if (end < 10) duration = 800;
      // Slower animation for large numbers
      else if (end > 1000) duration = 2000;
      
      // Determine step increment
      const increment = Math.ceil(end / (duration / 50));
      
      // Only animate if we haven't done it already and the end value is > 0
      if (!isLoaded && end > 0) {
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            clearInterval(timer);
            setAnimatedValue(end);
            setIsLoaded(true);
          } else {
            setAnimatedValue(start);
          }
        }, 50);
        
        return () => {
          clearInterval(timer);
        };
      } else {
        // Set the value directly if it's 0 or we've already loaded
        setAnimatedValue(end);
      }
    } else {
      // For string values, just set them directly after a short delay
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, isLoaded]);
  
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

  // Format the value if it's a large number to prevent overflow
  const formatValue = () => {
    // If it's already a string (pre-formatted), return as is
    if (typeof value === 'string') {
      return value;
    }
    
    // For numeric values that are being animated, use the animated value
    return animatedValue.toString();
  };

  return (
    <Card className={cn(`overflow-hidden border rounded-xl shadow-sm stat-card ${getBackgroundClass()}`, className)}>
      <CardContent className="p-1 sm:p-1.5 md:p-2">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="text-[9px] font-medium text-gray-600 dark:text-gray-400 font-poppins">{title}</h3>
          <div className={`rounded-full w-3 h-3 md:w-4 md:h-4 flex items-center justify-center shadow-md ${getIconColorClass()}`}>
            <span className="scale-75">{icon}</span>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="animate-count-up" style={{ animationDelay: '0.2s' }}>
            <div className={cn(
              "text-[10px] sm:text-xs md:text-xs font-bold overflow-hidden text-ellipsis whitespace-nowrap",
              getTextColorClass(),
              "font-poppins"
            )}>
              {formatValue()}
            </div>
            {description && (
              <p className="text-[7px] mt-0.5 text-gray-500 dark:text-gray-400 font-inter">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
