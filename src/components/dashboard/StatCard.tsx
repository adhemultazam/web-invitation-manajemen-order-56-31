
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  type?: "default" | "success" | "warning" | "danger";
}

export function StatCard({ title, value, icon, description, type = "default" }: StatCardProps) {
  // Menentukan warna icon berdasarkan tipe
  const getIconColorClass = () => {
    switch (type) {
      case "success":
        return "text-green-500";
      case "warning":
        return "text-amber-500";
      case "danger":
        return "text-red-500";
      default:
        return "text-wedding-primary";
    }
  };

  // Format the value if it's a large number to prevent overflow
  const formatValue = () => {
    // If it's already a string (pre-formatted), return as is
    if (typeof value === 'string') {
      return value;
    }
    
    // For numeric values, apply formatting
    if (typeof value === 'number') {
      // Format to Indonesian currency if the value is over 1000
      if (value >= 1000) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      } else {
        return value.toString();
      }
    }
    
    // Fallback for unexpected types
    return String(value);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`h-5 w-5 ${getIconColorClass()}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {formatValue()}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
