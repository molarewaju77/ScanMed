import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const data = [
  { day: "Mon", adherence: 100 },
  { day: "Tue", adherence: 80 },
  { day: "Wed", adherence: 100 },
  { day: "Thu", adherence: 60 },
  { day: "Fri", adherence: 100 },
  { day: "Sat", adherence: 40 },
  { day: "Sun", adherence: 0 },
];

export function WeeklyAdherenceChart() {
  const getBarColor = (value: number) => {
    if (value >= 80) return "hsl(var(--success))";
    if (value >= 50) return "hsl(var(--warning))";
    return "hsl(var(--muted))";
  };

  return (
    <div className="medical-card">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Weekly Adherence</h2>
        <p className="text-sm text-muted-foreground">Your medication compliance this week</p>
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
                <Cell key={`cell-${index}`} fill={getBarColor(entry.adherence)} />
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
