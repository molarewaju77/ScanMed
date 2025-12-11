import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScanCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  onClick?: () => void;
  className?: string;
}

export function ScanCard({
  title,
  description,
  icon: Icon,
  buttonText,
  onClick,
  className,
}: ScanCardProps) {
  return (
    <div className={cn("medical-card-hover group", className)}>
      <div className="scan-card-icon mb-4 group-hover:scale-110 transition-transform duration-200">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {description}
      </p>
      <Button
        onClick={onClick}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {buttonText}
      </Button>
    </div>
  );
}
