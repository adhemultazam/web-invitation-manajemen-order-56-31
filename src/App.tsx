
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Settings from "./pages/settings/Settings";
import MonthlyOrders from "./pages/orders/MonthlyOrders";
import NotFound from "./pages/NotFound";
import Invoices from "./pages/invoices/Invoices";
import Login from "./pages/auth/Login";
import { TooltipProvider } from "./components/ui/tooltip";
import { useEffect } from "react";
import { toast } from "sonner";

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

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize storage on app load
    initializeLocalStorage();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="nikah-theme-mode">
          <BrowserRouter>
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
                
                {/* New consolidated route */}
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
                    <Navigate to={`/pesanan/:month`} replace />
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
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
