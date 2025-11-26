export enum RequestStatus {
    Pending = 'Pending',
    Assigned = 'Assigned',
    PickedUp = 'PickedUp',
    Completed = 'Completed',
    Cancelled = 'Cancelled'
}

export const REQUEST_STATUS_LABELS: { [key: string]: string } = {
    Pending: 'Pending',
    Assigned: 'Assigned',
    PickedUp: 'Picked Up',
    Completed: 'Completed',
    Cancelled: 'Cancelled'
};

export const REQUEST_STATUS_COLORS: { [key: string]: string } = {
    Pending: 'warning',
    Assigned: 'info',
    PickedUp: 'primary',
    Completed: 'success',
    Cancelled: 'danger'
};