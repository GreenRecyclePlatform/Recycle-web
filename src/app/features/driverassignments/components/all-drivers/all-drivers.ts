
import { Component, importProvidersFrom, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Alldriverservice } from '../../services/alldriverservice';
import { Driver } from '../../models/all-drivers';
import { AuthService } from '../../../../core/services/authservice';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-all-drivers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    Navbar,

  ],
  templateUrl: './all-drivers.html',
  styleUrls: ['./all-drivers.css']
})
export class AllDrivers implements OnInit {
  drivers: Driver[] = [];
  filteredDrivers: Driver[] = [];
  searchQuery: string = '';
  selectedStatus: string = 'All Status';

  // Statistics
  totalDrivers: number = 0;
  activeDrivers: number = 0;
  averageRating: number = 0;

  // Loading and error states
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  driverToDelete: Driver | null = null;

  constructor(
    private driverService: Alldriverservice,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAdminAccess();
  }

  checkAdminAccess(): void {
    const token = this.authService.getToken();
    const isAdmin = this.authService.isAdmin();


    if (!token) {
      this.errorMessage = 'Please login to access this page';
      console.warn('⚠️ No token found - redirecting to login');
      return;
    }

    if (!isAdmin) {
      this.errorMessage = 'You need Admin privileges to access this page';
      console.warn('⚠️ Not an admin - access denied');
      return;
    }

    console.log('✅ Admin access confirmed - loading drivers');
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.driverService.getAllDrivers().subscribe({
      next: (data) => {
        this.drivers = data;
        this.filteredDrivers = data;
        this.calculateStatistics();
        this.isLoading = false;
        console.log('✅ Drivers loaded:', data.length, 'drivers');
      },
      error: (error) => {
        console.error('❌ Error loading drivers:', error);
        this.errorMessage = error.message || 'Failed to load drivers. Please try again later.';
        this.isLoading = false;

        if (error.message && (error.message.includes('Unauthorized') || error.message.includes('403'))) {
          this.errorMessage = 'You do not have permission to view drivers';
        }
      }
    });
  }

  calculateStatistics(): void {
    this.totalDrivers = this.drivers.length;
    this.activeDrivers = this.drivers.filter(d => d.status === 'active').length;

    const totalRating = this.drivers.reduce((sum, d) => sum + d.rating, 0);
    this.averageRating = this.drivers.length > 0 ?
      Math.round((totalRating / this.drivers.length) * 10) / 10 : 0;
  }

  onSearch(): void {
    this.applyFilters();
  }

  onStatusChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredDrivers = this.drivers.filter(driver => {
      const matchesSearch = !this.searchQuery ||
        driver.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        driver.phone.includes(this.searchQuery) ||
        driver.location.toLowerCase().includes(this.searchQuery.toLowerCase())

      const matchesStatus = this.selectedStatus === 'All Status' ||
        driver.status === this.selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }


  onDeleteDriver(driver: Driver): void {
    if (!this.authService.isAdmin()) {
      this.errorMessage = 'Only admins can delete drivers';
      return;
    }

    // Store driver to delete
    this.driverToDelete = driver;
    const modalElement = document.getElementById('deleteDriverModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmDelete(): void {
    if (this.driverToDelete) {
      this.deleteDriver(this.driverToDelete);
      this.driverToDelete = null;
    }
  }

  deleteDriver(driver: Driver): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.driverService.deleteDriver(driver.id).subscribe({
      next: () => {
        // Remove driver from local array
        this.drivers = this.drivers.filter(d => d.id !== driver.id);
        this.applyFilters();
        this.calculateStatistics();
        this.isLoading = false;

        this.successMessage = `Driver ${driver.name} deleted successfully`;
        console.log('✅ Driver deleted:', driver.name);

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('❌ Error deleting driver:', error);
        this.errorMessage = error.message || 'Failed to delete driver. Please try again.';
        this.isLoading = false;

        if (error.message && error.message.includes('403')) {
          this.errorMessage = 'You do not have permission to delete drivers';
        }
      }
    });
  }

  refreshDrivers(): void {
    this.searchQuery = '';
    this.selectedStatus = 'All Status';
    this.loadDrivers();
  }
}
