import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private readonly baseUrl = `${environment.apiUrl}/addresses`;

  constructor(private http: HttpClient) { }

  getMyAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(this.baseUrl);
  }

  getById(id: string): Observable<Address> {
    return this.http.get<Address>(`${this.baseUrl}/${id}`);
  }

  create(address: Omit<Address, 'id' | 'userId'>): Observable<Address> {
    return this.http.post<Address>(this.baseUrl, address);
  }
}