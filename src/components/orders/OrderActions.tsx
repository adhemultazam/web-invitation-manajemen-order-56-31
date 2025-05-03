
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react";
import { Order } from "@/types/types";

interface OrderActionsProps {
  order: Order;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order, onView, onEdit }) => {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onView(order)}
      >
        <Eye className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-wedding-primary hover:text-blue-600 hover:bg-blue-50"
        onClick={() => onEdit(order)}
      >
        <Edit className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default OrderActions;
