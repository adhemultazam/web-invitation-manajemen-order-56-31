
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrderTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50 dark:bg-gray-800/50">
        <TableHead className="w-[30px] py-3 px-4 text-xs font-medium">No</TableHead>
        <TableHead className="w-[150px] py-3 px-4 text-xs font-medium">Tanggal</TableHead>
        <TableHead className="w-[80px] py-3 px-4 text-xs font-medium">Countdown</TableHead>
        <TableHead className="py-3 px-4 text-xs font-medium">Nama</TableHead>
        <TableHead className="w-[110px] py-3 px-4 text-xs font-medium">Vendor</TableHead>
        <TableHead className="w-[145px] py-3 px-4 text-xs font-medium">Paket/Tema</TableHead>
        <TableHead className="w-[145px] py-3 px-4 text-xs font-medium">Fitur</TableHead>
        <TableHead className="w-[120px] py-3 px-4 text-xs font-medium">Pembayaran</TableHead>
        <TableHead className="w-[110px] py-3 px-4 text-xs font-medium">Status</TableHead>
        <TableHead className="w-[100px] text-right py-3 px-4 text-xs font-medium">Aksi</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
