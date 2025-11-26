export interface Material {
    id: string;
    name: string;
    description?: string;
    pricePerKg: number;
    unit?: string;
    isActive: boolean;
    createdAt: Date;
}