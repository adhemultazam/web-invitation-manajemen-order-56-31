
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

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider defaultOpen={!sidebarCollapsed} open={!sidebarCollapsed} onOpenChange={(open) => setSidebarCollapsed(!open)}>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <AppSidebar collapsed={sidebarCollapsed} onCollapseToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
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
            <div className="flex flex-col">
              {children}
            </div>
          </div>
          {isMobile && <MobileNavbar />}
        </main>
      </div>
      <Toaster />
      <Sonner />

      {/* Global styles for compact table */}
      <style>
        {`
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
        
        /* Animation for statistics */
        @keyframes countUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-count-up {
          animation: countUp 0.8s ease-out forwards;
        }
        
        .stat-card {
          transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        
        .stat-card:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }

        /* Mobile navbar styling */
        .mobile-navbar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          background-color: white;
          border-top: 1px solid #e5e7eb;
          padding: 0.5rem 0;
          z-index: 50;
        }
        
        .mobile-navbar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          flex: 1;
        }
        
        .mobile-navbar-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-bottom: 0.25rem;
        }
        
        .mobile-navbar-label {
          font-size: 0.625rem;
        }

        /* Responsive card grid for mobile */
        @media (max-width: 640px) {
          .stat-card {
            padding: 0.75rem !important;
          }
        }
        `}
      </style>
    </SidebarProvider>
  );
}
