
import { ComplianceRecord } from "@/types/compliance";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Clock, Ban, Calendar } from "lucide-react";

interface ComplianceTimelineProps {
  records: ComplianceRecord[];
}

export function ComplianceTimeline({ records }: ComplianceTimelineProps) {
  // Sort records by date, newest first
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <div className="h-8 w-8 rounded-full bg-risk-safe/20 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-risk-safe" />
        </div>;
      case "pending":
        return <div className="h-8 w-8 rounded-full bg-risk-medium/20 flex items-center justify-center">
          <Clock className="h-4 w-4 text-risk-medium" />
        </div>;
      case "expired":
        return <div className="h-8 w-8 rounded-full bg-risk-medium/20 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-risk-medium" />
        </div>;
      case "revoked":
        return <div className="h-8 w-8 rounded-full bg-risk-high/20 flex items-center justify-center">
          <Ban className="h-4 w-4 text-risk-high" />
        </div>;
      default:
        return null;
    }
  };

  if (sortedRecords.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <p className="text-muted-foreground">No compliance records found</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 pb-1">
      {/* Timeline line */}
      <div className="absolute top-2 left-[15px] bottom-0 w-[1px] bg-border" />
      
      <div className="space-y-8">
        {sortedRecords.map((record) => (
          <div key={record.id} className="relative">
            {/* Timeline node */}
            <div className="absolute -left-6 mt-1">
              {getStatusIcon(record.status)}
            </div>
            
            {/* Timeline content */}
            <div className="bg-card border rounded-md p-4 ml-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{record.type} - {record.supplierName}</h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(record.updatedAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium",
                  record.status === "valid" && "bg-risk-safe/20 text-risk-safe",
                  record.status === "pending" && "bg-risk-medium/20 text-risk-medium",
                  record.status === "expired" && "bg-risk-medium/20 text-risk-medium",
                  record.status === "revoked" && "bg-risk-high/20 text-risk-high",
                )}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </div>
              
              <div className="text-xs text-muted-foreground">
                <div>Valid from: {new Date(record.issueDate).toLocaleDateString()}</div>
                <div>Expires on: {new Date(record.expiryDate).toLocaleDateString()}</div>
              </div>
              
              {record.notes && (
                <div className="mt-2 text-xs border-t pt-2">
                  {record.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
