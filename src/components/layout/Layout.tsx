
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "./MobileNavbar";
import { UserMenu } from "./UserMenu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-x-hidden">
        {!isMobile && (
          <AppSidebar 
            collapsed={sidebarCollapsed}
            onCollapseToggle={toggleSidebar}
          />
        )}

        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out w-full max-w-full overflow-hidden",
          !isMobile && (sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[260px]"),
          isDarkMode ? "bg-[#121222]" : "bg-gray-50"
        )}>
          <Topbar />

          <div className={cn(
            "flex-1 p-4 md:p-6 overflow-x-hidden",
            isMobile && "pb-24" // Add extra padding at the bottom on mobile to prevent content being hidden by navbar
          )}>
            {children}
          </div>
        </div>

        {isMobile && (
          <SidebarTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-30"
            >
              <Menu />
            </Button>
          </SidebarTrigger>
        )}

        {isMobile && <MobileNavbar />}
      </div>
      
      <Toaster />
      <Sonner />
    </SidebarProvider>
  );
}
