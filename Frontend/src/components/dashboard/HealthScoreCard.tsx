import { Calendar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthScoreCardProps {
  userName: string;
  initials: string;
  lastScanDate: string;
  totalScans: number;
  healthScore: number | null; // allow null for no scans
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
  const isNotScanned = healthScore === null || totalScans === 0;

  const getScoreStatus = (score: number) => {
    if (score >= 60) return { label: "Good", color: "text-success" };
    if (score >= 41) return { label: "Low", color: "text-warning" };
    return { label: "Critical", color: "text-destructive" };
  };

  const safeStatus = isNotScanned
    ? { label: "Not Scanned", color: "text-muted-foreground" }
    : getScoreStatus(healthScore!);

  const circlePercent = isNotScanned ? 0 : (healthScore! / 100) * 251.2;

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
              <span className="stat-chip">
                <Calendar className="w-3.5 h-3.5" />
                {isNotScanned ? "No scans yet" : `Last scan: ${lastScanDate}`}
              </span>

              <span className="stat-chip">
                <Activity className="w-3.5 h-3.5" />
                {totalScans} scans completed
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Overall Health Score */}
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
                className="text-muted" // background circle
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${circlePercent} 251.2`}
                strokeLinecap="round"
                className={safeStatus.color}
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn("text-2xl font-bold", safeStatus.color)}>
                {isNotScanned ? "—" : `${healthScore}%`}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Overall Health Score
            </p>
            <p className={cn("text-lg font-semibold", safeStatus.color)}>
              {safeStatus.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isNotScanned ? "No scans yet" : "Based on last scans"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
