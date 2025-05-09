
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateSelectionField } from "./DateSelectionField";

interface CustomerInfoFieldsProps {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  clientName: string;
  onClientNameChange: (value: string) => void;
  clientUrl?: string;
  onClientUrlChange?: (value: string) => void;
  orderDate: Date | string;
  onOrderDateChange: (date: Date | undefined) => void;
  eventDate: Date | string | undefined;
  onEventDateChange: (date: Date | undefined) => void;
  showClientUrl?: boolean;
}

export function CustomerInfoFields({
  customerName,
  onCustomerNameChange,
  clientName,
  onClientNameChange,
  clientUrl = "",
  onClientUrlChange,
  orderDate,
  onOrderDateChange,
  eventDate,
  onEventDateChange,
  showClientUrl = true,
}: CustomerInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informasi Pelanggan</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Nama Pemesan</Label>
          <Input
            id="customerName"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            placeholder="Nama pemesan"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="clientName">Nama Mempelai</Label>
          <Input
            id="clientName"
            value={clientName}
            onChange={(e) => onClientNameChange(e.target.value)}
            placeholder="Contoh: Rizki & Putri"
          />
        </div>
        {showClientUrl && onClientUrlChange && (
          <div className="space-y-2">
            <Label htmlFor="clientUrl">URL Undangan</Label>
            <Input
              id="clientUrl"
              value={clientUrl}
              onChange={(e) => onClientUrlChange(e.target.value)}
              placeholder="https://undangandigital.com/nama-mempelai"
            />
          </div>
        )}
      </div>

      {/* Dates */}
      <h3 className="text-lg font-medium">Tanggal</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DateSelectionField
          id="orderDate"
          label="Tanggal Pesanan"
          date={orderDate}
          onDateChange={onOrderDateChange}
          required
        />
        <DateSelectionField
          id="eventDate"
          label="Tanggal Acara"
          date={eventDate}
          onDateChange={onEventDateChange}
        />
      </div>
    </div>
  );
}
