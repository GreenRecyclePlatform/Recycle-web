// driver-dashboard.component.ts
import { DriverSidebar } from '../driver-sidebar/driver-sidebar';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DashpickupDriverservice } from '../../services/DashpickupDriverservice';
import { AuthService } from '../../../../core/services/authservice'; 
import { 
  Pickup, 
  PickupStats, 
  PickupStatus,
  getStatusLabel,
  getStatusClass,
  StatCard,
  
} from '../../models/DashpickupDriver';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DriverSidebar,Navbar],
  templateUrl: './driver-dashboard.html',
  styleUrls: ['./driver-dashboard.css']
})
export class DriverDashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  PickupStatus = PickupStatus;

  pickups: Pickup[] = [];
  filteredPickups: Pickup[] = [];
  stats: PickupStats = { all: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 };

  activeFilter: PickupStatus | 'all' = 'all';
  searchTerm: string = '';

  showRejectModal: boolean = false;
  showCompleteModal: boolean = false;
  selectedPickupId: string | null = null;
  rejectReason: string = '';
  completeNotes: string = '';

  isLoading: boolean = true;
  isProcessing: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private dashpickupDriverservice: DashpickupDriverservice,
    private authService: AuthService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.checkDriverAccess();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  //

  checkDriverAccess(): void {
    const token = this.authService.getToken();
    const isDriver = this.authService.isDriver();
    const userId = this.authService.getUserIdFromToken();

    console.log('🔐 Token exists:', !!token);
    console.log('🔐 User ID:', userId);
    console.log('🔐 Is Driver:', isDriver);

    if (!token) {
      this.errorMessage = 'Please login to access your dashboard';
      console.warn('⚠️ No token found - redirecting to login');
      return;
    }

    if (!isDriver) {
      this.errorMessage = 'You need Driver privileges to access this page';
      console.warn('⚠️ Not a driver - access denied');
      return;
    }

    console.log('✅ Driver access confirmed - loading dashboard');
    this.loadData();
  }

  private loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.dashpickupDriverservice.loadAllPickups()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (pickups) => {
          this.pickups = pickups;
          this.applyFilters();
          this.isLoading = false;
          console.log( pickups.length);
        },
        error: (err) => {
          this.errorMessage = err.message || 'Failed to load data';
          this.isLoading = false;
          console.error( err);
          
          if (err.message && (err.message.includes('Unauthorized') || err.message.includes('403'))) {
          }
        }
      });

    this.dashpickupDriverservice.getStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => this.stats = stats);
  }

  refreshData(): void {
    this.loadData();
  }

  setActiveFilter(status: PickupStatus | 'all'): void {
    this.activeFilter = status;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    this.dashpickupDriverservice.filterPickups(this.activeFilter, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe(filtered => this.filteredPickups = filtered);
  }

  acceptPickup(id: string): void {
    this.isProcessing = true;
    this.clearMessages();

    this.dashpickupDriverservice.acceptPickup(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isProcessing = false;
          this.successMessage = 'Assignment accepted!';
          this.applyFilters();
          this.autoHideSuccess();
          console.log(id);
        },
        error: (err) => {
          this.isProcessing = false;
          this.errorMessage = err.message;
          console.error(err);
        }
      });
  }

  openRejectModal(id: string): void {
    this.selectedPickupId = id;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.selectedPickupId = null;
    this.rejectReason = '';
  }

  confirmReject(): void {
    if (!this.selectedPickupId || !this.rejectReason.trim()) return;

    this.isProcessing = true;
    this.clearMessages();

    this.dashpickupDriverservice.rejectPickup(this.selectedPickupId, this.rejectReason)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isProcessing = false;
          this.closeRejectModal();
          this.successMessage = 'Assignment rejected';
          this.applyFilters();
          this.autoHideSuccess();
          console.log( this.selectedPickupId);
        },
        error: (err) => {
          this.isProcessing = false;
          this.errorMessage = err.message;
          console.error( err);
        }
      });
  }

  openCompleteModal(id: string): void {
    this.selectedPickupId = id;
    this.completeNotes = '';
    this.showCompleteModal = true;
  }

  closeCompleteModal(): void {
    this.showCompleteModal = false;
    this.selectedPickupId = null;
    this.completeNotes = '';
  }

  confirmComplete(): void {
    if (!this.selectedPickupId) return;

    this.isProcessing = true;
    this.clearMessages();

    this.dashpickupDriverservice.completePickup(this.selectedPickupId, this.completeNotes)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isProcessing = false;
          this.closeCompleteModal();
          this.successMessage = 'Assignment completed!';
          this.applyFilters();
          this.autoHideSuccess();
          console.log('✅ Assignment completed:', this.selectedPickupId);
        },
        error: (err) => {
          this.isProcessing = false;
          this.errorMessage = err.message;
          console.error( err);
        }
      });
  }

  getStatusLabel(status: PickupStatus): string {
    return getStatusLabel(status);
  }

  getStatusClass(status: PickupStatus): string {
    return getStatusClass(status);
  }

  getStatCards(): StatCard[] {
    return [
      { key: 'all', status: 'all', label: 'All Pickups', count: this.stats.all, color: 'emerald' },
      { key: 'pending', status: PickupStatus.Pending, label: 'Pending', count: this.stats.pending, color: 'warning' },
      { key: 'in-progress', status: PickupStatus.InProgress, label: 'In Progress', count: this.stats.inProgress, color: 'info' },
      { key: 'completed', status: PickupStatus.Completed, label: 'Completed', count: this.stats.completed, color: 'success' },
      { key: 'cancelled', status: PickupStatus.Cancelled, label: 'Cancelled', count: this.stats.cancelled, color: 'danger' }
    ];
  }

  isActiveFilter(status: PickupStatus | 'all'): boolean {
    return this.activeFilter === status;
  }

  openDirections(address: string): void {
    const encoded = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`, '_blank');
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  trackByPickupId(index: number, pickup: Pickup): string {
    return pickup.assignmentId;
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private autoHideSuccess(): void {
    setTimeout(() => this.successMessage = '', 3000);
  }
}