
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Settings, FileText } from "lucide-react";

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
    <div className="mobile-navbar shadow-lg z-50">
      <Link 
        to="/" 
        className={`mobile-navbar-item ${isActive("/") ? "active text-wedding-primary" : "text-gray-600 dark:text-gray-400"}`}
      >
        <LayoutDashboard className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Dashboard</span>
      </Link>
      
      <Link 
        to={`/pesanan/${currentMonth}`}
        className={`mobile-navbar-item ${isActive("/pesanan") ? "active text-wedding-primary" : "text-gray-600 dark:text-gray-400"}`}
      >
        <CalendarDays className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Pesanan</span>
      </Link>
      
      <Link 
        to="/invoices" 
        className={`mobile-navbar-item ${isActive("/invoices") ? "active text-wedding-primary" : "text-gray-600 dark:text-gray-400"}`}
      >
        <FileText className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Invoice</span>
      </Link>
      
      <Link 
        to="/pengaturan" 
        className={`mobile-navbar-item ${isActive("/pengaturan") ? "active text-wedding-primary" : "text-gray-600 dark:text-gray-400"}`}
      >
        <Settings className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Pengaturan</span>
      </Link>
    </div>
  );
}
