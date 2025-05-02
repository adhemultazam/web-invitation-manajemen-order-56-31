
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
} from "lucide-react";

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
  
  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-3 py-4">
          <h1 className="text-xl font-bold text-center text-white mb-2">
            Undangan Digital
          </h1>
          <p className="text-xs text-center text-white/80">
            Manajemen Pesanan
          </p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className={`${location.pathname === "/" ? "bg-sidebar-accent" : ""}`}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/pengaturan" 
                    className={`${location.pathname === "/pengaturan" ? "bg-sidebar-accent" : ""}`}
                  >
                    <Settings size={20} />
                    <span>Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Pesanan Bulanan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {months.map((month) => (
                <SidebarMenuItem key={month.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={month.path} 
                      className={`${location.pathname === month.path ? "bg-sidebar-accent" : ""}`}
                    >
                      <CalendarDays size={20} />
                      <span>{month.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
