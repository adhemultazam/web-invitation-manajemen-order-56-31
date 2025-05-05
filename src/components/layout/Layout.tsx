
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "./MobileNavbar";
import { UserMenu } from "./UserMenu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
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
            {children}
          </div>
          {isMobile && <MobileNavbar />}
        </main>
      </div>
      <Toaster />
      <Sonner />

      {/* Global styles for compact table */}
      <style jsx global>{`
        .compact-table th {
          height: auto;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          font-size: 0.75rem;
        }
        
        .compact-table td {
          padding-top: 0.375rem;
          padding-bottom: 0.375rem;
        }
        
        .compact-table .small-select {
          font-size: 0.75rem;
          height: 1.75rem;
          min-height: 1.75rem;
        }
        
        .compact-badge {
          font-size: 0.6875rem;
          padding: 0.125rem 0.375rem;
          line-height: 1.2;
          border-radius: 0.25rem;
        }
      `}</style>
    </SidebarProvider>
  );
}
