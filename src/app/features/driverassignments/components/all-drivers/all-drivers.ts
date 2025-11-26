// all-drivers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Alldriverservice } from '../../services/alldriverservice';
import { Driver } from '../../models/all-drivers';

@Component({
  selector: 'app-all-drivers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule
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
  onDutyToday: number = 0;
  averageRating: number = 0;

  // Loading and error states
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private driverService: Alldriverservice) {}

  ngOnInit(): void {
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
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
        this.errorMessage = 'Failed to load drivers. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  calculateStatistics(): void {
    this.totalDrivers = this.drivers.length;
    this.activeDrivers = this.drivers.filter(d => d.status === 'active').length;
    this.onDutyToday = this.drivers.filter(d => d.pickups.todayCount > 0).length;
    
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
        driver.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (driver.idNumber && driver.idNumber.includes(this.searchQuery));
      
      const matchesStatus = this.selectedStatus === 'All Status' || 
        driver.status === this.selectedStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }

  getStatusBadgeClass(status: string): string {
    return status.toLowerCase();
  }
/*
  onChangeStatus(driver: Driver): void {
    const newStatus = driver.status === 'active' ? 'inactive' : 'active';
    const isAvailable = newStatus === 'active';
    
    this.driverService.updateDriverAvailability(driver.id, isAvailable).subscribe({
      next: (updatedDriver) => {
        driver.status = updatedDriver.status;
        this.calculateStatistics();
        console.log(`Driver ${driver.name} status changed to ${newStatus}`);
      },
      error: (error) => {
        console.error('Error updating driver status:', error);
        alert('فشل في تحديث حالة السائق. يرجى المحاولة مرة أخرى.');
      }
    });
  }
    */

  onDriverAction(driver: Driver, action: string): void {
   
        if (confirm(`Are you sure to Delete${driver.name}؟`)) {
          this.deleteDriver(driver);
        }
        
    
  }

  deleteDriver(driver: Driver): void {
    this.driverService.deleteDriver(driver.id).subscribe({
      next: () => {
        // Remove driver from local array
        this.drivers = this.drivers.filter(d => d.id !== driver.id);
        this.applyFilters();
        this.calculateStatistics();
        console.log(`Driver ${driver.name} deleted successfully`);
      },
      error: (error) => {
        console.error('Error deleting driver:', error);
        alert('Failed to delete driver. Please try again later.');
      }
    });
  }

  refreshDrivers(): void {
    this.loadDrivers();
  }
}