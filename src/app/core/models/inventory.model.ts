export interface InventoryItem {
  id: string;
  material: string;
  quantity: number;
  status: 'available' | 'reserved' | 'sold';
  dateProcessed: Date;
  lowStock: boolean;
}
