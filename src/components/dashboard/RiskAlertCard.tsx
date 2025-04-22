
import { AlertTriangle, ExternalLink, Edit, Trash, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export type RiskLevel = "high" | "medium" | "low" | "safe";

interface RiskAlertCardProps {
  id?: string;
  title: string;
  description: string;
  level: RiskLevel;
  time: string;
  acknowledged?: boolean;
  source?: string;
  actionText?: string;
  onAction?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function RiskAlertCard({
  id,
  title,
  description,
  level,
  time,
  acknowledged,
  source,
  actionText = "View Details",
  onAction,
  onEdit,
  onDelete,
}: RiskAlertCardProps) {
  return (
    <div className={cn(
      "guardian-risk-card", 
      `risk-${level}`,
      acknowledged && "opacity-70"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <AlertTriangle className={cn(
            "h-5 w-5 mr-2",
            level === "high" && "text-risk-high",
            level === "medium" && "text-risk-medium",
            level === "low" && "text-risk-low",
            level === "safe" && "text-risk-safe"
          )} />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">{time}</span>
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={onDelete}
                      className="text-risk-high focus:text-risk-high"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm">{description}</p>
      {source && (
        <div className="mt-1">
          <span className="text-xs text-muted-foreground">Source: {source}</span>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "text-xs",
            level === "high" && "border-risk-high/30 hover:bg-risk-high/20",
            level === "medium" && "border-risk-medium/30 hover:bg-risk-medium/20",
            level === "low" && "border-risk-low/30 hover:bg-risk-low/20",
            level === "safe" && "border-risk-safe/30 hover:bg-risk-safe/20",
            acknowledged && "opacity-50"
          )}
          onClick={onAction}
          disabled={acknowledged && actionText === "Acknowledge"}
        >
          {actionText}
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
