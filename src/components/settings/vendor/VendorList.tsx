
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
        <TableRow className="bg-muted/50">
          <TableHead className="px-4 py-3 text-xs font-medium">Nama Vendor</TableHead>
          <TableHead className="px-4 py-3 text-xs font-medium">Kode</TableHead>
          <TableHead className="px-4 py-3 text-xs font-medium">Warna</TableHead>
          <TableHead className="px-4 py-3 text-xs font-medium">URL Landing Page</TableHead>
          <TableHead className="w-[100px] px-4 py-3 text-xs font-medium">Aksi</TableHead>
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
