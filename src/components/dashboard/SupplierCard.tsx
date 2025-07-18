
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, HelpCircle, MoreVertical, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export type SupplierComplianceStatus = "verified" | "pending" | "breached";
export type SupplierTrustLevel = "verified" | "gold" | "platinum";

interface SupplierCardProps {
  id: string;
  name: string;
  country: string;
  category: string;
  riskScore: number;
  complianceStatus: SupplierComplianceStatus;
  trustLevel?: SupplierTrustLevel;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function SupplierCard({
  id,
  name,
  country,
  category,
  riskScore,
  complianceStatus,
  trustLevel,
  image,
  onEdit,
  onDelete,
  onView,
}: SupplierCardProps) {
  const getRiskColor = (score: number) => {
    if (score < 30) return "text-risk-safe";
    if (score < 60) return "text-risk-low";
    if (score < 80) return "text-risk-medium";
    return "text-risk-high";
  };

  const getComplianceIcon = (status: SupplierComplianceStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-risk-safe" />;
      case "pending":
        return <HelpCircle className="h-4 w-4 text-risk-medium" />;
      case "breached":
        return <AlertCircle className="h-4 w-4 text-risk-high" />;
    }
  };

  const getTrustLevelColor = (level?: SupplierTrustLevel) => {
    switch (level) {
      case "platinum":
        return "bg-purple-200 text-purple-800";
      case "gold":
        return "bg-amber-100 text-amber-800";
      case "verified":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="guardian-card p-4 relative">
      {/* Actions dropdown */}
      <div className="absolute top-2 right-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onView && (
              <DropdownMenuItem onClick={onView}>View Details</DropdownMenuItem>
            )}
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
      </div>

      <div className="flex items-center space-x-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {name.substring(0, 1)}
          </div>
        )}
        <div>
          <div className="flex items-center">
            <h3 className="font-semibold">{name}</h3>
            {trustLevel && (
              <Badge className={cn("ml-2", getTrustLevelColor(trustLevel))}>
                {trustLevel}
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{country}</span>
            <span className="mx-1">•</span>
            <span>{category}</span>
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium">Risk Score</span>
          <span className={cn("text-sm font-bold", getRiskColor(riskScore))}>
            {riskScore}%
          </span>
        </div>
        <Progress
          value={riskScore}
          className={cn(
            "h-1.5",
            riskScore < 30 && "bg-risk-safe/20",
            riskScore >= 30 && riskScore < 60 && "bg-risk-low/20",
            riskScore >= 60 && riskScore < 80 && "bg-risk-medium/20",
            riskScore >= 80 && "bg-risk-high/20"
          )}
        />
      </div>

      <div className="mt-3 flex items-center">
        <div className="flex items-center">
          {getComplianceIcon(complianceStatus)}
          <span className="ml-1 text-xs">
            {complianceStatus === "verified" && "Compliance Verified"}
            {complianceStatus === "pending" && "Pending Verification"}
            {complianceStatus === "breached" && "Compliance Breached"}
          </span>
        </div>
      </div>
    </div>
  );
}
