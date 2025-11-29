export interface RequestMaterialItem {
    materialId: string;
    estimatedWeight: number;
}

export interface MaterialItemDto {
    materialId: string;
    materialName: string;
    estimatedWeight: number;
    pricePerKg: number;
    totalAmount: number;
}