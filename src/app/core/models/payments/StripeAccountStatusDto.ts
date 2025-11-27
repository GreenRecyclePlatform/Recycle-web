export interface StripeAccountStatusDto {
  userId: string;
  stripeAccountId: string;
  status: 'pending' | 'verified' | 'restricted' | 'rejected';
  detailsSubmitted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  requirements?: {
    currentlyDue: string[];
    pastDue: string[];
    errors: Array<{
      code: string;
      reason: string;
      requirement: string;
    }>;
  };
  accountType: 'express' | 'standard';
  country: string;
  createdAt: string;
  updatedAt: string;
}