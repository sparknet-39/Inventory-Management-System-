import { InventoryItem } from './types';

export const CATEGORIES = [
  'Electronics',
  'Office Supplies',
  'Furniture',
  'Peripherals',
  'Networking',
  'Accessories'
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: '1',
    name: 'Ergonomic Mesh Chair',
    sku: 'FUR-001',
    category: 'Furniture',
    quantity: 12,
    unitPrice: 249.99,
    threshold: 5,
    description: 'High-back mesh office chair with lumbar support.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Wireless Mechanical Keyboard',
    sku: 'PER-042',
    category: 'Peripherals',
    quantity: 4,
    unitPrice: 129.50,
    threshold: 10,
    description: 'RGB backlit mechanical keyboard with blue switches.',
    lastUpdated: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    name: '27" 4K Monitor',
    sku: 'ELE-105',
    category: 'Electronics',
    quantity: 8,
    unitPrice: 450.00,
    threshold: 3,
    description: 'IPS panel 4K monitor suitable for design work.',
    lastUpdated: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    name: 'USB-C Docking Station',
    sku: 'ACC-221',
    category: 'Accessories',
    quantity: 25,
    unitPrice: 89.99,
    threshold: 8,
    description: '12-in-1 USB-C hub with HDMI and Ethernet.',
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Standing Desk Motorized',
    sku: 'FUR-009',
    category: 'Furniture',
    quantity: 2,
    unitPrice: 599.00,
    threshold: 4,
    description: 'Dual-motor electric standing desk frame.',
    lastUpdated: new Date(Date.now() - 400000000).toISOString(),
  },
];

export const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];