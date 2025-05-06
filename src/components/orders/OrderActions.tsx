
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Order } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderActionsProps {
  order: Order;
  onView: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
  compact?: boolean;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order, onView, onEdit, onDelete, compact = false }) => {
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={compact ? "h-6 w-6" : "h-7 w-7"}
          >
            <MoreHorizontal className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onView(order)} className="cursor-pointer">
            <Eye className="mr-2 h-3.5 w-3.5" />
            <span>View</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(order)} className="cursor-pointer">
            <Edit className="mr-2 h-3.5 w-3.5" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(order)} 
            className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrderActions;
