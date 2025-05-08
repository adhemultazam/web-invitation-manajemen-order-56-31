
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
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

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed} open={!sidebarCollapsed} onOpenChange={(open) => setSidebarCollapsed(!open)}>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900 font-inter">
        {!isMobile && <AppSidebar collapsed={sidebarCollapsed} onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />}
        <main className={cn("flex-1 overflow-auto pb-16 md:pb-0", 
          !isMobile ? (sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[260px]") : "")}>
          <div className="p-4 md:p-6 w-full">
            {isMobile && (
              <div className="flex items-center justify-between mb-4">
                <SidebarTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SidebarTrigger>
                <UserMenu />
              </div>
            )}
            {children}
          </div>
          {isMobile && <MobileNavbar />}
        </main>
        <Toaster />
        <Sonner />
      </div>
    </SidebarProvider>
  );
}
