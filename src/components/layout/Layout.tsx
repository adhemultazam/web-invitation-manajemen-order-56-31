
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNavbar } from "./MobileNavbar";
import { UserMenu } from "./UserMenu";
import { Bell } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <div className="p-4 md:p-6 w-full mx-auto">
            <div className="flex justify-between items-center mb-6">
              {isMobile && <SidebarTrigger />}
              <div className="ml-auto flex items-center gap-4">
                <button className="rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
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
    </SidebarProvider>
  );
}
