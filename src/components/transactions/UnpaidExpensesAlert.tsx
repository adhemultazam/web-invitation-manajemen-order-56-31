
import { FC } from "react";
import { Transaction } from "@/types/types";
import { AlertTriangle, Check } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface UnpaidExpensesAlertProps {
  unpaidExpenses: Transaction[];
  onMarkAsPaid: (id: string) => void;
  showAlert: boolean;
}

export const UnpaidExpensesAlert: FC<UnpaidExpensesAlertProps> = ({
  unpaidExpenses,
  onMarkAsPaid,
  showAlert,
}) => {
  if (!showAlert || unpaidExpenses.length === 0) {
    return null;
  }

  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200 py-2">
      <AlertTriangle className="h-3.5 w-3.5" />
      <AlertTitle className="text-sm font-medium">Pengingat Pengeluaran Tetap</AlertTitle>
      <AlertDescription className="text-xs">
        <p className="mb-1">Anda memiliki {unpaidExpenses.length} pengeluaran tetap yang belum dibayar bulan ini:</p>
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {unpaidExpenses.slice(0, 5).map(expense => (
            <Badge key={expense.id} variant="outline" className="flex items-center gap-1 cursor-pointer border-amber-200 bg-amber-50 hover:bg-amber-100 py-0 text-xs" 
              onClick={() => onMarkAsPaid(expense.id)}>
              <span>{expense.category}</span>
              <span className="font-semibold">{formatCurrency(expense.budget || 0)}</span>
              <Check className="h-2.5 w-2.5 ml-0.5" />
            </Badge>
          ))}
          {unpaidExpenses.length > 5 && (
            <Badge variant="outline" className="border-amber-200 bg-amber-50 py-0 text-xs">
              +{unpaidExpenses.length - 5} lainnya
            </Badge>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
