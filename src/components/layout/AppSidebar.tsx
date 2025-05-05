
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
    <Sidebar className="bg-white border-r border-gray-200 shadow-sm w-[260px]">
      <SidebarContent>
        <div className="px-6 py-6">
          <div className="bg-gray-50 rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user?.logo || ''} alt="Logo" />
                <AvatarFallback className="bg-wedding-accent text-white">
                  <Image className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-base font-semibold text-gray-800">
                  Undangan Digital
                </h1>
                <p className="text-xs text-gray-500">
                  Manajemen Pesanan
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium text-xs px-6 mb-1">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                      location.pathname === "/" 
                        ? "bg-wedding-muted text-wedding-accent font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LayoutDashboard size={18} className={location.pathname === "/" ? "text-wedding-accent" : ""} />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/invoices" 
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                      location.pathname === "/invoices" 
                        ? "bg-wedding-muted text-wedding-accent font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FileText size={18} className={location.pathname === "/invoices" ? "text-wedding-accent" : ""} />
                    <span className="text-sm">Invoice</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/pengaturan" 
                    className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                      location.pathname === "/pengaturan" 
                        ? "bg-wedding-muted text-wedding-accent font-medium" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings size={18} className={location.pathname === "/pengaturan" ? "text-wedding-accent" : ""} />
                    <span className="text-sm">Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-gray-500 font-medium text-xs px-6 mb-1">Pesanan Bulanan</SidebarGroupLabel>
          <SidebarGroupContent className="max-h-[calc(100vh-350px)] overflow-y-auto pr-1 custom-scrollbar">
            <SidebarMenu>
              {months.map((month) => (
                <SidebarMenuItem key={month.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={month.path} 
                      className={`flex items-center gap-3 px-6 py-2.5 rounded-lg transition-colors ${
                        location.pathname === month.path 
                          ? "bg-wedding-muted text-wedding-accent font-medium" 
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <CalendarDays size={16} className={location.pathname === month.path ? "text-wedding-accent" : ""} />
                      <span className="text-sm">{month.name}</span>
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
