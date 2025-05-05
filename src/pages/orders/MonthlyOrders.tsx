
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Order } from "@/types/types";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import { EditOrderDialog } from "@/components/orders/EditOrderDialog";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import OrderStats from "@/components/orders/OrderStats";
import MobileOrderCard from "@/components/orders/MobileOrderCard";
import { EmptyOrderState } from "@/components/orders/EmptyOrderState";
import { OrdersPageHeader } from "@/components/orders/OrdersPageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMonthlyOrders } from "@/hooks/useMonthlyOrders";
import { useOrderResources } from "@/hooks/useOrderResources";
import { isValidMonth, getMonthTitle } from "@/utils/monthUtils";

export default function MonthlyOrders() {
  const { month = "januari" } = useParams<{ month: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Custom hooks
  const {
    orders,
    filteredOrders,
    isAddOrderOpen,
    setIsAddOrderOpen,
    editingOrder,
    setEditingOrder,
    updatingOrders,
    handleAddOrder,
    handleUpdateOrder,
    handleDeleteOrder,
    togglePaymentStatus,
    handleWorkStatusChange,
    handleVendorChange,
    handleThemeChange,
    handlePackageChange,
    handleViewOrderDetail,
    handleOpenEditDialog,
    handleSaveOrder,
    handleFilterChange,
  } = useMonthlyOrders(month);
  
  const {
    vendors,
    workStatuses,
    themes,
    packages,
    addons,
    vendorColors,
    addonStyles
  } = useOrderResources();
  
  // Check if month is valid
  useEffect(() => {
    if (!isValidMonth(month)) {
      navigate("/bulan/januari", { replace: true });
    }
  }, [month, navigate]);
  
  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Get the current month title
  const monthTitle = getMonthTitle(month);
  
  return (
    <div className="space-y-4">
      <OrdersPageHeader 
        title={`Pesanan ${monthTitle}`} 
        onAddOrder={() => setIsAddOrderOpen(true)} 
      />
      
      {/* Order Statistics */}
      <OrderStats orders={orders} formatCurrency={formatCurrency} />
      
      {/* Order Filters */}
      <OrderFilter
        onFilter={handleFilterChange}
        vendors={vendors.map(v => v.id)}
        workStatuses={workStatuses.map(s => s.name)}
      />
      
      {filteredOrders.length === 0 ? (
        <EmptyOrderState 
          monthTitle={monthTitle} 
          onAddOrder={() => setIsAddOrderOpen(true)} 
        />
      ) : (
        <>
          {isMobile ? (
            <div className="grid gap-4">
              {filteredOrders.map((order) => (
                <MobileOrderCard
                  key={order.id}
                  order={order}
                  updatingOrders={updatingOrders}
                  vendorColors={vendorColors}
                  addonStyles={addonStyles}
                  availableWorkStatuses={workStatuses}
                  availablePackages={packages}
                  vendors={vendors}
                  themes={themes.map(t => t.name)}
                  formatDate={(dateString) => {
                    try {
                      const date = new Date(dateString);
                      return date.toLocaleDateString("id-ID", {
                        day: "2-digit", 
                        month: "short", 
                        year: "numeric"
                      });
                    } catch (error) {
                      return dateString;
                    }
                  }}
                  isPastDate={(dateString) => {
                    try {
                      const date = new Date(dateString);
                      return date < new Date();
                    } catch (error) {
                      return false;
                    }
                  }}
                  formatCurrency={formatCurrency}
                  togglePaymentStatus={togglePaymentStatus}
                  handleWorkStatusChange={handleWorkStatusChange}
                  handleVendorChange={handleVendorChange}
                  handleThemeChange={handleThemeChange}
                  handlePackageChange={handlePackageChange}
                  handleViewOrderDetail={handleViewOrderDetail}
                  handleOpenEditDialog={handleOpenEditDialog}
                  handleDeleteOrder={handleDeleteOrder}
                />
              ))}
            </div>
          ) : (
            <OrderTable
              orders={filteredOrders}
              updatingOrders={updatingOrders}
              vendorColors={vendorColors}
              addonStyles={addonStyles}
              availableWorkStatuses={workStatuses}
              availableVendors={vendors}
              availableThemes={themes}
              availablePackages={packages}
              togglePaymentStatus={togglePaymentStatus}
              handleWorkStatusChange={handleWorkStatusChange}
              handleVendorChange={handleVendorChange}
              handleThemeChange={handleThemeChange}
              handlePackageChange={handlePackageChange}
              handleViewOrderDetail={handleViewOrderDetail}
              handleOpenEditDialog={handleOpenEditDialog}
              handleDeleteOrder={handleDeleteOrder}
            />
          )}
        </>
      )}
      
      {/* Modals */}
      <AddOrderModal
        isOpen={isAddOrderOpen}
        onClose={() => setIsAddOrderOpen(false)}
        onAddOrder={handleAddOrder}
        vendors={vendors.map(v => v.id)}
        workStatuses={workStatuses.map(s => s.name)}
        addons={addons}
      />
      
      {editingOrder && (
        <EditOrderDialog
          order={editingOrder}
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveOrder}
          vendors={vendors}
          workStatuses={workStatuses}
          themes={themes}
          addons={addons}
          packages={packages}
        />
      )}
    </div>
  );
}
