
import { AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type RiskLevel = "high" | "medium" | "low" | "safe";

interface RiskAlertCardProps {
  title: string;
  description: string;
  level: RiskLevel;
  time: string;
  actionText?: string;
  onAction?: () => void;
}

export function RiskAlertCard({
  title,
  description,
  level,
  time,
  actionText = "View Details",
  onAction,
}: RiskAlertCardProps) {
  return (
    <div className={cn("guardian-risk-card", `risk-${level}`)}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <p className="mt-2 text-sm">{description}</p>
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "text-xs",
            level === "high" && "border-risk-high/30 hover:bg-risk-high/20",
            level === "medium" && "border-risk-medium/30 hover:bg-risk-medium/20",
            level === "low" && "border-risk-low/30 hover:bg-risk-low/20",
            level === "safe" && "border-risk-safe/30 hover:bg-risk-safe/20"
          )}
          onClick={onAction}
        >
          {actionText}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
