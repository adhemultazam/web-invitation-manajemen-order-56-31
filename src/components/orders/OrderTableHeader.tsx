
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrderTableHeader: React.FC = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[30px]">No</TableHead>
        <TableHead className="w-[150px]">Tanggal</TableHead>
        <TableHead className="w-[80px]">Countdown</TableHead>
        <TableHead>Nama</TableHead>
        <TableHead className="w-[110px]">Vendor</TableHead>
        <TableHead className="w-[145px]">Paket/Tema</TableHead>
        <TableHead className="w-[145px]">Fitur</TableHead>
        <TableHead className="w-[120px]">Pembayaran</TableHead>
        <TableHead className="w-[110px]">Status</TableHead>
        <TableHead className="w-[100px] text-right">Aksi</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
