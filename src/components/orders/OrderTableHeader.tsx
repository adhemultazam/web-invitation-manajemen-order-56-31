
import React from "react";
import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const OrderTableHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted">
      <TableRow>
        <TableHead className="w-[50px]">No</TableHead>
        <TableHead className="w-[100px]">Tgl Pesan</TableHead>
        <TableHead className="w-[100px]">Tgl Acara</TableHead>
        <TableHead className="w-[100px]">Countdown</TableHead>
        <TableHead className="w-[200px]">Client</TableHead>
        <TableHead className="w-[150px]">Vendor</TableHead>
        <TableHead className="w-[180px]">Paket & Tema</TableHead>
        <TableHead className="w-[180px]">Addons</TableHead>
        <TableHead className="w-[130px]">Pembayaran</TableHead>
        <TableHead className="w-[150px]">Status</TableHead>
        <TableHead className="w-[100px] text-right">Aksi</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
