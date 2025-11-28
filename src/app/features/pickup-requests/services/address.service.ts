// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../../environments/environment';
// import { Address } from '../models/address.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class AddressService {
//   private readonly baseUrl = `${environment.apiUrl}/addresses`;

//   constructor(private http: HttpClient) { }

//   getMyAddresses(): Observable<Address[]> {
//     return this.http.get<Address[]>(this.baseUrl);
//   }

//   getById(id: string): Observable<Address> {
//     return this.http.get<Address>(`${this.baseUrl}/${id}`);
//   }

//   create(address: Omit<Address, 'id' | 'userId'>): Observable<Address> {
//     return this.http.post<Address>(this.baseUrl, address);
//   }
// }
// src/app/features/pickup-requests/services/address.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Address } from '../models/address.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}${API_ENDPOINTS.ADDRESSES.getAll}`);
  }

  getById(id: string): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}${API_ENDPOINTS.ADDRESSES.getById(id)}`);
  }

  create(address: Omit<Address, 'id' | 'userId'>): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}${API_ENDPOINTS.ADDRESSES.create}`, address);
  }

  update(id: string, address: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.apiUrl}${API_ENDPOINTS.ADDRESSES.update(id)}`, address);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${API_ENDPOINTS.ADDRESSES.delete(id)}`);
  }
}