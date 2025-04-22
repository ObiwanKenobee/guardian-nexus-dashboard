
import { BaseRecord } from "@/services/api";

export type SupplierComplianceStatus = "verified" | "pending" | "breached";
export type SupplierTrustLevel = "verified" | "gold" | "platinum";
export type SupplierCategory = "Hardware" | "Software" | "Logistics" | "Manufacturing" | "Electronics" | "Materials" | "Shipping" | "Other";

export interface Supplier extends BaseRecord {
  name: string;
  country: string;
  category: SupplierCategory;
  riskScore: number;
  complianceStatus: SupplierComplianceStatus;
  trustLevel: SupplierTrustLevel;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  description?: string;
  image?: string;
}
