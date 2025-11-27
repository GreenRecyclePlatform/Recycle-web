export interface AvailableBalanceDto {
  userId: string;
  availableBalance: number;
  pendingBalance: number;
  currency: string;
  completedPickups: number;    // Pickups collected but not paid
  pendingPayouts: number;      // Payouts waiting approval
}