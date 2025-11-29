import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PickupRequestService } from '../../services/pickup-request.service';
import { PickupRequest } from '../../models/pickup-request.model';
import { RequestStatus, REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS } from '../../models/request-status.enum';

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './request-details.html',
  styleUrls: ['./request-details.css']
})
export class RequestDetails implements OnInit {

  request: PickupRequest | null = null;
  isLoading = false;
  error: string | null = null;
  requestId: string = '';

  // Status helpers
  statusLabels = REQUEST_STATUS_LABELS;
  statusColors = REQUEST_STATUS_COLORS;

  // Timeline data
  timeline: Array<{ status: string; date: Date | null; label: string; completed: boolean }> = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pickupRequestService: PickupRequestService
  ) { }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (this.requestId) {
      this.loadRequestDetails();
    } else {
      this.error = 'Invalid request ID';
    }
  }

  loadRequestDetails(): void {
    this.isLoading = true;
    this.error = null;

    this.pickupRequestService.getById(this.requestId).subscribe({
      next: (data: PickupRequest) => {
        this.request = data;
        this.buildTimeline();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.error = 'Request not found';
        } else if (err.status === 403) {
          this.error = 'You do not have permission to view this request';
        } else {
          this.error = 'Failed to load request details';
        }
        console.error('Error loading request:', err);
        this.isLoading = false;
      }
    });
  }

  buildTimeline(): void {
    if (!this.request) return;

    const statusFlow = [
      { status: RequestStatus.Pending, label: 'Request Created' },
      { status: RequestStatus.Assigned, label: 'Driver Assigned' },
      { status: RequestStatus.PickedUp, label: 'Materials Picked Up' },
      { status: RequestStatus.Completed, label: 'Completed' }
    ];

    const currentStatusIndex = statusFlow.findIndex(s => s.status === this.request?.status);

    this.timeline = statusFlow.map((item, index) => ({
      status: item.status,
      date: index <= currentStatusIndex ? this.request!.createdAt : null,
      label: item.label,
      completed: index <= currentStatusIndex
    }));

    // Handle cancelled status
    if (this.request.status === RequestStatus.Cancelled) {
      this.timeline = [
        { status: RequestStatus.Pending, label: 'Request Created', date: this.request.createdAt, completed: true },
        { status: RequestStatus.Cancelled, label: 'Cancelled', date: this.request.createdAt, completed: true }
      ];
    }
  }

  getStatusBadgeClass(status: string): string {
    const colorMap: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Assigned': 'bg-blue-100 text-blue-700 border-blue-200',
      'PickedUp': 'bg-purple-100 text-purple-700 border-purple-200',
      'Completed': 'bg-green-100 text-green-700 border-green-200',
      'Cancelled': 'bg-red-100 text-red-700 border-red-200'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-700';
  }

  canEdit(): boolean {
    return this.request?.status === RequestStatus.Pending;
  }

  canDelete(): boolean {
    return this.request?.status === RequestStatus.Pending ||
      this.request?.status === RequestStatus.Cancelled;
  }

  editRequest(): void {
    this.router.navigate(['/pickup-requests/edit', this.requestId]);
  }

  deleteRequest(): void {
    if (!this.request) return;

    if (confirm('Are you sure you want to delete this request?')) {
      this.pickupRequestService.delete(this.requestId).subscribe({
        next: () => {
          alert('Request deleted successfully');
          this.router.navigate(['/pickup-requests/my-requests']);
        },
        error: (err: HttpErrorResponse) => {
          alert('Failed to delete request: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/pickup-requests/my-requests']);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toFixed(2)}`;
  }
  getTimelineProgress() {
    return (this.timeline.filter(t => t.completed).length / this.timeline.length * 100) + '%';
  }
}