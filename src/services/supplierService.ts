
import { ApiService } from "./api";
import { Supplier } from "@/types/supplier";
import { supplierData } from "@/data/mockData";

class SupplierService extends ApiService<Supplier> {
  constructor() {
    super('suppliers');
    this.initializeData();
  }

  private async initializeData() {
    const suppliers = await this.getAll();
    if (suppliers.length === 0) {
      // Seed with initial data
      const initialSuppliers = supplierData.map(supplier => ({
        ...supplier,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      localStorage.setItem('guardian-io-suppliers', JSON.stringify(initialSuppliers));
    }
  }
}

export const supplierService = new SupplierService();
