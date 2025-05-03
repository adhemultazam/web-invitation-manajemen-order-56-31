
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentStatusBadgeProps {
  status: string;
  amount: number;
  isUpdating: boolean;
  onToggle: () => void;
  formatCurrency: (amount: number) => string;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  amount,
  isUpdating,
  onToggle,
  formatCurrency,
}) => {
  const getPaymentStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'lunas':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      default:
        return 'bg-red-500';
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        variant="ghost"
        size="sm"
        className="p-0 h-6 justify-start"
        onClick={onToggle}
      >
        <Badge className={getPaymentStatusColor(status)}>
          {isUpdating ? (
            <span className="animate-pulse">Menyimpan...</span>
          ) : (
            status
          )}
        </Badge>
      </Button>
      <span className="text-xs font-mono mt-1">
        {formatCurrency(amount)}
      </span>
    </div>
  );
};

export default PaymentStatusBadge;
