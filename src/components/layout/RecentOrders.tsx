
import { useState, useEffect } from "react";
import { useOrdersData } from "@/hooks/useOrdersData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompactOrdersTable } from "@/components/orders/CompactOrdersTable";
import { motion, AnimatePresence } from "framer-motion";

interface RecentOrdersProps {
  className?: string;
}

export function RecentOrders({ className }: RecentOrdersProps) {
  const currentYear = new Date().getFullYear().toString();
  const { orders } = useOrdersData(currentYear, "Semua Data");
  const [isVisible, setIsVisible] = useState(false);
  
  // Animate in after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 5);

  return (
    <Card className={`shadow-sm rounded-xl border overflow-hidden ${className}`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-wedding-light to-white dark:from-gray-800 dark:to-gray-900">
        <CardTitle className="text-md font-bold text-gray-800 dark:text-white font-poppins">Pesanan Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <CompactOrdersTable
                orders={recentOrders}
                onEditOrder={(order) => console.log("Edit order", order.id)}
                onDeleteOrder={(id) => console.log("Delete order", id)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
