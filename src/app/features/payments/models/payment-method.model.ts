// src/app/features/payments/models/payment-method.model.ts

export enum PaymentMethodType {
    BankAccount = 'BankAccount',
    UPI = 'UPI',
    Wallet = 'Wallet'
}

export interface PaymentMethod {
    id: string;
    userId: string;
    type: PaymentMethodType;
    accountName: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    walletProvider?: string;
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
}

export interface CreatePaymentMethodDto {
    type: PaymentMethodType;
    accountName: string;
    accountNumber?: string;
    ifscCode?: string;
    upiId?: string;
    walletProvider?: string;
    isDefault: boolean;
}