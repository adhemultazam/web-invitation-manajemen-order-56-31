
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { User, LogOut, Settings, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function UserMenu() {
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 bg-gray-100 dark:bg-gray-800 relative">
          <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-wedding-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-wedding-primary"></span>
          </span>
        </Button>
      </div>
      
      <ThemeToggle />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 px-2 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <Avatar className="h-7 w-7 bg-wedding-primary text-white">
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm">{user.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <Link to="/pengaturan">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
