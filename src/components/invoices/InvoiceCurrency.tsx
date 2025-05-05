
import React from "react";

interface InvoiceCurrencyProps {
  amount: number;
}

export function InvoiceCurrency({ amount }: InvoiceCurrencyProps) {
  // Pastikan nilai amount adalah angka yang valid
  const safeAmount = typeof amount === 'number' && !isNaN(amount) && isFinite(amount) ? amount : 0;
  
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(safeAmount);

  return <>{formatted}</>;
}
