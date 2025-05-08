
import { useState, useEffect, useRef } from "react";
import { Order } from "@/types/types";
import { formatDistance, parseISO } from "date-fns";
import { id } from "date-fns/locale";

export function useOrderTableStatus(orders: Order[]) {
  const [orderStatuses, setOrderStatuses] = useState<{[key: string]: string}>({});
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMounted = useRef(true);

  // Update current time every minute to refresh countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (isMounted.current) {
        setCurrentTime(new Date());
      }
    }, 60000); // Every minute
    
    return () => {
      clearInterval(timer);
      isMounted.current = false;
    };
  }, []);
  
  // Calculate countdown for each order when current time changes
  useEffect(() => {
    if (!isMounted.current) return;
    
    const statuses: {[key: string]: string} = {};
    
    orders.forEach(order => {
      if (order.eventDate) {
        try {
          const eventDate = parseISO(order.eventDate);
          const today = new Date();
          
          // Calculate days difference
          const differenceInDays = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          if (differenceInDays < 0) {
            // Past event
            statuses[order.id] = "Selesai";
          } else if (differenceInDays === 0) {
            // Today
            statuses[order.id] = "Hari ini!";
          } else if (differenceInDays <= 3) {
            // Urgent (3 days or less)
            statuses[order.id] = `${differenceInDays} hari lagi`;
          } else if (differenceInDays <= 14) {
            // Warning (14 days or less)
            statuses[order.id] = `${differenceInDays} hari lagi`;
          } else {
            // Normal
            statuses[order.id] = formatDistance(eventDate, today, { 
              addSuffix: false,
              locale: id 
            });
          }
        } catch (error) {
          console.error("Error parsing event date:", error);
          statuses[order.id] = "Invalid date";
        }
      } else {
        statuses[order.id] = "-";
      }
    });
    
    if (isMounted.current) {
      setOrderStatuses(statuses);
    }
  }, [orders, currentTime]);

  // Helper function to get the appropriate CSS class for the countdown badge
  const getCountdownClass = (orderId: string) => {
    const status = orderStatuses[orderId];
    if (!status || status === "-") return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    
    if (status === "Selesai") return "bg-gray-200 text-gray-700 hover:bg-gray-300";
    if (status === "Hari ini!") return "bg-red-100 text-red-800 hover:bg-red-200";
    
    // Extract the number part from strings like "3 hari lagi"
    const daysMatch = status.match(/^(\d+) hari/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      if (days <= 3) return "bg-red-100 text-red-800 hover:bg-red-200";
      if (days <= 14) return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    }
    
    return "bg-green-100 text-green-800 hover:bg-green-200";
  };

  return {
    orderStatuses,
    getCountdownClass
  };
}
