
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartData, ChartDataArray, MultiBarChartData } from "@/types/types";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  AreaChart, 
  Area
} from "recharts";

interface ChartCardProps {
  title: string;
  description?: string;
  data: ChartDataArray | MultiBarChartData[];
  type: "bar" | "pie" | "area" | "multiBar";
  colors?: string[];
  isCurrency?: boolean;
  barKeys?: {key: string, color: string}[];
  icon?: React.ReactNode;
  height?: number;
  showValues?: boolean;
}

const DEFAULT_COLORS = ['#38B2AC', '#4FD1C5', '#81E6D9', '#B2F5EA', '#E6FFFA'];
const DEFAULT_BAR_COLORS = {
  paid: '#38A169',
  pending: '#E53E3E'
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
  icon,
  height = 300,
  showValues = false
}: ChartCardProps) {
  const renderChart = () => {
    if (type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data as ChartDataArray} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} tickMargin={10} />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => isCurrency ? `${value / 1000000}jt` : value.toString()}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }} 
              formatter={(value: any) => {
                return [isCurrency ? formatToRupiah(value) : value, ''];
              }}
            />
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === "area") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data as ChartDataArray} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} tickMargin={10} />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => isCurrency ? `${Math.round(value / 1000000)}jt` : value.toString()}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }} 
              formatter={(value: any) => {
                return [isCurrency ? formatToRupiah(value) : value, ''];
              }}
              labelStyle={{ fontWeight: 'bold' }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
            
            {showValues && data && (data as ChartDataArray).map((entry, index) => (
              entry.value > 0 && (
                <text
                  key={`value-${index}`}
                  x={(100 / (data.length - 1) * index) + '%'}
                  y={(100 - (entry.value / Math.max(...(data as ChartDataArray).map(d => d.value)) * 100) * 0.7) + '%'}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="#333"
                >
                  {isCurrency ? formatToRupiah(entry.value).replace('Rp', '') : entry.value}
                </text>
              )
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (type === "multiBar") {
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data as MultiBarChartData[]} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" fontSize={12} tickMargin={10} />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => isCurrency ? `${Math.round(value / 1000000)}jt` : value.toString()}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }} 
              formatter={(value: any, name: string) => {
                return [isCurrency ? formatToRupiah(value) : value, name === 'paid' ? 'Lunas' : 'Pending'];
              }}
            />
            <Legend formatter={(value) => value === 'paid' ? 'Lunas' : 'Pending'} />
            {barKeys.map((barKey) => (
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
        <ResponsiveContainer width="100%" height={height}>
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data as ChartDataArray}
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
              {(data as ChartDataArray).map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "white", 
                border: "1px solid #f0f0f0",
                borderRadius: "8px",
              }} 
              formatter={(value: any) => {
                return [isCurrency ? formatToRupiah(value) : value, ''];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <>
      {(title || description) && (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </CardHeader>
      )}
      <CardContent className={`${(title || description) ? 'pt-0' : 'pt-6'} px-2`}>
        {renderChart()}
      </CardContent>
    </>
  );
}
