
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar, PlusCircle } from "lucide-react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { useVendorsData } from "@/hooks/useVendorsData";
import { AddOrderModal } from "@/components/orders/AddOrderModal";
import OrderStats from "@/components/orders/OrderStats";
import { CompactOrdersTable } from "@/components/orders/CompactOrdersTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import { useMonthlyOrders } from "@/hooks/useMonthlyOrders";
import { MonthlyStats } from "@/components/orders/MonthlyStats";
import { formatCurrency } from "@/lib/utils";

const MonthlyOrders = () => {
  const { month } = useParams();
  const navigate = useNavigate();
  
  // Get current year and month
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  // State for selected year and month
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(
    month ? 
      month.charAt(0).toUpperCase() + month.slice(1) : 
      getMonthName(currentMonth)
  );
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  
  // Generate years (past 2 years, current year, next year)
  const years = [
    (currentYear - 2).toString(),
    (currentYear - 1).toString(),
    currentYear.toString(),
    (currentYear + 1).toString()
  ];
  
  // Month names
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  // Helper function to get month name
  function getMonthName(monthIndex: number): string {
    return months[monthIndex];
  }
  
  // Load orders data based on selected year and month
  const { orders, isLoading, addOrder } = useOrdersData(selectedYear, selectedMonth);
  const { vendors } = useVendorsData();

  // Use monthly orders hook for additional functionality
  const {
    filteredOrders,
    handleAddOrder,
    handleOpenEditDialog,
    handleDeleteOrder,
    handleFilterChange,
    vendorColors,
    addonStyles,
    updatingOrders,
  } = useMonthlyOrders(selectedMonth);
  
  // Effect to update URL when selections change
  useEffect(() => {
    const monthParam = selectedMonth.toLowerCase();
    navigate(`/pesanan/${monthParam}`, { replace: true });
  }, [selectedMonth, navigate]);
  
  // Handlers for modal
  const handleOpenAddOrderModal = () => setIsAddOrderModalOpen(true);
  const handleCloseAddOrderModal = () => setIsAddOrderModalOpen(false);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pesanan Bulanan</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola pesanan undangan digital per bulan
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px] h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button className="bg-wedding-primary hover:bg-wedding-accent" onClick={handleOpenAddOrderModal}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Tambah Pesanan
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-primary"></div>
        </div>
      ) : (
        <>
          {/* Monthly Statistics */}
          <MonthlyStats orders={orders} month={selectedMonth} />
          
          {/* Order Filters */}
          <OrderFilter 
            onFilter={handleFilterChange} 
            vendors={vendors.map(v => v.id)}
            workStatuses={["Belum", "Proses", "Selesai"]}
          />
          
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Belum ada pesanan</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Belum ada pesanan untuk bulan {selectedMonth} {selectedYear}
              </p>
              <Button variant="outline" onClick={handleOpenAddOrderModal}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Pesanan Baru
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              <CompactOrdersTable 
                orders={filteredOrders}
                onEditOrder={handleOpenEditDialog}
                onDeleteOrder={handleDeleteOrder}
              />
            </div>
          )}
        </>
      )}
      
      {/* AddOrderModal will appear when isAddOrderModalOpen is true */}
      {isAddOrderModalOpen && (
        <AddOrderModal
          isOpen={isAddOrderModalOpen}
          onClose={handleCloseAddOrderModal}
          onAddOrder={(order) => {
            handleAddOrder(order);
            handleCloseAddOrderModal();
          }}
          vendors={vendors.map(v => v.id)}
          workStatuses={["Belum", "Proses", "Selesai"]} 
          addons={[]}
        />
      )}
    </div>
  );
};

export default MonthlyOrders;
