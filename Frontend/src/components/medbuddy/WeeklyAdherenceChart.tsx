import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { useState, useEffect } from "react";
import api from "@/lib/api";

export function WeeklyAdherenceChart() {
  const [data, setData] = useState([
    { day: "Mon", adherence: 0 },
    { day: "Tue", adherence: 0 },
    { day: "Wed", adherence: 0 },
    { day: "Thu", adherence: 0 },
    { day: "Fri", adherence: 0 },
    { day: "Sat", adherence: 0 },
    { day: "Sun", adherence: 0 },
  ]);

  useEffect(() => {
    fetchAdherence();
    // Refresh periodically or listen to events if possible
    const interval = setInterval(fetchAdherence, 10000); // Poll every 10s to reflect "Take" actions
    return () => clearInterval(interval);
  }, []);

  const fetchAdherence = async () => {
    try {
      const res = await api.get("/medications/adherence");
      if (res.data.success && res.data.adherence) {
        setData(res.data.adherence);
      }
    } catch (error) {
      console.error("Failed to fetch adherence", error);
    }
  };

  const getBarColor = (value: number) => {
    if (value >= 80) return "hsl(var(--success))";
    if (value >= 50) return "hsl(var(--warning))";
    return "hsl(var(--muted))";
  };

  return (
    <div className="medical-card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Weekly Adherence</h2>
        <p className="text-sm text-muted-foreground">Your medication compliance over the last 7 days</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Bar dataKey="adherence" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.adherence || 0)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-success" />
          <span>80%+ Taken</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-warning" />
          <span>50-79%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>Below 50%</span>
        </div>
      </div>
    </div>
  );
}
