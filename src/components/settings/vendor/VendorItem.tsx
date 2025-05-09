
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Vendor } from "@/types/types";
import { Edit, Trash2, ExternalLink } from "lucide-react";

interface VendorItemProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: string) => void;
}

export function VendorItem({ vendor, onEdit, onDelete }: VendorItemProps) {
  return (
    <TableRow key={vendor.id}>
      <TableCell className="font-medium">
        <Badge style={{
          backgroundColor: vendor.color || "#6366f1", 
          color: "#fff"
        }}>
          {vendor.name}
        </Badge>
      </TableCell>
      <TableCell>{vendor.code}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div 
            className="h-5 w-5 rounded-full" 
            style={{ backgroundColor: vendor.color || "#6366f1" }}
          ></div>
          <span>{vendor.color || "#6366f1"}</span>
        </div>
      </TableCell>
      <TableCell>
        {vendor.landingPageUrl ? (
          <a 
            href={vendor.landingPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center gap-1"
          >
            <span className="text-xs truncate max-w-[150px]">{vendor.landingPageUrl}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <span className="text-gray-500 text-xs">Tidak ada URL</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(vendor)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(vendor.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
