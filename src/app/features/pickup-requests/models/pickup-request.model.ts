import { MaterialItemDto } from './request-material.model';
import { RequestStatus } from './request-status.enum';

export interface PickupRequest {
    requestId: string;
    userId: string;
    userName: string;
    addressId: string;
    fullAddress: string;
    preferredPickupDate: Date;
    status: RequestStatus;
    notes?: string;
    totalEstimatedWeight: number;
    totalAmount: number;
    createdAt: Date;
    completedAt?: Date;
    materials: MaterialItemDto[];
}

export interface PickupRequestFilter {
    status?: string;
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
    governorate?: string;
    pageNumber: number;
    pageSize: number;
}

export interface PickupRequestPagedResponse {
    data: PickupRequest[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}