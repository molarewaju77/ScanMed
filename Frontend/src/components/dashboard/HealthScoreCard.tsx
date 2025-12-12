import { Calendar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthScoreCardProps {
  userName: string;
  initials: string;
  lastScanDate: string | null;
  totalScans: number;
  healthScore: number | null;
  className?: string;
}

export function HealthScoreCard({
  userName,
  initials,
  lastScanDate,
  totalScans,
  healthScore,
  className,
}: HealthScoreCardProps) {
  const hasScans = totalScans > 0;

  const getScoreStatus = (score: number) => {
    if (score >= 70) return { label: "Good", color: "text-success" };
    if (score >= 40) return { label: "Moderate", color: "text-warning" };
    return { label: "Critical", color: "text-destructive" };
  };

  const status = healthScore ? getScoreStatus(healthScore) : null;

  return (
    <div className={cn("medical-card animate-fade-in", className)}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side - User info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-medical flex items-center justify-center text-primary-foreground font-bold text-xl">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Welcome back, {userName.split(" ")[0]}!
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {hasScans ? (
                <>
                  <span className="stat-chip">
                    <Calendar className="w-3.5 h-3.5" />
                    Last scan: {lastScanDate || "N/A"}
                  </span>
                  <span className="stat-chip">
                    <Activity className="w-3.5 h-3.5" />
                    {totalScans} scan{totalScans !== 1 ? "s" : ""} completed
                  </span>
                </>
              ) : (
                <span className="stat-chip text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  No scans completed yet
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Overall Health Score (only show if user has scans) */}
        {hasScans && healthScore !== null && (
          <div className="flex items-center gap-4 lg:border-l lg:border-border lg:pl-8">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(healthScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  className={status?.color || "text-muted"}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={cn("text-2xl font-bold", status?.color)}>
                  {healthScore}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Overall Health Score
              </p>
              <p className={cn("text-lg font-semibold", status?.color)}>
                {status?.label || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on last scans
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
