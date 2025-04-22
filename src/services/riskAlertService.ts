
import { ApiService } from "./api";
import { RiskAlert } from "@/types/riskAlert";
import { riskAlerts } from "@/data/mockData";

class RiskAlertService extends ApiService<RiskAlert> {
  constructor() {
    super('riskAlerts');
    this.initializeData();
  }

  private async initializeData() {
    const alerts = await this.getAll();
    if (alerts.length === 0) {
      // Seed with initial data
      const initialAlerts = riskAlerts.map(alert => ({
        ...alert,
        acknowledged: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem('guardian-io-riskAlerts', JSON.stringify(initialAlerts));
    }
  }
  
  async acknowledgeAlert(id: string): Promise<RiskAlert> {
    return this.update(id, { acknowledged: true });
  }

  async resolveAlert(id: string): Promise<RiskAlert> {
    return this.update(id, { 
      acknowledged: true, 
      resolvedAt: new Date().toISOString() 
    });
  }
}

export const riskAlertService = new RiskAlertService();
