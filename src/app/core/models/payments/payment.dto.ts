import { PaymentStatus } from './PaymentStatus';

export interface PaymentDto {
  paymentId: string;
  pickupRequestId: string;           // Renamed for clarity
  recipientUserId: string;
  amount: number;
  currency: string;                  // Added
  paymentStatus: PaymentStatus;      // Use enum instead of string
  stripePayoutId?: string;           // Renamed from transactionReference
  adminId?: string;                  // Who approved/rejected
  adminNotes?: string;
  failureReason?: string;
  requestedAt: string;               // When user requested
  approvedAt?: string;               // When admin approved
  completedAt?: string;              // When Stripe completed
  createdAt: string;
  materialType?: string;  // e.g., "Plastic Bottles"
  weight?: string;
  pickupAddress?: string;
  driverName?: string;
  pricePerKg?: number;
}
