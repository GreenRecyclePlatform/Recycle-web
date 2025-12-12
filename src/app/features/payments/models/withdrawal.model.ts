// src/app/features/payments/models/withdrawal.model.ts

export interface CreateWithdrawalDto {
    amount: number;
    paymentMethodId: string;
    notes?: string;
}

export interface WithdrawalResponse {
    paymentId: string;
    amount: number;
    status: string;
    message: string;
    estimatedProcessingTime: string;
}