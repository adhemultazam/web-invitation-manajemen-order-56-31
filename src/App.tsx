
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Settings from "./pages/settings/Settings";
import MonthlyOrders from "./pages/orders/MonthlyOrders";
import NotFound from "./pages/NotFound";
import Invoices from "./pages/invoices/Invoices";
import Transactions from "./pages/transactions/Transactions";
import Login from "./pages/auth/Login";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { toast } from "sonner";
import { migrateVendorData } from "./lib/utils";

// Initialize data storage if it doesn't exist
const initializeLocalStorage = () => {
  const keys = [
    'vendors', 'workStatuses', 'addons', 'themes', 'packages',
    'orders_januari', 'orders_februari', 'orders_maret',
    'orders_april', 'orders_mei', 'orders_juni',
    'orders_juli', 'orders_agustus', 'orders_september',
    'orders_oktober', 'orders_november', 'orders_desember',
    'invoices', 'invoiceSettings', 'themeSettings', 'settingsActiveTab'
  ];
  
  let initialized = false;
  
  keys.forEach(key => {
    if (!localStorage.getItem(key)) {
      initialized = true;
    }
  });
  
  if (initialized) {
    toast.success("Data berhasil diinisialisasi ke local storage", {
      description: "Semua data akan disimpan secara otomatis di browser Anda"
    });
  }
};

// Helper component for redirection
const RedirectWithParams = () => {
  const { month } = useParams();
  return <Navigate to={`/pesanan/${month}`} replace />;
};

// Helper to get current month
const getCurrentMonth = () => {
  return new Date().toLocaleString('id-ID', { month: 'long' }).toLowerCase();
};

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize storage on app load
    initializeLocalStorage();
    
    // Migrate vendor data from commission to landingPageUrl
    migrateVendorData();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="nikah-theme-mode">
            <TooltipProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Index />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/pengaturan" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="/transaksi" element={
                  <ProtectedRoute>
                    <Layout>
                      <Transactions />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Route for all orders without month specified - redirect to current month */}
                <Route path="/pesanan" element={
                  <ProtectedRoute>
                    <Navigate to={`/pesanan/${getCurrentMonth()}`} replace />
                  </ProtectedRoute>
                } />
                
                {/* Route for specific month */}
                <Route path="/pesanan/:month" element={
                  <ProtectedRoute>
                    <Layout>
                      <MonthlyOrders />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                {/* Redirect old routes to new format */}
                <Route path="/bulan/:month" element={
                  <ProtectedRoute>
                    <RedirectWithParams />
                  </ProtectedRoute>
                } />
                
                <Route path="/invoices" element={
                  <ProtectedRoute>
                    <Layout>
                      <Invoices />
                    </Layout>
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
