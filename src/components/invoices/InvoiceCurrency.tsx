
import React from "react";

interface InvoiceCurrencyProps {
  amount: number;
}

export function InvoiceCurrency({ amount }: InvoiceCurrencyProps) {
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

  return <>{formatted}</>;
}
