
import { BaseRecord } from "@/services/api";

export type ComplianceType = 
  | "ISO 27001" 
  | "GDPR" 
  | "ESG" 
  | "SOC 2" 
  | "HIPAA" 
  | "PCI DSS"
  | "Other";

export type ComplianceStatus = 
  | "valid" 
  | "pending" 
  | "expired" 
  | "revoked";

export interface ComplianceRecord extends BaseRecord {
  supplierId: string;
  supplierName: string;
  type: ComplianceType;
  status: ComplianceStatus;
  issueDate: string;
  expiryDate: string;
  documentUrl?: string;
  notes?: string;
  verifiedBy?: string;
}
