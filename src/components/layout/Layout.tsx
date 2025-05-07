
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
            <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
              {isMobile && (
                <SidebarTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SidebarTrigger>
              )}
              <div className={isMobile ? "" : "ml-2"}>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div>
                <UserMenu />
              </div>
            </div>
            <div className="flex flex-col">
              {children}
            </div>
          </div>
          {isMobile && <MobileNavbar />}
        </main>
        
        {/* For mobile sidebar */}
        {isMobile && <AppSidebar collapsed={false} onCollapseToggle={() => {}} />}
      </div>
      <Toaster />
      <Sonner />

      {/* Global styles for tables */}
      <style>
        {`
        /* Modern table styles with better spacing */
        .compact-table th {
          height: auto;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          font-size: 0.75rem;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        
        .compact-table td {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
          vertical-align: middle;
        }
        
        /* Specific styles for order tables */
        [data-component="Table"] td {
          padding-top: 0.625rem !important;
          padding-bottom: 0.625rem !important;
          vertical-align: middle !important;
        }
        
        [data-component="Table"] thead th {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: 0.75rem;
          letter-spacing: 0.02em;
        }
        
        [data-component="Table"] tbody td {
          font-family: 'Inter', sans-serif;
          font-size: 0.875rem;
        }
        `}
      </style>
    </SidebarProvider>
  );
}
