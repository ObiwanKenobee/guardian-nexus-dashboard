
import { BaseRecord } from "@/services/api";

export type ReportType = 
  | "ISO Compliance" 
  | "ESG Report" 
  | "GDPR Compliance"
  | "Risk Assessment"
  | "Supplier Evaluation"
  | "Supply Chain Analysis";

export type ReportFormat = "PDF" | "Excel" | "CSV";

export interface Report extends BaseRecord {
  name: string;
  type: ReportType;
  generatedDate: string;
  format: ReportFormat;
  downloadUrl?: string;
  parameters?: Record<string, any>;
  notes?: string;
}
