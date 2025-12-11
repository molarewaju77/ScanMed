import { MainLayout } from "@/components/layout/MainLayout";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { StatCard } from "@/components/admin/StatCard";
import { Eye, Smile, User, TrendingUp } from "lucide-react";

const AdminAnalytics = () => {
  const scanStats = [
    {
      title: "Eye Scans",
      value: "6,893",
      change: "45% of total",
      changeType: "neutral" as const,
      icon: Eye,
    },
    {
      title: "Teeth Scans",
      value: "4,630",
      change: "30% of total",
      changeType: "neutral" as const,
      icon: Smile,
    },
    {
      title: "Skin Scans",
      value: "3,909",
      change: "25% of total",
      changeType: "neutral" as const,
      icon: User,
    },
    {
      title: "Avg. Health Score",
      value: "74%",
      change: "+2% from last month",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Scan Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Detailed analytics and insights about scan usage
          </p>
        </div>

        {/* Scan Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scanStats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <AnalyticsCharts />
      </div>
    </MainLayout>
  );
};

export default AdminAnalytics;
