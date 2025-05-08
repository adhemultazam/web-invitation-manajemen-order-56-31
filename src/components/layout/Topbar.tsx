
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = theme === "dark";
  
  // Format current date in Indonesian
  const today = new Date();
  const formattedDate = format(today, "EEEE, d MMMM yyyy", { locale: id });
  
  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  // Check if we're on the root path
  const isRootPath = location.pathname === "/";
  
  return (
    <div className={cn(
      "flex justify-between items-center py-4 px-6",
      "border-b",
      isDarkMode ? "border-gray-700/30" : "border-gray-200"
    )}>
      <div className="flex items-center gap-3">
        {!isRootPath && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 mr-1" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <p className={cn(
          "text-sm font-medium",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          {capitalizedDate}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Avatar className="h-9 w-9 bg-wedding-primary/10">
          <AvatarFallback className="bg-wedding-primary text-white text-sm">
            {user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
