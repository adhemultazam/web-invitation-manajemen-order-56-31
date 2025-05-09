
import { useState, useEffect } from "react";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Topbar } from "./Topbar";
import { MobileNavbar } from "./MobileNavbar";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Check if should collapse sidebar on initial load based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-hidden">
        <AppSidebar collapsed={sidebarCollapsed} onCollapseToggle={toggleSidebar} />
        <div
          className={cn(
            "flex-1 transition-all duration-300 ease-in-out overflow-y-auto",
            "min-h-screen max-w-full",
            isMobile ? "w-full" : (sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[260px]")
          )}
        >
          <Topbar />
          <main className="container p-4 md:p-6 mx-auto max-w-full pb-16">
            {children}
          </main>
          {isMobile && <MobileNavbar />}
        </div>
      </div>
    </SidebarProvider>
  );
}
