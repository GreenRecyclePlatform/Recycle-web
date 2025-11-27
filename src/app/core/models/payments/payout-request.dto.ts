export interface PayoutRequestDto {
  userId: string;              // User requesting payout (can get from auth)
  amount: number;              // Amount to withdraw
  currency?: string;           // Default 'usd'
  pickupRequestIds?: string[]; // Which pickups this payout covers
  description?: string;        // Optional note
}