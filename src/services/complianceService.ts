
import { ApiService } from "./api";
import { ComplianceRecord } from "@/types/compliance";

class ComplianceService extends ApiService<ComplianceRecord> {
  constructor() {
    super('complianceRecords');
    this.initializeData();
  }

  private async initializeData() {
    const records = await this.getAll();
    if (records.length === 0) {
      // Create some initial compliance records
      const initialRecords: Omit<ComplianceRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          supplierId: "1",
          supplierName: "TechSolutions Inc.",
          type: "ISO 27001",
          status: "valid",
          issueDate: "2023-01-15T00:00:00Z",
          expiryDate: "2025-01-15T00:00:00Z",
          notes: "Annual audit completed successfully"
        },
        {
          supplierId: "2",
          supplierName: "GlobalTech",
          type: "GDPR",
          status: "pending",
          issueDate: "2023-11-10T00:00:00Z",
          expiryDate: "2025-11-10T00:00:00Z",
          notes: "Awaiting final documentation"
        },
        {
          supplierId: "3",
          supplierName: "EcoLogistics",
          type: "ESG",
          status: "valid",
          issueDate: "2023-06-22T00:00:00Z",
          expiryDate: "2024-06-22T00:00:00Z",
          notes: "Carbon neutral certification"
        }
      ];
      
      for (const record of initialRecords) {
        await this.create(record);
      }
    }
  }

  async getBySupplier(supplierId: string): Promise<ComplianceRecord[]> {
    const records = await this.getAll();
    return records.filter(record => record.supplierId === supplierId);
  }
}

export const complianceService = new ComplianceService();
