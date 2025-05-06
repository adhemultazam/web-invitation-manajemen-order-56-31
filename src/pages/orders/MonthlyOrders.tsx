
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
import { CompactOrdersTable } from "@/components/orders/CompactOrdersTable";
import { OrderFilter } from "@/components/orders/OrderFilter";
import { useMonthlyOrders } from "@/hooks/useMonthlyOrders";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Check, X } from "lucide-react";

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
  
  // Create a wrapper function for onDeleteOrder to convert from (order) to (id)
  const handleOrderDelete = (id: string) => {
    // Find the order from filteredOrders using the ID
    const orderToDelete = filteredOrders.find(order => order.id === id);
    if (orderToDelete) {
      handleDeleteOrder(orderToDelete);
    }
  };

  // Helper function to ensure values are numeric
  const getNumericAmount = (amount: any): number => {
    if (typeof amount === 'number' && !isNaN(amount)) {
      return amount;
    }
    if (typeof amount === 'string' && amount.trim() !== '') {
      const numericAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
      return !isNaN(numericAmount) ? numericAmount : 0;
    }
    return 0;
  };

  // Calculate stats for the stat cards
  const totalOrders = orders.length;
  
  let totalRevenue = 0;
  orders.forEach(order => {
    totalRevenue += getNumericAmount(order.paymentAmount);
  });
  
  const paidOrders = orders.filter(order => order.paymentStatus === "Lunas");
  const paidOrdersCount = paidOrders.length;
  
  let paidRevenue = 0;
  paidOrders.forEach(order => {
    paidRevenue += getNumericAmount(order.paymentAmount);
  });
  
  const unpaidOrders = orders.filter(order => order.paymentStatus === "Pending");
  const unpaidOrdersCount = unpaidOrders.length;
  
  let unpaidRevenue = 0;
  unpaidOrders.forEach(order => {
    unpaidRevenue += getNumericAmount(order.paymentAmount);
  });
  
  return (
    <div className="space-y-4">
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
          {/* Compact Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Pesanan Card */}
            <Card className="p-4 bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-blue-700 dark:text-blue-300 font-medium">Total Pesanan</h3>
                <div className="rounded-full w-6 h-6 flex items-center justify-center bg-blue-500">
                  <ShoppingCart className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalOrders}</p>
            </Card>
            
            {/* Total Omset Card */}
            <Card className="p-4 bg-purple-50 border border-purple-100 dark:bg-purple-900/20 dark:border-purple-800/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-purple-700 dark:text-purple-300 font-medium">Total Omset</h3>
                <div className="rounded-full w-6 h-6 flex items-center justify-center bg-purple-500">
                  <DollarSign className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{formatCurrency(totalRevenue)}</p>
            </Card>
            
            {/* Sudah Lunas Card */}
            <Card className="p-4 bg-green-50 border border-green-100 dark:bg-green-900/20 dark:border-green-800/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-green-700 dark:text-green-300 font-medium">Sudah Lunas</h3>
                <div className="rounded-full w-6 h-6 flex items-center justify-center bg-green-500">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-green-800 dark:text-green-200">
                {paidOrdersCount} <span className="text-sm">(Rp {paidRevenue.toLocaleString('id-ID')})</span>
              </p>
            </Card>
            
            {/* Belum Lunas Card */}
            <Card className="p-4 bg-red-50 border border-red-100 dark:bg-red-900/20 dark:border-red-800/40">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-red-700 dark:text-red-300 font-medium">Belum Lunas</h3>
                <div className="rounded-full w-6 h-6 flex items-center justify-center bg-red-500">
                  <X className="w-3 h-3 text-white" />
                </div>
              </div>
              <p className="text-xl font-bold text-red-800 dark:text-red-200">
                {unpaidOrdersCount} <span className="text-sm">(Rp {unpaidRevenue.toLocaleString('id-ID')})</span>
              </p>
            </Card>
          </div>
          
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
                onDeleteOrder={handleOrderDelete}
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
