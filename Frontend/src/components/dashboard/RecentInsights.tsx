import { TrendingUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentInsightsProps {
  scanType: string;
  resultSummary: string;
  percentage: number;
  onViewReport?: () => void;
  className?: string;
}

export function RecentInsights({
  scanType,
  resultSummary,
  percentage,
  onViewReport,
  className,
}: RecentInsightsProps) {
  const getPercentageColor = (value: number) => {
    if (value >= 80) return "text-success";
    if (value >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className={cn("medical-card animate-fade-in", className)}>
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Recent Insights</h3>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Last Scan Type</p>
          <p className="font-medium text-foreground">{scanType}</p>
        </div>
        <div className={cn("text-3xl font-bold", getPercentageColor(percentage))}>
          {percentage}%
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {resultSummary}
      </p>

      <Button
        variant="outline"
        className="w-full group"
        onClick={onViewReport}
      >
        View Full Report
        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
