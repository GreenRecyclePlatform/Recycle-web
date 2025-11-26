export interface PickupRequest {
  requestId: string;
  userId: string;
  userName: string;
  addressId: string;
  fullAddress: string;
  preferredPickupDate: string;
  status: string;
  notes: string;
  totalEstimatedWeight: number;
  totalAmount: number;
  createdAt: string;
  completedAt: string | null;
  materials: any[];
}

export interface Request {
  id: string;
  customerName: string;
  address: string;
  material: string;
  weight: number;
  status: string;
}