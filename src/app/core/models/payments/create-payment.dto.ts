export interface CreatePaymentDto {
  recipientUserId: string;    // User selling recyclables
  pickupRequestId: string;    // The pickup/request being paid for
  amount: number;             // Payment amount
  currency?: string;          // Default 'usd'
  pickupIds?: string[];       // Multiple pickups in one payment (optional)
  description?: string;       // e.g., "Payment for plastic bottles - 5kg"
  adminNotes?: string;        // Admin notes for approval
}