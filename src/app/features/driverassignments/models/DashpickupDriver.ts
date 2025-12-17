
export enum PickupStatus {
  Pending = 1,      // may accept or cancel 
  Cancelled = 2,    
  InProgress = 3,   // accept
  Completed = 4     
}

 export interface DriverResponseDto {
  assignmentId: string;
  action: 1 | 2; // 1 = Accept, 2 = Reject
  notes?: string;
}

export interface UpdateAssignmentStatusDto {
  assignmentId: string;
  status: 1; //Completed
  notes?: string;
}


export interface StatCard {
  key: string;
  status: PickupStatus | 'all';
  label: string;
  count: number;
  color: string;
}

export interface Pickup {
  assignmentId: string;
  requestId: string;
  pickupAddress: string;
  driverId: string;
  driverName: string;
  adminName: string;
  status: PickupStatus;
  assignedAt: string;
  acceptedAt?: string;
  completedAt?: string;
  driverNotes?: string;
  rejectReason?: string;
  isActive: boolean;
}

export interface PickupStats {
  all: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface RejectRequest {
  reason: string;
}

export interface CompleteRequest {
  driverNotes?: string;
}

export function getStatusLabel(status: PickupStatus): string {
  const labels: Record<PickupStatus, string> = {
    [PickupStatus.Pending]: 'Pending',
    [PickupStatus.Cancelled]: 'Cancelled',
    [PickupStatus.InProgress]: 'In Progress',
    [PickupStatus.Completed]: 'Completed'
  };
  return labels[status] || 'Unknown';
}

export function getStatusClass(status: PickupStatus): string {
  const classes: Record<PickupStatus, string> = {
    [PickupStatus.Pending]: 'badge-pending',
    [PickupStatus.Cancelled]: 'badge-cancelled',
    [PickupStatus.InProgress]: 'badge-in-progress',
    [PickupStatus.Completed]: 'badge-completed'
  };
  return classes[status] || '';
}