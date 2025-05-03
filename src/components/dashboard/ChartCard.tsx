
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData, ChartDataArray } from "@/types/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ChartCardProps {
  title: string;
  description?: string;
  data: ChartDataArray;
  type: "bar" | "pie";
  colors?: string[];
}

const DEFAULT_COLORS = ['#7484D3', '#8F9AD9', '#AAB0DF', '#C5C9E5', '#E0E2EB'];

export function ChartCard({ title, description, data, type, colors = DEFAULT_COLORS }: ChartCardProps) {
  const renderChart = () => {
    if (type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} tickMargin={10} />
            <YAxis fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }} 
            />
            <Bar dataKey="value" fill="#7484D3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === "pie") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="p-2 pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
