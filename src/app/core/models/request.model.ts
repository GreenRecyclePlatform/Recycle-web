export interface RecycleRequest {
  id: string;
  userId: string;
  userName: string;
  material: string;
  weight: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  address?: string;
  photos?: string[];
}
