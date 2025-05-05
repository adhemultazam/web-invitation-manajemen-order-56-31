
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
  description?: string;
  change?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  iconBg = "#4F46E5", 
  description, 
  change 
}: StatCardProps) {
  const isPositive = change && change > 0;
  const changeValue = change ? Math.abs(change) : null;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center" 
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>
        </div>
        
        <div className="text-2xl sm:text-3xl font-bold">{value}</div>
        
        {(changeValue !== null) && (
          <div className="flex items-center mt-2">
            <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm font-medium">{changeValue}%</span>
            </div>
            {description && (
              <span className="text-xs text-muted-foreground ml-2">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
