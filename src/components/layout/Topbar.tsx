
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn, monthsInIndonesian } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopbarProps {
  children?: React.ReactNode;
}

export function Topbar({ children }: TopbarProps) {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDarkMode = theme === "dark";
  const isMobile = useIsMobile();
  
  // Format current date in Indonesian manually instead of using locale
  const today = new Date();
  const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(today);
  const day = today.getDate();
  const month = monthsInIndonesian[today.getMonth()];
  const year = today.getFullYear();
  
  // Construct formatted date (e.g., "Senin, 8 Mei 2025")
  const formattedDate = `${dayName}, ${day} ${month} ${year}`;
  
  // Capitalize first letter (already capitalized with Intl.DateTimeFormat)
  const capitalizedDate = formattedDate;
  
  // Check if we're on the root path
  const isRootPath = location.pathname === "/";
  
  return (
    <div className={cn(
      "flex justify-between items-center py-4 px-4 md:px-6 w-full max-w-full overflow-hidden",
      "border-b",
      isDarkMode ? "border-gray-700/30" : "border-gray-200"
    )}>
      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
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
          "text-xs md:text-sm font-medium truncate max-w-[150px] md:max-w-none",
          isDarkMode ? "text-gray-300" : "text-gray-600"
        )}>
          {capitalizedDate}
        </p>
      </div>
      
      {/* Child elements passed to Topbar */}
      {children}
      
      {!children && (
        <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 md:h-9 md:w-9 rounded-full p-0 overflow-hidden">
                <Avatar className="h-8 w-8 md:h-9 md:w-9 bg-wedding-primary/10">
                  {user?.profileImage ? (
                    <AvatarImage 
                      src={user.profileImage} 
                      alt={user?.name || 'User'} 
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="bg-violet-500 text-white text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 mt-1">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/pengaturan">
                <DropdownMenuItem>
                  Pengaturan
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
