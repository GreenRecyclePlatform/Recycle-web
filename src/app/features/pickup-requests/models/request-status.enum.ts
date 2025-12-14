export enum RequestStatus {
  Waiting = 'Waiting',
  Pending = 'Pending',
  Assigned = 'Assigned',
  PickedUp = 'PickedUp',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export const REQUEST_STATUS_LABELS: { [key: string]: string } = {
  Waiting: 'Waiting',
  Pending: 'Pending',
  Assigned: 'Assigned',
  PickedUp: 'Picked Up',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

export const REQUEST_STATUS_COLORS: { [key: string]: string } = {
  Waiting: 'secondary',
  Pending: 'warning',
  Assigned: 'info',
  PickedUp: 'primary',
  Completed: 'success',
  Cancelled: 'danger',
};
