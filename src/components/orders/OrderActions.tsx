
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Order } from "@/types/types";

interface OrderActionsProps {
  order: Order;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  compact?: boolean;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order, onView, onEdit, onDelete, compact = false }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className={compact ? "h-6 w-6" : "h-7 w-7"}
        onClick={() => onView(order)}
      >
        <Eye className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`${compact ? "h-6 w-6" : "h-7 w-7"} text-wedding-primary hover:text-blue-600 hover:bg-blue-50`}
        onClick={() => onEdit(order)}
      >
        <Edit className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`${compact ? "h-6 w-6" : "h-7 w-7"} text-red-500 hover:text-red-600 hover:bg-red-50`}
        onClick={() => onDelete(order)}
      >
        <Trash2 className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
      </Button>
    </div>
  );
};

export default OrderActions;
