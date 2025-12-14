// src/app/features/payments/models/payment.model.ts

export enum PaymentStatus {
    Pending = 'Pending',
    Processing = 'Processing',
    Completed = 'Completed',
    Failed = 'Failed',
    Cancelled = 'Cancelled'
}

export enum PaymentType {
    Earning = 'Earning',
    Withdrawal = 'Withdrawal',
    Refund = 'Refund'
}

export interface Payment {
    paymentId: string;
    userId: string;
    userName: string;
    pickupRequestId?: string;
    amount: number;
    type: PaymentType;
    status: PaymentStatus;
    paymentMethod?: string;
    transactionId?: string;
    description: string;
    createdAt: Date;
    processedAt?: Date;
    completedAt?: Date;
    failureReason?: string;
}

export interface PaymentSummary {
    totalEarnings: number;
    totalWithdrawals: number;
    pendingAmount: number;
    availableBalance: number;
    lastPaymentDate?: Date;
}

export interface PaymentFilter {
    userId?: string;
    type?: PaymentType;
    status?: PaymentStatus;
    fromDate?: Date;
    toDate?: Date;
    minAmount?: number;
    maxAmount?: number;
    pageNumber: number;
    pageSize: number;
}

export interface PaymentPagedResponse {
    data: Payment[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export const PAYMENT_STATUS_LABELS: { [key: string]: string } = {
    Pending: 'Pending',
    Processing: 'Processing',
    Completed: 'Completed',
    Failed: 'Failed',
    Cancelled: 'Cancelled'
};

export const PAYMENT_TYPE_LABELS: { [key: string]: string } = {
    Earning: 'Earning',
    Withdrawal: 'Withdrawal',
    Refund: 'Refund'
};