
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

const OrderActions = ({ order, onView, onEdit, onDelete, compact = false }: OrderActionsProps) => {
  return (
    <div className="flex items-center justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={compact ? "h-6 w-6 hover:bg-muted" : "h-7 w-7 hover:bg-muted"}
          >
            <MoreHorizontal className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[120px]">
          <DropdownMenuItem onClick={() => onView(order)} className="cursor-pointer py-1.5">
            <Eye className="mr-2 h-3.5 w-3.5" />
            <span>Lihat</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(order)} className="cursor-pointer py-1.5">
            <Edit className="mr-2 h-3.5 w-3.5" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onDelete(order)} 
            className="cursor-pointer text-destructive hover:text-destructive focus:text-destructive py-1.5"
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            <span>Hapus</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default OrderActions;
