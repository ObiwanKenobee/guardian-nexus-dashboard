
import { BaseRecord } from "@/services/api";

export type RiskLevel = "high" | "medium" | "low" | "safe";

export interface RiskAlert extends BaseRecord {
  title: string;
  description: string;
  level: RiskLevel;
  time: string;
  source?: string;
  affectedSupplierId?: string;
  acknowledged: boolean;
  resolvedAt?: string;
}
