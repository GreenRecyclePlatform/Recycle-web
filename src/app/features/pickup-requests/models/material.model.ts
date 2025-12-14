export interface Material {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  icon: string;
  image?: string;  // ← Make optional (can be null when creating)
  imageUrl?: string;  // ← Add this for backend response
  imageLocalPath?: string;  // ← Add this for backend response
  buyingPrice: number;
  sellingPrice: number;
  pricePerKg: number;
  status: 'active' | 'inactive';
  isActive: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
}
