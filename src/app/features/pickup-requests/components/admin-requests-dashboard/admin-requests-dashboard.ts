import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PickupRequestService } from '../../services/pickup-request.service';
import { PickupRequest, PickupRequestFilter } from '../../models/pickup-request.model';
import { RequestStatus, REQUEST_STATUS_LABELS } from '../../models/request-status.enum';

@Component({
  selector: 'app-admin-requests-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-requests-dashboard.html',
  styleUrls: ['./admin-requests-dashboard.css']
})
export class AdminRequestsDashboard implements OnInit {
  requests: PickupRequest[] = [];
  filteredRequests: PickupRequest[] = [];
  isLoading = false;
  error: string | null = null;

  // Filter properties
  selectedStatus: string = 'all';
  selectedGovernorate: string = 'all';
  searchTerm: string = '';
  fromDate: string = '';
  toDate: string = '';

  // Pagination
  currentPage = 1;
  pageSize = 10;
  totalCount = 0;
  totalPages = 0;

  // Status helpers
  statusLabels = REQUEST_STATUS_LABELS;
  availableStatuses = Object.keys(RequestStatus);
  governorates = ['Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia'];

  // Stats
  stats = {
    total: 0,
    pending: 0,
    assigned: 0,
    completed: 0
  };

  constructor(
    private pickupRequestService: PickupRequestService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.isLoading = true;
    this.error = null;

    const filter: PickupRequestFilter = {
      status: this.selectedStatus !== 'all' ? this.selectedStatus : undefined,
      fromDate: this.fromDate ? new Date(this.fromDate) : undefined,
      toDate: this.toDate ? new Date(this.toDate) : undefined,
      governorate: this.selectedGovernorate !== 'all' ? this.selectedGovernorate : undefined,
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };

    this.pickupRequestService.filter(filter).subscribe({
      next: (response) => {
        this.requests = response.data;
        this.filteredRequests = response.data;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
        this.calculateStats();
        this.applyLocalFilters();
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = 'Failed to load requests. Please try again.';
        console.error('Error loading requests:', err);
        this.isLoading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.requests.length;
    this.stats.pending = this.requests.filter(r => r.status === RequestStatus.Pending).length;
    this.stats.assigned = this.requests.filter(r => r.status === RequestStatus.Assigned).length;
    this.stats.completed = this.requests.filter(r => r.status === RequestStatus.Completed).length;
  }

  applyLocalFilters(): void {
    this.filteredRequests = this.requests.filter(request => {
      const matchesSearch = !this.searchTerm ||
        request.requestId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        request.fullAddress.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchesSearch;
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadRequests();
  }

  onSearchChange(): void {
    this.applyLocalFilters();
  }

  clearFilters(): void {
    this.selectedStatus = 'all';
    this.selectedGovernorate = 'all';
    this.searchTerm = '';
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
    this.loadRequests();
  }

  viewDetails(requestId: string): void {
    this.router.navigate(['/pickup-requests/details', requestId]);
  }

  updateStatus(requestId: string, newStatus: string): void {
    if (confirm(`Change status to ${newStatus}?`)) {
      this.pickupRequestService.updateStatus(requestId, newStatus).subscribe({
        next: () => {
          alert('Status updated successfully');
          this.loadRequests();
        },
        error: (err: HttpErrorResponse) => {
          alert('Failed to update status: ' + (err.error?.message || 'Unknown error'));
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

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadRequests();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `EGP ${amount.toFixed(2)}`;
  }
}