import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentRequest, Driver, Request } from '../../models/assignment';
import { DriverService } from '../../services/driver';

@Component({
  selector: 'app-assign-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assign-driver.html',
  styleUrls: ['./assign-driver.css']
})
export class AssignDriver implements OnInit {
  approvedRequests: Request[] = [];
  availableDrivers: Driver[] = [];
  selectedRequest: Request | null = null;
  isLoading = false;
  errorMessage = '';
  
  // Modal properties
  showConfirmModal = false;
  showSuccessModal = false;
  showErrorModal = false;
  modalMessage = '';
  pendingDriver: Driver | null = null;

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.driverService.getApprovedRequests().subscribe({
      next: (requests) => {
        this.approvedRequests = requests;
        console.log('Requests loaded:', requests);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load requests';
        console.error(error);
      }
    });

    this.driverService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.availableDrivers = drivers;
        this.isLoading = false;
        console.log('Available Drivers loaded:', drivers);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load drivers';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  selectRequest(request: Request): void {
    this.selectedRequest = request;
    console.log('Selected:', request);
  }

  assignToDriver(driver: Driver): void {
    if (!this.selectedRequest) {
      return;
    }

    // Show confirmation 
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
        console.log('Assignment successful:', response);
        
        // Show success 
        this.modalMessage = `Request ${this.selectedRequest?.id} has been assigned to Driver ${driver.name} successfully!`;
        this.showSuccessModal = true;
        
        // Remove assigned request from the list
        this.approvedRequests = this.approvedRequests.filter(
          req => req.id !== this.selectedRequest?.id
        );
        
        // Update driver's pickups count
        driver.todayPickups++;
        
        this.selectedRequest = null;
        this.pendingDriver = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to assign request to driver';
        this.isLoading = false;
        console.error('Error assigning request:', error);
        
        // Show error 
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