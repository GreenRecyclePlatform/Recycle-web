
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Request, PickupRequest } from '../models/request';
import { Driver, DriverApiResponse } from '../models/driver';
import { AssignmentRequest } from '../models/assignment';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  // ✅ الـ URL بتاع الـ API بتاعك
  private readonly apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  //  Headers (without Token until Login)
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    //after login, use this:
    // const token = localStorage.getItem('token');
    // return new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${token}`
    // });
  }

  //    (Pending)
  getApprovedRequests(): Observable<Request[]> {
    return this.http.get<PickupRequest[]>(
      `${this.apiUrl}/PickupRequests/status/Pending`,
      { headers: this.getHeaders() }
    ).pipe(
      // تحويل الـ Response لـ Interface بتاع الـ Component
      map(requests => requests.map(req => ({
        id: req.requestId,
        customerName: req.userName,
        address: req.fullAddress,
        material: this.getMaterialsText(req.materials),
        weight: req.totalEstimatedWeight,
        status: req.status
      }))),
      catchError(this.handleError)
    );
  }

  //  السائقين المتاحين
  getAvailableDrivers(): Observable<Driver[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/DriverAssignments/available-drivers`,
      { headers: this.getHeaders() }
    ).pipe(
      map(drivers => drivers.map(driver => ({
        id: driver.driverId,
        name: driver.driverName,
        initials: this.getInitials(driver.driverName),
        rating: driver.rating || 0,
        currentLocation: 'Available',
        phone: driver.phoneNumber,
        todayPickups: driver.totalTrips || 0
      }))),
      catchError(this.handleError)
    );
  }

  // تعيين طلب لسائق
  assignRequestToDriver(assignment: AssignmentRequest): Observable<any> {
    console.log('🔍 Assignment data being sent:', assignment);
    console.log('🔍 Request URL:', `${this.apiUrl}/DriverAssignments/assign`);
    
    return this.http.post(
      `${this.apiUrl}/DriverAssignments/assign`,
      assignment,
      { 
        headers: this.getHeaders(),
        observe: 'response' // عشان نشوف الـ response كامل
      }
    ).pipe(
      map((response: any) => {
        console.log('✅ Full Response:', response);
        return response.body;
      }),
      catchError(this.handleError)
    );
  }

  // Helper: لتحويل المواد لنص
  private getMaterialsText(materials: any[]): string {
    if (!materials || materials.length === 0) {
      return 'Mixed Materials';
    }
    return materials.map(m => m.materialName || m.name).join(', ');
  }

  // Helper: لاستخراج الأحرف الأولى من الاسم
  private getInitials(name: string): string {
    if (!name) return 'NA';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  // معالجة الأخطاء
  private handleError(error: any) {
    let errorMessage = 'حدث خطأ في الاتصال بالسيرفر';
    
    console.log('🔴 Full Error Object:', error);
    console.log('🔴 Error Status:', error.status);
    console.log('🔴 Error error property:', error.error);
    
    // محاولة طباعة كل خصائص error.error
    if (error.error) {
      console.log('🔴 Error keys:', Object.keys(error.error));
      console.log('🔴 Error stringified:', JSON.stringify(error.error));
    }
    
    if (error.status === 400) {
      errorMessage = 'خطأ في البيانات المرسلة (400 Bad Request)';
      
      if (error.error?.errors) {
        console.log('🔴 Validation Errors:', error.error.errors);
        const validationErrors = Object.values(error.error.errors).flat().join(', ');
        errorMessage += ': ' + validationErrors;
      } else if (error.error?.message) {
        errorMessage += ': ' + error.error.message;
      } else if (typeof error.error === 'string') {
        errorMessage += ': ' + error.error;
      }
    } else if (error.status === 401) {
      errorMessage = 'غير مصرح لك بالدخول - يرجى تسجيل الدخول مرة أخرى';
    } else if (error.status === 403) {
      errorMessage = 'ليس لديك صلاحية Admin للوصول لهذه البيانات';
    } else if (error.status === 0) {
      errorMessage = 'لا يمكن الاتصال بالسيرفر - تأكد من تشغيل الـ Backend';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `خطأ: ${error.error.message}`;
    } else {
      errorMessage = error.error?.message || `خطأ ${error.status}: ${error.message}`;
    }
    
    console.error('❌ Final Error Message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}