import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';  // ✅ Fixed path
import {
  PickupRequest,
  PickupRequestFilter,
  PickupRequestPagedResponse
} from '../models/pickup-request.model';
import {
  CreatePickupRequestDto,
  UpdatePickupRequestDto,
  UpdateStatusDto
} from '../models/create-request.dto';

@Injectable({
  providedIn: 'root'
})
export class PickupRequestService {
  private readonly baseUrl = `${environment.apiUrl}/pickuprequests`;

  constructor(private http: HttpClient) { }

  /**
   * Get all pickup requests (Admin only)
   */
  getAll(): Observable<PickupRequest[]> {
    return this.http.get<PickupRequest[]>(this.baseUrl);
  }

  /**
   * Get pickup request by ID
   */
  getById(id: string): Observable<PickupRequest> {
    return this.http.get<PickupRequest>(`${this.baseUrl}/${id}`);
  }

  /**
   * Get current user's pickup requests
   */
  getMyRequests(): Observable<PickupRequest[]> {
    return this.http.get<PickupRequest[]>(`${this.baseUrl}/my-requests`);
  }

  /**
   * Get pickup requests by status (Admin only)
   */
  getByStatus(status: string): Observable<PickupRequest[]> {
    return this.http.get<PickupRequest[]>(`${this.baseUrl}/status/${status}`);
  }

  /**
   * Filter pickup requests with pagination
   */
  filter(filter: PickupRequestFilter): Observable<PickupRequestPagedResponse> {
    return this.http.post<PickupRequestPagedResponse>(
      `${this.baseUrl}/filter`,
      filter
    );
  }

  /**
   * Create a new pickup request
   */
  create(request: CreatePickupRequestDto): Observable<PickupRequest> {
    return this.http.post<PickupRequest>(this.baseUrl, request);
  }

  /**
   * Update an existing pickup request
   */
  update(id: string, request: UpdatePickupRequestDto): Observable<PickupRequest> {
    return this.http.put<PickupRequest>(`${this.baseUrl}/${id}`, request);
  }

  /**
   * Delete a pickup request
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update pickup request status (Admin/Driver only)
   */
  updateStatus(id: string, newStatus: string): Observable<{ message: string }> {
    const dto: UpdateStatusDto = { newStatus };
    return this.http.patch<{ message: string }>(
      `${this.baseUrl}/${id}/status`,
      dto
    );
  }
}