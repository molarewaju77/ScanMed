import { MainLayout } from "@/components/layout/MainLayout";
import { HealthScoreCard } from "@/components/dashboard/HealthScoreCard";
import { ScanResultCard } from "@/components/dashboard/ScanResultCard";
import {
  Eye,
  Smile,
  User,
  Scan,
  MessageCircle,
  Pill,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const Index = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [userInitials, setUserInitials] = useState("U");
  const [loading, setLoading] = useState(true);
  const [scanResults, setScanResults] = useState({
    eye: { score: 0, updatedAgo: "Not scanned yet" },
    teeth: { score: 0, updatedAgo: "Not scanned yet" },
    skin: { score: 0, updatedAgo: "Not scanned yet" },
  });
  const [overallScore, setOverallScore] = useState(0);
  const [totalScans, setTotalScans] = useState(0);
  const [lastScanDate, setLastScanDate] = useState("No scans yet");

  useEffect(() => {
    // Get user name from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const name = user.name || user.fullName || "User";
        setUserName(name);
        setUserInitials(
          name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase()
        );
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/health-scans");
      if (response.data.success) {
        const scans = response.data.scans;
        setTotalScans(scans.length);

        if (scans.length > 0) {
          setLastScanDate(new Date(scans[0].createdAt).toLocaleDateString());

          // Process scans to get latest for each type
          const latestScans: any = {
            eye: scans.find((s: any) => s.scanType === "eyes"),
            teeth: scans.find((s: any) => s.scanType === "teeth"),
            skin: scans.find((s: any) => s.scanType === "skin"), // Assuming 'skin' is the type, frontend used 'skin' in mock
          };

          const newResults = {
            eye: {
              score: latestScans.eye
                ? latestScans.eye.status === "success"
                  ? 90
                  : 50
                : 0, // Mock score based on status as backend might not return score yet
              updatedAgo: latestScans.eye
                ? getTimeAgo(new Date(latestScans.eye.createdAt))
                : "Not scanned yet",
            },
            teeth: {
              score: latestScans.teeth
                ? latestScans.teeth.status === "success"
                  ? 85
                  : 45
                : 0,
              updatedAgo: latestScans.teeth
                ? getTimeAgo(new Date(latestScans.teeth.createdAt))
                : "Not scanned yet",
            },
            skin: {
              score: latestScans.skin
                ? latestScans.skin.status === "success"
                  ? 95
                  : 60
                : 0,
              updatedAgo: latestScans.skin
                ? getTimeAgo(new Date(latestScans.skin.createdAt))
                : "Not scanned yet",
            },
          };
          setScanResults(newResults);

          // Calculate overall score
          const scores = Object.values(newResults)
            .map((r) => r.score)
            .filter((s) => s > 0);
          const avgScore =
            scores.length > 0
              ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
              : 0;
          setOverallScore(avgScore);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const recommendations = [
    {
      icon: Eye,
      title: "Eye Care",
      description: "Consider reducing screen time and using blue light glasses",
    },
    {
      icon: Smile,
      title: "Dental Health",
      description: "Schedule a professional cleaning within the next 2 weeks",
    },
  ];

  const quickActions = [
    { label: "Start New Scan", icon: Scan, path: "/scan" },
    { label: "Open Chat", icon: MessageCircle, path: "/chat" },
    { label: "Med Buddy", icon: Pill, path: "/med-buddy" },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Monitor your health and start new scans
          </p>
        </div>

        {/* Health Score Card */}
        <HealthScoreCard
          userName={userName}
          initials={userInitials}
          lastScanDate={lastScanDate}
          totalScans={totalScans}
          healthScore={overallScore}
        />

        {/* AI Health Scanner Card */}
        <div className="medical-card flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-accent">
            <Scan className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              AI Health Scanner
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Get instant AI-powered insights about your eyes, teeth, and skin
              health. Early detection can make all the difference.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-accent text-primary rounded-full border border-primary/20">
                <Sparkles className="h-3 w-3" /> AI Powered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-success border border-success/30 rounded-full">
                Instant Results
              </span>
            </div>
          </div>
          <Button
            onClick={() => navigate("/scan")}
            className="gradient-medical text-primary-foreground shrink-0"
          >
            Start Scan
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Recent Scan Results */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Recent Scan Results
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <ScanResultCard
              title="Eye Scan"
              score={scanResults.eye.score}
              updatedAgo={scanResults.eye.updatedAgo}
              icon={Eye}
            />
            <ScanResultCard
              title="Teeth Scan"
              score={scanResults.teeth.score}
              updatedAgo={scanResults.teeth.updatedAgo}
              icon={Smile}
            />
            <ScanResultCard
              title="Face / Skin Scan"
              score={scanResults.skin.score}
              updatedAgo={scanResults.skin.updatedAgo}
              icon={User}
            />
          </div>
        </div>

        {/* Self Care + Quick Actions (2 columns) */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Self Care Recommendations */}
          <div className="lg:col-span-8 col-span-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Self Care Recommendations
            </h2>
            <div className="medical-card space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 last:pb-0 border-b border-border last:border-0"
                >
                  <div className="p-2.5 rounded-xl bg-accent shrink-0">
                    <rec.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-4 col-span-12">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Quick Actions
            </h2>
            <div className="medical-card space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-accent transition-colors group"
                >
                  <div className="p-2.5 rounded-xl bg-accent group-hover:bg-primary/10 transition-colors">
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
