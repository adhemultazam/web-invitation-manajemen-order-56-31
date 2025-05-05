
import { useState, useEffect } from "react";
import { Order } from "@/types/types";

export const useOrdersData = (selectedYear?: string, selectedMonth?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadOrdersData = () => {
      setIsLoading(true);

      try {
        const allOrders: Order[] = [];
        const months = [
          'januari', 'februari', 'maret', 'april', 'mei', 'juni',
          'juli', 'agustus', 'september', 'oktober', 'november', 'desember'
        ];

        // Jika bulan spesifik dipilih, hanya ambil data bulan tersebut
        if (selectedMonth && selectedMonth !== "Semua Data") {
          const monthIndex = months.findIndex(m => m.toLowerCase() === selectedMonth.toLowerCase());
          if (monthIndex !== -1) {
            const monthKey = `orders_${months[monthIndex]}`;
            const monthData = localStorage.getItem(monthKey);
            if (monthData) {
              const parsedData: Order[] = JSON.parse(monthData);

              // Filter berdasarkan tahun jika diperlukan
              const filteredData = selectedYear && selectedYear !== "Semua Data"
                ? parsedData.filter(order => {
                    const orderYear = new Date(order.orderDate).getFullYear().toString();
                    return orderYear === selectedYear;
                  })
                : parsedData;

              allOrders.push(...filteredData);
            }
          }
        } else {
          // Ambil data dari semua bulan
          months.forEach(month => {
            const monthKey = `orders_${month}`;
            const monthData = localStorage.getItem(monthKey);
            if (monthData) {
              const parsedData: Order[] = JSON.parse(monthData);

              // Filter berdasarkan tahun jika diperlukan
              const filteredData = selectedYear && selectedYear !== "Semua Data"
                ? parsedData.filter(order => {
                    const orderYear = new Date(order.orderDate).getFullYear().toString();
                    return orderYear === selectedYear;
                  })
                : parsedData;

              allOrders.push(...filteredData);
            }
          });
        }
        
        console.info(`Loaded ${allOrders.length} orders from ${selectedMonth || "all"} months`);
        setOrders(allOrders);
      } catch (error) {
        console.error("Error loading orders data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrdersData();
  }, [selectedYear, selectedMonth]);

  return { orders, isLoading };
};
