
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

interface AppSidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export function AppSidebar({ collapsed = false, onCollapseToggle }: AppSidebarProps) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  // Get current month name in lowercase for the initial pesanan link
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' }).toLowerCase();
  
  return (
    <Sidebar className={cn(
      "transition-all duration-300 ease-in-out fixed z-30 h-screen",
      collapsed ? "w-[70px]" : "w-[260px]",
      isDarkMode 
        ? "bg-[#1E1E2F] border-r border-gray-700/30" 
        : "bg-white border-r border-gray-200 shadow-sm"
    )}>
      <div className="absolute right-[-12px] top-6 z-10">
        <Button 
          size="sm" 
          variant="outline" 
          className={cn(
            "rounded-full h-6 w-6 p-0 flex items-center justify-center border",
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
      <SidebarContent>
        <div className={cn(
          "transition-all duration-300 ease-in-out",
          collapsed ? "px-3 py-6" : "px-6 py-6"
        )}>
          <div className={cn(
            "transition-all duration-300 ease-in-out rounded-xl p-4 shadow-sm mb-4",
            isDarkMode 
              ? "bg-gray-800/50" 
              : "bg-gray-50"
          )}>
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user?.logo || ''} alt="Logo" />
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
                    "text-base font-bold", 
                    isDarkMode ? "text-gray-100" : "text-gray-800"
                  )}>
                    Undangan Digital
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
        
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "text-xs font-bold px-6 mb-1",
            isDarkMode ? "text-gray-400" : "text-gray-600",
            collapsed && "sr-only"
          )}>
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider delayDuration={100}>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link 
                          to="/" 
                          className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200",
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
                            collapsed && "ml-0"
                          )} />
                          {!collapsed && <span className="text-sm transition-opacity duration-300">Dashboard</span>}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right" className="text-xs">Dashboard</TooltipContent>}
                  </Tooltip>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={`/pesanan/${currentMonth}`}
                          className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200",
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
                            collapsed && "ml-0"
                          )} />
                          {!collapsed && <span className="text-sm transition-opacity duration-300">Catatan Pesanan</span>}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right" className="text-xs">Catatan Pesanan</TooltipContent>}
                  </Tooltip>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link 
                          to="/invoices" 
                          className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200",
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
                            collapsed && "ml-0"
                          )} />
                          {!collapsed && <span className="text-sm transition-opacity duration-300">Invoice</span>}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right" className="text-xs">Invoice</TooltipContent>}
                  </Tooltip>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Link 
                          to="/pengaturan" 
                          className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200",
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
                            collapsed && "ml-0"
                          )} />
                          {!collapsed && <span className="text-sm transition-opacity duration-300">Pengaturan</span>}
                        </Link>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right" className="text-xs">Pengaturan</TooltipContent>}
                  </Tooltip>
                </SidebarMenuItem>
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
