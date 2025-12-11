import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

interface AnalyticsChartsProps {
  className?: string;
}

const dailyScansData = [
  { day: "Mon", scans: 45 },
  { day: "Tue", scans: 62 },
  { day: "Wed", scans: 38 },
  { day: "Thu", scans: 78 },
  { day: "Fri", scans: 56 },
  { day: "Sat", scans: 34 },
  { day: "Sun", scans: 42 },
];

const scanTypeData = [
  { name: "Eye Scan", value: 45, color: "#0EA5E9" },
  { name: "Teeth Scan", value: 30, color: "#22C55E" },
  { name: "Skin Scan", value: 25, color: "#F59E0B" },
];

const userGrowthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 180 },
  { month: "Mar", users: 250 },
  { month: "Apr", users: 340 },
  { month: "May", users: 420 },
  { month: "Jun", users: 510 },
];

export function AnalyticsCharts({ className }: AnalyticsChartsProps) {
  return (
    <div className={cn("grid lg:grid-cols-2 gap-6", className)}>
      {/* Daily Scans */}
      <div className="medical-card">
        <h3 className="font-semibold text-foreground mb-4">Daily Scans</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyScansData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="scans"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scan Type Distribution */}
      <div className="medical-card">
        <h3 className="font-semibold text-foreground mb-4">Scan Type Distribution</h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={scanTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {scanTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {scanTypeData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-muted-foreground">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* User Growth */}
      <div className="medical-card lg:col-span-2">
        <h3 className="font-semibold text-foreground mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--success))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
