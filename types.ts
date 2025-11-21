export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unitPrice: number;
  threshold: number; // Low stock warning level
  description: string;
  lastUpdated: string;
}

export interface CategoryStat {
  name: string;
  value: number;
  color: string;
}

export type ViewMode = 'dashboard' | 'inventory' | 'reports';

export interface AiInsight {
  type: 'warning' | 'success' | 'info';
  message: string;
  action?: string;
}

// For the AI Magic Fill response
export interface AiItemSuggestion {
  category: string;
  estimatedPrice: number;
  description: string;
  suggestedThreshold: number;
}