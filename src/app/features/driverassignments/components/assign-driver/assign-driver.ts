import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Request } from '../../models/request';
import { Driver } from '../../models/driver';
import { AssignmentRequest } from '../../models/assignment';
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

  constructor(private driverService: DriverService) {}

  ngOnInit(): void {
    this.loadData();
  }

  // تحميل البيانات من الداتابيز
  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // جلب الطلبات المعتمدة
    this.driverService.getApprovedRequests().subscribe({
      next: (requests) => {
        this.approvedRequests = requests;
        console.log('✅ Approved Requests loaded:', requests);
      },
      error: (error) => {
        this.errorMessage = error.message || 'فشل في تحميل الطلبات';
        console.error('❌ Error loading requests:', error);
      }
    });

    // جلب السائقين المتاحين
    this.driverService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.availableDrivers = drivers;
        this.isLoading = false;
        console.log('✅ Available Drivers loaded:', drivers);
      },
      error: (error) => {
        this.errorMessage = error.message || 'فشل في تحميل السائقين';
        this.isLoading = false;
        console.error('❌ Error loading drivers:', error);
      }
    });
  }

  selectRequest(request: Request): void {
    this.selectedRequest = request;
    console.log('📋 Selected Request:', request);
  }

  assignToDriver(driver: Driver): void {
    if (!this.selectedRequest) {
      return;
    }

    // تأكيد التعيين
    const confirmed = confirm(
      `هل أنت متأكد من تعيين الطلب ${this.selectedRequest.id} للسائق ${driver.name}؟`
    );

    if (!confirmed) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const assignment: AssignmentRequest = {
      requestId: this.selectedRequest.id,
      driverId: driver.id
    };

    this.driverService.assignRequestToDriver(assignment).subscribe({
      next: (response) => {
        console.log('✅ Assignment successful:', response);
        
        // إظهار رسالة نجاح
        alert(`تم تعيين الطلب ${this.selectedRequest?.id} للسائق ${driver.name} بنجاح!`);
        
        // إزالة الطلب من القائمة
        this.approvedRequests = this.approvedRequests.filter(
          req => req.id !== this.selectedRequest?.id
        );
        
        // تحديث عدد المشاوير للسائق
        driver.todayPickups++;
        
        // إعادة تعيين الطلب المحدد
        this.selectedRequest = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message || 'فشل في تعيين الطلب للسائق';
        this.isLoading = false;
        console.error('❌ Error assigning request:', error);
        alert(`خطأ: ${this.errorMessage}`);
      }
    });
  }

  // إعادة تحميل البيانات
  refreshData(): void {
    this.selectedRequest = null;
    this.loadData();
  }
}