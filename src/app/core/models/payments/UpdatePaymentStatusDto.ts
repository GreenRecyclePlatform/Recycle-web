import { PaymentStatus } from './PaymentStatus';

export interface UpdatePaymentStatusDto {
  paymentId: string;
  status: PaymentStatus;
  adminId: string;
  notes?: string;
  failureReason?: string;
}