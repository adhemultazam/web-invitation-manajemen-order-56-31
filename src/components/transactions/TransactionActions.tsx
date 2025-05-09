
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Transaction } from "@/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TransactionActionsProps {
  transaction: Transaction;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  compact?: boolean;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({ 
  transaction, 
  onView, 
  onEdit, 
  onDelete, 
  compact = false 
}) => {
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
          <DropdownMenuItem onClick={onView} className="cursor-pointer py-1.5">
            <Eye className="mr-2 h-3.5 w-3.5" />
            <span>Lihat</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer py-1.5">
            <Edit className="mr-2 h-3.5 w-3.5" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onDelete} 
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

export default TransactionActions;
