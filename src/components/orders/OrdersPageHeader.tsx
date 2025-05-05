
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface OrdersPageHeaderProps {
  title: string;
  onAddOrder: () => void;
}

export function OrdersPageHeader({ title, onAddOrder }: OrdersPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button onClick={onAddOrder}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Tambah Pesanan
      </Button>
    </div>
  );
}
