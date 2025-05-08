
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrdersData } from "@/hooks/useOrdersData";
import { useVendorsData } from "@/hooks/useVendorsData";
import { useOrderResources } from "@/hooks/useOrderResources";
import { getMonthTranslation } from "@/utils/monthlyOrdersUtils";
import { MonthlyOrdersHeader } from "@/components/orders/MonthlyOrdersHeader";
import { MonthlyOrdersContent } from "@/components/orders/MonthlyOrdersContent";

export default function MonthlyOrders() {
  const { month } = useParams<{ month: string }>();
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string>(month ? getMonthTranslation(month) : "");
  
  // Fetching data
  const { orders, isLoading, addOrder, editOrder, deleteOrder } = useOrdersData(
    selectedYear === "Semua Data" ? undefined : selectedYear, 
    month && selectedMonth !== "Semua Data" ? getMonthTranslation(month) : undefined
  );
  const { vendors } = useVendorsData();
  const { workStatuses, addons, themes, packages } = useOrderResources();
  
  // Event handler for opening add modal
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const handleOpenAddModal = () => setIsAddOrderModalOpen(true);
  
  return (
    <div className="space-y-6">
      <MonthlyOrdersHeader
        month={month}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onAddOrder={handleOpenAddModal}
      />
      
      <MonthlyOrdersContent
        orders={orders}
        workStatuses={workStatuses}
        vendors={vendors}
        themes={themes}
        packages={packages}
        addons={addons}
        isLoading={isLoading}
        addOrder={addOrder}
        editOrder={editOrder}
        deleteOrder={deleteOrder}
      />
    </div>
  );
}
