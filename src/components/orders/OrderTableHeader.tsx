
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
        <TableHead className="w-[100px]">Tgl Pesan</TableHead>
        <TableHead className="w-[100px]">Tgl Acara</TableHead>
        <TableHead className="w-[80px]">Countdown</TableHead>
        <TableHead className="w-[150px]">Nama Pemesan</TableHead>
        <TableHead className="w-[150px]">Nama Klien</TableHead>
        <TableHead className="w-[120px]">Vendor</TableHead>
        <TableHead className="w-[120px]">Paket</TableHead>
        <TableHead className="w-[200px]">Addons</TableHead>
        <TableHead className="w-[120px]">Tema</TableHead>
        <TableHead className="w-[150px]">Status Pembayaran</TableHead>
        <TableHead className="w-[150px]">Status Pengerjaan</TableHead>
        <TableHead className="w-[60px]">Aksi</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default OrderTableHeader;
