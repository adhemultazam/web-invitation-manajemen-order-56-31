
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Settings, FileText } from "lucide-react";

export function MobileNavbar() {
  const location = useLocation();
  const path = location.pathname;
  
  const isActive = (route: string) => {
    if (route === "/" && path === "/") return true;
    if (route === "/pengaturan" && path === "/pengaturan") return true;
    if (route === "/bulan" && path.includes("/bulan")) return true;
    if (route === "/invoices" && path === "/invoices") return true;
    return false;
  };

  return (
    <div className="mobile-navbar">
      <Link 
        to="/" 
        className={`mobile-navbar-item ${isActive("/") ? "active" : ""}`}
      >
        <LayoutDashboard className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Dashboard</span>
      </Link>
      
      <Link 
        to="/bulan/januari" 
        className={`mobile-navbar-item ${isActive("/bulan") ? "active" : ""}`}
      >
        <Calendar className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Pesanan</span>
      </Link>
      
      <Link 
        to="/invoices" 
        className={`mobile-navbar-item ${isActive("/invoices") ? "active" : ""}`}
      >
        <FileText className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Invoice</span>
      </Link>
      
      <Link 
        to="/pengaturan" 
        className={`mobile-navbar-item ${isActive("/pengaturan") ? "active" : ""}`}
      >
        <Settings className="mobile-navbar-icon" />
        <span className="mobile-navbar-label">Pengaturan</span>
      </Link>
    </div>
  );
}
