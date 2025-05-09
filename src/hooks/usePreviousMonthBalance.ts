
import { useState, useEffect } from "react";
import { getPreviousMonth } from "@/utils/monthUtils";

export function usePreviousMonthBalance(year: string, month: string) {
  const [previousMonthBalance, setPreviousMonthBalance] = useState<number>(0);
  
  // Helper to get previous month's storage key
  const getPreviousMonthStorageKey = (): string => {
    if (month === "Semua Data" || year === "Semua Data") {
      return ""; // Cannot determine previous month if viewing all data
    }
    
    const { month: prevMonth, year: prevYear } = getPreviousMonth(month, year);
    return `orders_${prevMonth.toLowerCase()}`;
  };

  // Load previous month's balance from orders
  useEffect(() => {
    try {
      const prevMonthKey = getPreviousMonthStorageKey();
      if (prevMonthKey) {
        console.log(`Looking for previous month data with key: ${prevMonthKey}`);
        const ordersData = localStorage.getItem(prevMonthKey);
        if (ordersData) {
          try {
            const orders = JSON.parse(ordersData);
            
            // Calculate total from paid orders only (with status "Lunas")
            const paidTotal = orders
              .filter((order: any) => order.paymentStatus === "Lunas")
              .reduce((sum: number, order: any) => {
                // Clean and parse the payment amount
                let amount = 0;
                if (typeof order.paymentAmount === 'number') {
                  amount = order.paymentAmount;
                } else if (typeof order.paymentAmount === 'string') {
                  // Remove non-numeric characters except decimal point
                  const cleanAmount = String(order.paymentAmount).replace(/[^\d.-]/g, '');
                  amount = parseFloat(cleanAmount || '0');
                }
                
                return sum + (isNaN(amount) ? 0 : amount);
              }, 0);
            
            console.log(`Previous month (${prevMonthKey}) paid orders total: ${paidTotal}`);
            setPreviousMonthBalance(paidTotal);
          } catch (error) {
            console.error("Error parsing previous month orders:", error);
            setPreviousMonthBalance(0);
          }
        } else {
          console.log(`No orders data found for previous month (${prevMonthKey})`);
          setPreviousMonthBalance(0);
        }
      } else {
        setPreviousMonthBalance(0);
      }
    } catch (error) {
      console.error("Error loading previous month balance:", error);
      setPreviousMonthBalance(0);
    }
  }, [year, month]);

  return previousMonthBalance;
}
