import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ScanResultCardProps {
  title: string;
  score: number;
  updatedAgo: string;
  icon: LucideIcon;
  className?: string;
}

export function ScanResultCard({
  title,
  score,
  updatedAgo,
  icon: Icon,
  className,
}: ScanResultCardProps) {
  const getStatus = (score: number) => {
    if (score >= 70) return { label: "Good", color: "bg-success/10 text-success border-success/20" };
    if (score >= 40) return { label: "Moderate", color: "bg-warning/10 text-warning border-warning/20" };
    return { label: "Critical", color: "bg-destructive/10 text-destructive border-destructive/20" };
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-success";
    if (score >= 40) return "text-warning";
    return "text-destructive";
  };

  const getIconBg = (score: number) => {
    if (score >= 70) return "bg-success/10 text-success";
    if (score >= 40) return "bg-warning/10 text-warning";
    return "bg-destructive/10 text-destructive";
  };

  const status = getStatus(score);

  return (
    <div className={cn("medical-card", className)}>
      {/* Top row: Icon + Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className={cn("p-2.5 rounded-xl", getIconBg(score))}>
          <Icon className="h-5 w-5" />
        </div>
        <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium border", status.color)}>
          {status.label}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      
      {/* Score */}
      <p className={cn("text-3xl font-bold mb-1", getScoreColor(score))}>{score}%</p>
      
      {/* Updated time */}
      <p className="text-xs text-muted-foreground">Updated {updatedAgo}</p>
    </div>
  );
}
