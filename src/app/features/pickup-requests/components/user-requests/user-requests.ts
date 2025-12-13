import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // ✅ Add this
import { FormsModule } from '@angular/forms';    // ✅ Add this for ngModel
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PickupRequestService } from '../../services/pickup-request.service';
import { PickupRequest } from '../../models/pickup-request.model';
import { RequestStatus, REQUEST_STATUS_COLORS, REQUEST_STATUS_LABELS } from '../../models/request-status.enum';

@Component({
  selector: 'app-user-requests',
  standalone: true,  // ✅ Standalone flag
  imports: [
    CommonModule,    // ✅ For @if, @for
    FormsModule      // ✅ For [(ngModel)]
  ],
  templateUrl: './user-requests.html',
  styleUrls: ['./user-requests.css']
})
export class UserRequests implements OnInit {
  requests: PickupRequest[] = [];
  filteredRequests: PickupRequest[] = [];
  isLoading = false;
  error: string | null = null;

  // Filter properties
  selectedStatus: string = 'all';
  searchTerm: string = '';

  // Status helpers
  statusLabels = REQUEST_STATUS_LABELS;
  statusColors = REQUEST_STATUS_COLORS;
  availableStatuses = Object.keys(RequestStatus);

  constructor(
    private pickupRequestService: PickupRequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMyRequests();
  }

  loadMyRequests(): void {
    this.isLoading = true;
    this.error = null;

    this.pickupRequestService.getMyRequests().subscribe({
      next: (data: PickupRequest[]) => {
        this.requests = data;
        this.filteredRequests = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load requests. Please try again.';  // Egyptian Arabic
        console.error('Error loading requests:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredRequests = this.requests.filter(request => {
      const matchesStatus = this.selectedStatus === 'all' || request.status === this.selectedStatus;
      const matchesSearch = !this.searchTerm ||
        request.fullAddress.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (request.notes && request.notes.toLowerCase().includes(this.searchTerm.toLowerCase()));

      return matchesStatus && matchesSearch;
    });
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  viewDetails(requestId: string): void {
    this.router.navigate(['/pickup-requests/details', requestId]);
  }

  createNewRequest(): void {
    this.router.navigate(['/pickup-requests/create']);
  }

  canEdit(request: PickupRequest): boolean {
    return request.status === RequestStatus.Pending;
  }

  canDelete(request: PickupRequest): boolean {
    return request.status === RequestStatus.Pending ||
      request.status === RequestStatus.Cancelled;
  }

  editRequest(requestId: string): void {
    this.router.navigate(['/pickup-requests/edit', requestId]);
  }

  deleteRequest(request: PickupRequest): void {
    if (confirm('Are You Sure You Want To Delete This Request?')) {
      this.pickupRequestService.delete(request.requestId).subscribe({
        next: () => {
          this.loadMyRequests();
          alert('Request deleted successfully');
        },
        error: (err: HttpErrorResponse) => {
          alert('Failed to delete request: ' + (err.error?.message || 'Unknown error'));
        }
      });
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

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('ar-EG', {  // Egyptian locale
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} EGP`;  // Egyptian Pound
  }

  // Add these methods to user-requests..ts


  getPendingCount(): number {
    return this.requests.filter(r => r.status === RequestStatus.Pending).length;
  }

  getCompletedCount(): number {
    return this.requests.filter(r => r.status === RequestStatus.Completed).length;
  }

  getTotalEarnings(): string {
    const total = this.requests
      .filter(r => r.status === RequestStatus.Completed)
      .reduce((sum, request) => sum + request.totalAmount, 0);
    return total.toFixed(2);
  }
}