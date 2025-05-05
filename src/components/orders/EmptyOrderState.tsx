
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface EmptyOrderStateProps {
  monthTitle: string;
  onAddOrder: () => void;
}

export function EmptyOrderState({ monthTitle, onAddOrder }: EmptyOrderStateProps) {
  return (
    <div className="bg-muted rounded-lg p-8 text-center">
      <h3 className="text-lg font-medium mb-2">Tidak ada pesanan</h3>
      <p className="text-muted-foreground mb-4">
        Belum ada pesanan untuk {monthTitle} atau tidak ada pesanan yang cocok dengan filter.
      </p>
      <Button variant="outline" onClick={onAddOrder}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Tambah Pesanan Pertama
      </Button>
    </div>
  );
}
