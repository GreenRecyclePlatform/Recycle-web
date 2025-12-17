export interface Material {
  id: string;
  name: string;
  description?: string;
  unit?: string;
  icon: string;
  image?: string;
  imageUrl?: string;
  imageLocalPath?: string;
  buyingPrice: number;
  sellingPrice: number;
  pricePerKg: number;
  status: 'active' | 'inactive';
  isActive: boolean;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
}
