import { RequestMaterialItem } from './request-material.model';

export interface CreatePickupRequestDto {
    addressId: string;
    preferredPickupDate: Date;
    notes?: string;
    materials: RequestMaterialItem[];
}

export interface UpdatePickupRequestDto {
    addressId: string;
    preferredPickupDate: Date;
    notes?: string;
}

export interface UpdateStatusDto {
    newStatus: string;
}