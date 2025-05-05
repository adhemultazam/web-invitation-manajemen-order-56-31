
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent,
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Settings,
  FileText,
  ArrowUpRight,
  Image
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const months = [
  { name: "Januari", path: "/bulan/januari" },
  { name: "Februari", path: "/bulan/februari" },
  { name: "Maret", path: "/bulan/maret" },
  { name: "April", path: "/bulan/april" },
  { name: "Mei", path: "/bulan/mei" },
  { name: "Juni", path: "/bulan/juni" },
  { name: "Juli", path: "/bulan/juli" },
  { name: "Agustus", path: "/bulan/agustus" },
  { name: "September", path: "/bulan/september" },
  { name: "Oktober", path: "/bulan/oktober" },
  { name: "November", path: "/bulan/november" },
  { name: "Desember", path: "/bulan/desember" },
];

export function AppSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <Sidebar className="bg-wedding-primary border-r-0">
      <SidebarContent>
        <div className="px-4 py-5">
          <div className="bg-white/80 rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center justify-center mb-2">
              <Avatar className="h-12 w-12 mr-3">
                <AvatarImage src={user?.logo || ''} alt="Logo" />
                <AvatarFallback className="bg-wedding-accent text-white">
                  <Image className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-center text-wedding-primary">
                  Undangan Digital
                </h1>
                <p className="text-xs text-center text-gray-500">
                  Manajemen Pesanan
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-medium text-xs px-5">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className={`sidebar-menu-item ${location.pathname === "/" ? "sidebar-menu-active" : "sidebar-menu-inactive"}`}
                  >
                    <LayoutDashboard size={18} />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/invoices" 
                    className={`sidebar-menu-item ${location.pathname === "/invoices" ? "sidebar-menu-active" : "sidebar-menu-inactive"}`}
                  >
                    <FileText size={18} />
                    <span className="text-sm">Invoice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/pengaturan" 
                    className={`sidebar-menu-item ${location.pathname === "/pengaturan" ? "sidebar-menu-active" : "sidebar-menu-inactive"}`}
                  >
                    <Settings size={18} />
                    <span className="text-sm">Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-medium text-xs px-5">Pesanan Bulanan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {months.map((month) => (
                <SidebarMenuItem key={month.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={month.path} 
                      className={`sidebar-menu-item ${location.pathname === month.path ? "sidebar-menu-active" : "sidebar-menu-inactive"}`}
                    >
                      <CalendarDays size={18} />
                      <span className="text-sm">{month.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Upgrade Button at the bottom */}
        <div className="px-4 mt-6 mb-4">
          <button className="w-full bg-white hover:bg-white/90 transition-colors text-wedding-primary font-medium rounded-lg py-2 text-sm flex items-center justify-center gap-1.5 shadow-sm">
            <span>Upgrade</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
