
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Vendor } from "@/types/types";
import { VendorItem } from "./VendorItem";

interface VendorListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorList({ vendors, onEdit, onDelete }: VendorListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Vendor</TableHead>
          <TableHead>Kode</TableHead>
          <TableHead>Warna</TableHead>
          <TableHead>Komisi (%)</TableHead>
          <TableHead className="w-[100px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vendors.map((vendor) => (
          <VendorItem 
            key={vendor.id}
            vendor={vendor} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
        {vendors.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              Belum ada vendor yang terdaftar
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
