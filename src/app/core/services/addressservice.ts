import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
export interface AddressDto {
  street: string;
  city: string;
  governorate: string;
  postalcode: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
    private readonly apiUrl =environment.apiUrl;


}
