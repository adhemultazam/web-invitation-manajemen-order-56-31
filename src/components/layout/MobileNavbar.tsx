
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Settings, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNavbar() {
  const location = useLocation();
  const path = location.pathname;
  
  // Get current month name in lowercase for the pesanan link
  const currentMonth = new Date().toLocaleString('id-ID', { month: 'long' }).toLowerCase();
  
  const isActive = (route: string) => {
    if (route === "/" && path === "/") return true;
    if (route === "/pengaturan" && path === "/pengaturan") return true;
    if (route === "/pesanan" && (path.includes("/pesanan") || path.includes("/bulan"))) return true;
    if (route === "/invoices" && path === "/invoices") return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50 flex items-center justify-around h-14 w-full md:hidden">
      <Link 
        to="/" 
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          isActive("/") 
            ? "text-primary after:absolute after:top-0 after:h-0.5 after:w-6 after:bg-primary" 
            : "text-muted-foreground",
          "relative"
        )}
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="text-[10px] mt-1">Dashboard</span>
      </Link>
      
      <Link 
        to={`/pesanan/${currentMonth}`}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          isActive("/pesanan") 
            ? "text-primary after:absolute after:top-0 after:h-0.5 after:w-6 after:bg-primary" 
            : "text-muted-foreground",
          "relative"
        )}
      >
        <CalendarDays className="h-4 w-4" />
        <span className="text-[10px] mt-1">Pesanan</span>
      </Link>
      
      <Link 
        to="/invoices" 
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          isActive("/invoices") 
            ? "text-primary after:absolute after:top-0 after:h-0.5 after:w-6 after:bg-primary" 
            : "text-muted-foreground",
          "relative"
        )}
      >
        <FileText className="h-4 w-4" />
        <span className="text-[10px] mt-1">Invoice</span>
      </Link>
      
      <Link 
        to="/pengaturan" 
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          isActive("/pengaturan") 
            ? "text-primary after:absolute after:top-0 after:h-0.5 after:w-6 after:bg-primary" 
            : "text-muted-foreground",
          "relative"
        )}
      >
        <Settings className="h-4 w-4" />
        <span className="text-[10px] mt-1">Setting</span>
      </Link>
    </div>
  );
}
