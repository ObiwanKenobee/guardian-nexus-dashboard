
import { toast } from "sonner";

// This would be replaced with actual API calls in a production environment
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiService<T extends BaseRecord> {
  private endpoint: string;
  private localStorageKey: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.localStorageKey = `guardian-io-${endpoint}`;
    // Initialize local storage with data if it doesn't exist
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(this.localStorageKey, JSON.stringify([]));
    }
  }

  async getAll(): Promise<T[]> {
    // Simulate API delay
    await delay(500);
    try {
      const data = localStorage.getItem(this.localStorageKey) || "[]";
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error fetching ${this.endpoint}:`, error);
      toast.error(`Failed to fetch ${this.endpoint}`);
      return [];
    }
  }

  async getById(id: string): Promise<T | null> {
    await delay(300);
    try {
      const items = await this.getAll();
      return items.find(item => item.id === id) || null;
    } catch (error) {
      console.error(`Error fetching ${this.endpoint} by ID:`, error);
      toast.error(`Failed to fetch ${this.endpoint} details`);
      return null;
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    await delay(600);
    try {
      const items = await this.getAll();
      const newItem = {
        ...data,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as T;
      
      localStorage.setItem(this.localStorageKey, JSON.stringify([...items, newItem]));
      toast.success(`${this.endpoint.slice(0, -1)} created successfully`);
      return newItem;
    } catch (error) {
      console.error(`Error creating ${this.endpoint}:`, error);
      toast.error(`Failed to create ${this.endpoint}`);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    await delay(600);
    try {
      const items = await this.getAll();
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        throw new Error(`${this.endpoint} not found`);
      }
      
      const updatedItem = {
        ...items[itemIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      } as T;
      
      items[itemIndex] = updatedItem;
      localStorage.setItem(this.localStorageKey, JSON.stringify(items));
      toast.success(`${this.endpoint.slice(0, -1)} updated successfully`);
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${this.endpoint}:`, error);
      toast.error(`Failed to update ${this.endpoint}`);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await delay(500);
    try {
      const items = await this.getAll();
      const filteredItems = items.filter(item => item.id !== id);
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredItems));
      toast.success(`${this.endpoint.slice(0, -1)} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting ${this.endpoint}:`, error);
      toast.error(`Failed to delete ${this.endpoint}`);
      throw error;
    }
  }
}
