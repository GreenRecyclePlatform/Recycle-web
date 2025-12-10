import { Component, OnInit } from '@angular/core';
import { DriverService, Material, WaitingRequest } from '../driverassignments/services/driver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressDto } from '../../core/models/auth-response';

@Component({
  selector: 'app-review-requests',
  imports: [CommonModule, FormsModule],
  templateUrl: './review-requests.html',
  styleUrl: './review-requests.css',
})
export class ReviewRequests implements OnInit {
  WaitingRequests: WaitingRequest[] = [];
  statusFilter: string = 'Waiting';
  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.driverService.getWaitingRequests().subscribe({
      next: (requests) => {
        this.WaitingRequests = requests;
        console.log('✅ Requests loaded:', requests);
      },
      error: (error) => {
        const errorMessage = error.message || 'Failed to load requests';
        console.error('❌ Error loading requests:', errorMessage);

        if (error.message.includes('Unauthorized')) {
          console.log('User is unauthorized. Redirecting to login...');
        }
      },
    });
  }

  toggleExpand(request: WaitingRequest): void {
    request.expanded = !request.expanded;
  }

  approveRequest(request: WaitingRequest): void {
    console.log('Approved:', request.id);
    alert(`Approved request: ${request.id}`);

    this.driverService.UpdatingStatus(request.id, { NewStatus: 'Pending' }).subscribe({
      next: () => {
        console.log('Request status updated successfully');
        this.loadData(); // Refresh the list after approval
      },
      error: (error) => {
        console.error('Error updating request status:', error);
      },
    });
  }

  rejectRequest(request: WaitingRequest): void {
    console.log('Rejected:', request.id);
    alert(`Rejected request: ${request.id}`);

    this.driverService.UpdatingStatus(request.id, { NewStatus: 'Cancelled' }).subscribe({
      next: () => {
        console.log('Request status updated successfully');
        this.loadData(); // Refresh the list after approval
      },
      error: (error) => {
        console.error('Error updating request status:', error);
      },
    });
  }

  // editRequest(request: WaitingRequest): void {
  //   console.log('Edit:', request.id);
  //   alert(`Edit request: ${request.id}`);
  //   // Add your edit logic here
  //   // Example: this.router.navigate(['/edit', request.id]);
  // }

  getTotalWeight(materials: Material[]): string {
    const total = materials.reduce((sum, material) => {
      const weight = parseFloat(material.estimatedWeight);
      return sum + (isNaN(weight) ? 0 : weight);
    }, 0);
    return `${total} kg`;
  }
}
