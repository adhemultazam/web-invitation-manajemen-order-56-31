
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
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Save current path to sessionStorage when it changes
  useEffect(() => {
    if (location.pathname) {
      sessionStorage.setItem('lastVisitedPath', location.pathname);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  return (
    <div className={cn(
      "min-h-screen",
      isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
    )}>
      {isMobile ? (
        <SidebarProvider>
          <div className="flex flex-col h-screen">
            <Topbar>
              <div className="flex items-center">
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu />
                  </Button>
                </SidebarTrigger>
              </div>
              <UserMenu />
            </Topbar>
            <div className="flex-1 overflow-auto px-4 py-4 pb-20">
              {children}
            </div>
            <MobileNavbar />
            <AppSidebar />
          </div>
        </SidebarProvider>
      ) : (
        <div className="flex">
          <AppSidebar collapsed={sidebarCollapsed} onCollapseToggle={toggleSidebar} />
          <div className={cn(
            "flex-1 min-h-screen flex flex-col transition-all duration-300",
            sidebarCollapsed ? "ml-[70px]" : "ml-[260px]"
          )}>
            <Topbar>
              <div className="flex-1"></div>
              <UserMenu />
            </Topbar>
            <div className="flex-1 overflow-auto px-6 py-6">
              {children}
            </div>
          </div>
        </div>
      )}
      <Toaster />
      <Sonner />
    </div>
  );
}
