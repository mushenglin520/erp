
export interface Material {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  unit: string;
  valuationType: 'Standard' | 'Moving Average';
}

export interface CostRecord {
  materialId: string;
  standardPrice: number;
  actualPrice: number;
  totalInventoryValue: number;
  plannedCost: number;
  actualCost: number;
  variance: number;
}

export interface Transaction {
  id: string;
  materialId: string;
  type: 'Goods Receipt' | 'Goods Issue';
  quantity: number;
  amount: number;
  timestamp: string;
  costCenter: string;
}

export type ModuleView = 'Dashboard' | 'MM' | 'CO' | 'Settings';
