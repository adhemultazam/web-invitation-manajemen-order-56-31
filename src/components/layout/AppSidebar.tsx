
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
  FileText
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
    <Sidebar className="border-r bg-wedding-primary">
      <SidebarContent>
        <div className="px-4 py-5">
          <div className="bg-white/80 rounded-xl p-4 shadow-sm border border-wedding-primary/10 mb-4">
            <h1 className="text-xl font-bold text-center text-wedding-primary">
              Undangan Digital
            </h1>
            <p className="text-xs text-center text-gray-600 mt-1">
              Manajemen Pesanan
            </p>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80 font-medium">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/" ? "bg-white/80 text-wedding-primary font-medium" : "text-white hover:bg-white/20"}`}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/invoices" 
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/invoices" ? "bg-white/80 text-wedding-primary font-medium" : "text-white hover:bg-white/20"}`}
                  >
                    <FileText size={20} />
                    <span>Invoice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/pengaturan" 
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === "/pengaturan" ? "bg-white/80 text-wedding-primary font-medium" : "text-white hover:bg-white/20"}`}
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
          <SidebarGroupLabel className="text-white/80 font-medium">Pesanan Bulanan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {months.map((month) => (
                <SidebarMenuItem key={month.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={month.path} 
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${location.pathname === month.path ? "bg-white/80 text-wedding-primary font-medium" : "text-white hover:bg-white/20"}`}
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
