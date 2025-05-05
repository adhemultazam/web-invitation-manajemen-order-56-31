
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData, ChartDataArray, MultiBarChartData } from "@/types/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from "recharts";

interface ChartCardProps {
  title: string;
  description?: string;
  data: ChartDataArray | MultiBarChartData[];
  type: "bar" | "pie" | "multiBar" | "line";
  colors?: string[];
  isCurrency?: boolean;
  barKeys?: {key: string, color: string}[];
  icon?: React.ReactNode;
}

const DEFAULT_COLORS = ['#9A84FF', '#A990FF', '#B89CFF', '#C7A8FF', '#D5B4FF'];
const DEFAULT_BAR_COLORS = {
  paid: '#9A84FF',
  pending: '#F97316'
};

const formatToRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export function ChartCard({ 
  title, 
  description, 
  data, 
  type, 
  colors = DEFAULT_COLORS, 
  isCurrency = false,
  barKeys = [],
  icon
}: ChartCardProps) {
  const renderChart = () => {
    if (type === "line" || type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          {type === "line" ? (
            <LineChart data={data as ChartDataArray} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickMargin={10} />
              <YAxis 
                fontSize={12} 
                tickFormatter={(value) => isCurrency ? `${value / 1000000}jt` : value.toString()}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                }} 
                formatter={(value: any) => {
                  return [isCurrency ? formatToRupiah(value) : value, ''];
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors[0]} 
                strokeWidth={3} 
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ fill: colors[0], strokeWidth: 0, r: 6 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data as ChartDataArray} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tickMargin={10} />
              <YAxis 
                fontSize={12} 
                tickFormatter={(value) => isCurrency ? `${value / 1000000}jt` : value.toString()}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "white", 
                  border: "1px solid #f0f0f0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
                }} 
                formatter={(value: any) => {
                  return [isCurrency ? formatToRupiah(value) : value, ''];
                }}
              />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      );
    }

    if (type === "multiBar") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data as MultiBarChartData[]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} tickMargin={10} />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => isCurrency ? `${Math.round(value / 1000000)}jt` : value.toString()}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
              }} 
              formatter={(value: any, name: string) => {
                return [isCurrency ? formatToRupiah(value) : value, name === 'paid' ? 'Lunas' : 'Pending'];
              }}
            />
            <Legend formatter={(value) => value === 'paid' ? 'Lunas' : 'Pending'} />
            {barKeys.map((barKey, index) => (
              <Bar 
                key={barKey.key} 
                dataKey={barKey.key} 
                name={barKey.key}
                fill={barKey.color} 
                radius={[4, 4, 0, 0]} 
                stackId={barKey.key === "pending" ? "stack" : undefined}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === "pie") {
      return (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data as ChartDataArray}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {(data as ChartDataArray).map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
              }} 
              formatter={(value: any) => {
                return [isCurrency ? formatToRupiah(value) : value, ''];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <Card className="overflow-hidden shadow-card border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-5 px-5">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {icon && <div className="text-wedding-primary">{icon}</div>}
      </CardHeader>
      <CardContent className="p-2 pt-1">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
