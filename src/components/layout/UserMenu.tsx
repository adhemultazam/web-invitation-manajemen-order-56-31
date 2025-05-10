import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/contexts/auth";
import { User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, useNavigate } from "react-router-dom";

export function UserMenu() {
  const navigate = useNavigate();
  const { profile, user: supabaseUser, signOut, setSession } = useSupabaseAuth();

  const handleLogout = async () => {
    await signOut();
    setSession(null);  // Paksa kosongkan session
    navigate("/login", { replace: true });  // Arahkan ke halaman login
  };

  const displayName = profile?.name || supabaseUser?.email || "Pengguna";
  const displayEmail = supabaseUser?.email || "-";
  const displayImage = profile?.profile_image || undefined;

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-9 w-9 rounded-full p-0 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <Avatar className="h-9 w-9">
              <AvatarImage src={displayImage} alt={displayName} className="h-full w-full object-cover" />
              <AvatarFallback className="bg-wedding-primary text-white">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link to="/pengaturan">
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Keluar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
