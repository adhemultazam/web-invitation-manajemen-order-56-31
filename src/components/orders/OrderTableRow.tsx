
import React from "react";
import { Order } from "@/types/types";
import { format } from "date-fns";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";

interface OrderTableRowProps {
  order: Order;
  orderStatus: string;
  countdownClass: string;
  openEditModal: (order: Order) => void;
  openDeleteModal: (id: string) => void;
}

export function OrderTableRow({
  order,
  orderStatus,
  countdownClass,
  openEditModal,
  openDeleteModal
}: OrderTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{order.id.substring(0, 8)}</TableCell>
      <TableCell>
        {order.orderDate ? format(new Date(order.orderDate), "dd/MM/yyyy") : "-"}
      </TableCell>
      <TableCell className="font-medium">{order.clientName}</TableCell>
      <TableCell>{order.theme || "-"}</TableCell>
      <TableCell>{order.vendor || "-"}</TableCell>
      <TableCell>
        {order.workStatus && (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
            {order.workStatus}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={`${countdownClass} text-xs`}>
          {order.eventDate ? (
            <div className="flex items-center">
              <span className="text-[9px] md:text-xs">{orderStatus || "..."}</span>
            </div>
          ) : (
            "-"
          )}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Badge variant="outline" className={
          order.paymentStatus === "Lunas" 
            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
            : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
        }>
          {order.paymentStatus}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem 
              onClick={() => openEditModal(order)}
              className="flex items-center cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => openDeleteModal(order.id)}
              className="flex items-center text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
