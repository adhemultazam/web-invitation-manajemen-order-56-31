
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings,
  FileText,
  Image,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function AppSidebar({ collapsed = false, onCollapseToggle }: AppSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const isMobile = useIsMobile();
  
  // Get current month name in lowercase for the initial pesanan link
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' }).toLowerCase();
  
  // State for sidebar title and logo from settings
  const [sidebarTitle, setSidebarTitle] = useState("Order Management");
  const [sidebarLogo, setSidebarLogo] = useState("/placeholder.svg");
  
  // Load sidebar settings from localStorage
  useEffect(() => {
    const loadSidebarSettings = () => {
      try {
        const savedSettings = localStorage.getItem("generalSettings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          if (settings.sidebarTitle) {
            setSidebarTitle(settings.sidebarTitle);
          }
          if (settings.appLogo) {
            setSidebarLogo(settings.appLogo);
          }
        }
      } catch (error) {
        console.error("Error loading sidebar settings:", error);
      }
    };
    
    loadSidebarSettings();
    
    // Listen for storage changes to update in real-time across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "generalSettings" && e.newValue) {
        loadSidebarSettings();
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  if (isMobile) {
    // For mobile, we use the Sidebar component directly
    return (
      <Sidebar variant="sidebar" collapsible="offcanvas">
        <SidebarContent>
          <div className="px-4 py-6">
            <div className="rounded-xl p-4 shadow-sm mb-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={sidebarLogo} alt="Logo" className="sidebar-logo" />
                  <AvatarFallback className={cn(
                    "text-white",
                    isDarkMode ? "bg-indigo-600" : "bg-wedding-accent"
                  )}>
                    <Image className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className={cn(
                    "text-base font-bold sidebar-title", 
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  )}>
                    {sidebarTitle}
                  </h1>
                  <p className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    Manajemen Pesanan
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-2">
            <div className={cn(
              "text-xs font-bold px-4 mb-1",
              isDarkMode ? "text-gray-400" : "text-gray-600"
            )}>
              Menu Utama
            </div>
            <div className="mt-2">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link 
                    to="/" 
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                      location.pathname === "/" 
                        ? isDarkMode 
                          ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                          : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                        : isDarkMode
                          ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                          : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                    )}
                  >
                    <LayoutDashboard size={18} className={cn(
                      location.pathname === "/" 
                        ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                        : "",
                    )} />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </li>

                <li>
                  <Link 
                    to={`/pesanan/${currentMonth}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                      location.pathname.includes("/pesanan") || location.pathname.includes("/bulan") 
                        ? isDarkMode 
                          ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                          : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                        : isDarkMode
                          ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                          : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                    )}
                  >
                    <CalendarDays size={18} className={cn(
                      location.pathname.includes("/pesanan") || location.pathname.includes("/bulan")
                        ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                        : "",
                    )} />
                    <span className="text-sm">Catatan Pesanan</span>
                  </Link>
                </li>

                <li>
                  <Link 
                    to="/invoices" 
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                      location.pathname === "/invoices" 
                        ? isDarkMode 
                          ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                          : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                        : isDarkMode
                          ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                          : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                    )}
                  >
                    <FileText size={18} className={cn(
                      location.pathname === "/invoices" 
                        ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                        : "",
                    )} />
                    <span className="text-sm">Invoice</span>
                  </Link>
                </li>

                <li>
                  <Link 
                    to="/pengaturan" 
                    className={cn(
                      "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                      location.pathname === "/pengaturan" 
                        ? isDarkMode 
                          ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                          : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                        : isDarkMode
                          ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                          : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                    )}
                  >
                    <Settings size={18} className={cn(
                      location.pathname === "/pengaturan" 
                        ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                        : "",
                    )} />
                    <span className="text-sm">Pengaturan</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  // For desktop mode with collapsible sidebar
  return (
    <div 
      className={cn(
        "transition-all duration-300 ease-in-out z-30 h-screen",
        "md:fixed", 
        collapsed ? "w-[70px]" : "w-[260px]",
        isDarkMode 
          ? "bg-[#1E1E2F] border-r border-gray-700/30" 
          : "bg-white border-r border-gray-200 shadow-sm"
      )}
    >
      <div className="absolute right-[-12px] top-6 z-10">
        <Button 
          size="sm" 
          variant="outline" 
          className={cn(
            "rounded-full h-6 w-6 p-0 flex items-center justify-center border",
            "md:flex hidden", // Hide on mobile, only show on desktop
            isDarkMode 
              ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-300" 
              : "bg-white hover:bg-gray-100"
          )}
          onClick={onCollapseToggle}
        >
          {collapsed ? 
            <ChevronRight className="h-3.5 w-3.5" /> : 
            <ChevronLeft className="h-3.5 w-3.5" />
          }
        </Button>
      </div>
      <div className="h-full flex flex-col">
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "px-3 py-6" : "px-6 py-6"
        )}>
          <div className={cn(
            "transition-all duration-300 ease-in-out rounded-xl p-4 shadow-sm mb-4",
            collapsed && "p-2 flex justify-center",
            isDarkMode 
              ? "bg-gray-800/50" 
              : "bg-gray-50"
          )}>
            <div className={cn("flex items-center", collapsed && "justify-center")}>
              <Avatar className={cn("h-10 w-10", collapsed ? "mr-0" : "mr-3")}>
                <AvatarImage src={sidebarLogo} alt="Logo" className="sidebar-logo" />
                <AvatarFallback className={cn(
                  "text-white",
                  isDarkMode ? "bg-indigo-600" : "bg-wedding-accent"
                )}>
                  <Image className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="transition-opacity duration-300">
                  <h1 className={cn(
                    "text-base font-bold sidebar-title", 
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  )}>
                    {sidebarTitle}
                  </h1>
                  <p className={cn(
                    "text-xs",
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    Manajemen Pesanan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="px-2">
            <TooltipProvider delayDuration={100}>
              <div className={cn(
                "text-xs font-bold px-4 mb-1",
                isDarkMode ? "text-gray-400" : "text-gray-600",
                collapsed && "sr-only"
              )}>
                Menu Utama
              </div>
              <div className="mt-2">
                <ul className="flex flex-col gap-1">
                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link 
                          to="/" 
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                            collapsed && "justify-center px-3",
                            location.pathname === "/" 
                              ? isDarkMode 
                                ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                                : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                              : isDarkMode
                                ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                                : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                          )}
                        >
                          <LayoutDashboard size={collapsed ? 24 : 18} className={cn(
                            location.pathname === "/" 
                              ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                              : "",
                          )} />
                          {!collapsed && <span className="text-sm">Dashboard</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right" className="text-xs">Dashboard</TooltipContent>}
                    </Tooltip>
                  </li>

                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link 
                          to={`/pesanan/${currentMonth}`}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                            collapsed && "justify-center px-3",
                            location.pathname.includes("/pesanan") || location.pathname.includes("/bulan") 
                              ? isDarkMode 
                                ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                                : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                              : isDarkMode
                                ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                                : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                          )}
                        >
                          <CalendarDays size={collapsed ? 24 : 18} className={cn(
                            location.pathname.includes("/pesanan") || location.pathname.includes("/bulan")
                              ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                              : "",
                          )} />
                          {!collapsed && <span className="text-sm">Catatan Pesanan</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right" className="text-xs">Catatan Pesanan</TooltipContent>}
                    </Tooltip>
                  </li>

                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link 
                          to="/invoices" 
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                            collapsed && "justify-center px-3",
                            location.pathname === "/invoices" 
                              ? isDarkMode 
                                ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                                : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                              : isDarkMode
                                ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                                : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                          )}
                        >
                          <FileText size={collapsed ? 24 : 18} className={cn(
                            location.pathname === "/invoices" 
                              ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                              : "",
                          )} />
                          {!collapsed && <span className="text-sm">Invoice</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right" className="text-xs">Invoice</TooltipContent>}
                    </Tooltip>
                  </li>

                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link 
                          to="/pengaturan" 
                          className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                            collapsed && "justify-center px-3",
                            location.pathname === "/pengaturan" 
                              ? isDarkMode 
                                ? "bg-gradient-to-r from-indigo-900/40 to-indigo-800/20 text-indigo-300 font-bold" 
                                : "bg-gradient-to-r from-wedding-muted to-wedding-light text-wedding-primary font-bold" 
                              : isDarkMode
                                ? "text-gray-200 font-medium hover:bg-gray-800/50 hover:scale-[1.02]"
                                : "text-gray-700 font-semibold hover:bg-gray-50 hover:scale-[1.02]"
                          )}
                        >
                          <Settings size={collapsed ? 24 : 18} className={cn(
                            location.pathname === "/pengaturan" 
                              ? isDarkMode ? "text-indigo-300" : "text-wedding-accent" 
                              : "",
                          )} />
                          {!collapsed && <span className="text-sm">Pengaturan</span>}
                        </Link>
                      </TooltipTrigger>
                      {collapsed && <TooltipContent side="right" className="text-xs">Pengaturan</TooltipContent>}
                    </Tooltip>
                  </li>
                </ul>
              </div>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
