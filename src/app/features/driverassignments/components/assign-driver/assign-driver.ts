
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AssignmentRequest, Driver, Request } from '../../models/assignment';
import { DriverService } from '../../services/driver';
import { AuthService } from '../../../../core/services/authservice';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-assign-driver',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar],
  templateUrl: './assign-driver.html',
  styleUrls: ['./assign-driver.css']
})
export class AssignDriver implements OnInit {
  approvedRequests: Request[] = [];
  availableDrivers: Driver[] = [];
  selectedRequest: Request | null = null;
  isLoading = false;
  errorMessage = '';

  showConfirmModal = false;
  showSuccessModal = false;
  showErrorModal = false;
  modalMessage = '';
  pendingDriver: Driver | null = null;

  constructor(
    private driverService: DriverService,
    private authService: AuthService, // ⬅️ بدل AuthHelperService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
  }

  checkAdminAccess(): void {
    const token = this.authService.getToken();
    const isAdmin = this.authService.isAdmin();
    const userId = this.authService.getUserIdFromToken();

    console.log('🔐 Token exists:', !!token);
    console.log('🔐 User ID:', userId);
    console.log('🔐 Is Admin:', isAdmin);

    if (!token) {
      this.errorMessage = 'Please login to access this page';
      console.warn('⚠️ No token found - redirecting to login');
      // this.router.navigate(['/login']);
      return;
    }

    if (!isAdmin) {
      this.errorMessage = 'You need Admin privileges to access this page';
      console.warn('⚠️ Not an admin - access denied');
      // this.router.navigate(['/unauthorized']);
      return;
    }

    console.log('✅ Admin access confirmed - loading data');
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.driverService.getApprovedRequests().subscribe({
      next: (requests) => {
        this.approvedRequests = requests;
        console.log('✅ Requests loaded:', requests.length, 'requests');
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load requests';
        console.error('❌ Error loading requests:', error);

        if (error.message.includes('Unauthorized')) {
          // this.router.navigate(['/login']);
        }
      }
    });

    this.driverService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.availableDrivers = drivers;
        this.isLoading = false;
        console.log('✅ Available Drivers loaded:', drivers.length, 'drivers');
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load drivers';
        this.isLoading = false;
        console.error('❌ Error loading drivers:', error);

        if (error.message.includes('Unauthorized')) {
          // this.router.navigate(['/login']);
        }
      }
    });
  }

  selectRequest(request: Request): void {
    this.selectedRequest = request;
    console.log('📋 Selected request:', request.id);
  }

  assignToDriver(driver: Driver): void {
    if (!this.selectedRequest) {
      return;
    }

    this.pendingDriver = driver;
    this.modalMessage = `Are you sure you want to assign Request ${this.selectedRequest.id} to Driver ${driver.name}?`;
    this.showConfirmModal = true;
  }

  confirmAssignment(): void {
    if (!this.selectedRequest || !this.pendingDriver) {
      return;
    }

    this.showConfirmModal = false;
    this.isLoading = true;
    this.errorMessage = '';

    const assignment: AssignmentRequest = {
      requestId: this.selectedRequest.id,
      driverId: this.pendingDriver.id
    };

    const driver = this.pendingDriver;

    this.driverService.assignRequestToDriver(assignment).subscribe({
      next: (response) => {
        console.log('✅ Assignment successful:', response);

        this.modalMessage = `Request ${this.selectedRequest?.id} has been assigned to Driver ${driver.name} successfully!`;
        this.showSuccessModal = true;

        this.approvedRequests = this.approvedRequests.filter(
          req => req.id !== this.selectedRequest?.id
        );

        driver.todayPickups++;

        this.selectedRequest = null;
        this.pendingDriver = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to assign request to driver';
        this.isLoading = false;
        console.error('❌ Error assigning request:', error);

        this.modalMessage = this.errorMessage;
        this.showErrorModal = true;
        this.pendingDriver = null;
      }
    });
  }

  cancelAssignment(): void {
    this.showConfirmModal = false;
    this.pendingDriver = null;
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
    const avatarDiv = event.target.previousElementSibling;
    if (avatarDiv) {
      avatarDiv.style.display = 'flex';
    }
  }

  refreshData(): void {
    this.selectedRequest = null;
    this.loadData();
  }
}
