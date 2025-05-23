
import { formatCurrency } from "@/lib/utils";

interface InvoiceCurrencyProps {
  amount: number;
}

export function InvoiceCurrency({ amount }: InvoiceCurrencyProps) {
  // Ensure amount is a valid number
  const safeAmount = typeof amount === 'number' && !isNaN(amount) && isFinite(amount) ? amount : 0;
  
  return <>{formatCurrency(safeAmount)}</>;
}
