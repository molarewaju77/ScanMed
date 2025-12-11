import { Users, Scan, MessageSquare, Eye, Smile, User, Activity, Shield } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/admin/StatCard";
import { AnalyticsCharts } from "@/components/admin/AnalyticsCharts";
import { ScanResultCard } from "@/components/dashboard/ScanResultCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers?.toString() || "0",
      change: "Visible users",
      changeType: "neutral" as const,
      icon: Users,
    },
    {
      title: "Active Users (7d)",
      value: stats?.activeUsers?.toString() || "0",
      change: "Logged in recently",
      changeType: "positive" as const,
      icon: Activity,
    },
    {
      title: "Admins & Staff",
      value: ((stats?.roleDistribution?.admin || 0) + (stats?.roleDistribution?.superadmin || 0) + (stats?.roleDistribution?.manager || 0)).toString(),
      change: "Management team",
      changeType: "neutral" as const,
      icon: Shield,
    },
    {
      title: "Workers",
      value: (stats?.roleDistribution?.worker || 0).toString(),
      change: "Operational staff",
      changeType: "neutral" as const,
      icon: User,
    },
  ];

  // Platform-wide scan health averages (Mock data for now)
  const platformScans = {
    eye: { score: 78, updatedAgo: "Real-time" },
    teeth: { score: 72, updatedAgo: "Real-time" },
    skin: { score: 65, updatedAgo: "Real-time" },
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return Shield;
      case 'admin': return Shield;
      case 'manager': return Users;
      case 'worker': return User;
      default: return Smile;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of ScanMed platform performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Access */}
        {stats?.allowedRoles && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Quick Access</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {stats.allowedRoles.map((role: string) => {
                const Icon = getRoleIcon(role);
                return (
                  <a
                    key={role}
                    href={`/admin/users?role=${role}`}
                    className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="p-3 rounded-full bg-primary/10 text-primary mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-medium capitalize">{role}s</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {stats.roleDistribution?.[role] || 0} Total
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Platform Health Scores */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Platform Health Averages</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ScanResultCard
              title="Eye Scan Average"
              score={platformScans.eye.score}
              updatedAgo={platformScans.eye.updatedAgo}
              icon={Eye}
            />
            <ScanResultCard
              title="Teeth Scan Average"
              score={platformScans.teeth.score}
              updatedAgo={platformScans.teeth.updatedAgo}
              icon={Smile}
            />
            <ScanResultCard
              title="Skin Scan Average"
              score={platformScans.skin.score}
              updatedAgo={platformScans.skin.updatedAgo}
              icon={User}
            />
          </div>
        </div>

        {/* Analytics Charts */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Analytics</h2>
          <AnalyticsCharts />
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
