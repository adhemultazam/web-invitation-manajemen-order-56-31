
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClockIcon } from "lucide-react";

export function OrderTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-muted">
        <TableHead className="w-[80px]">ID</TableHead>
        <TableHead>Tanggal</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Tema</TableHead>
        <TableHead>Vendor</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>
          <div className="flex items-center">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>Acara</span>
          </div>
        </TableHead>
        <TableHead className="text-right">Pembayaran</TableHead>
        <TableHead className="w-[80px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
