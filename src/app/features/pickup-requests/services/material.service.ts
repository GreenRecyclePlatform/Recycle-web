import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private readonly baseUrl = `${environment.apiUrl}/materials`;

  constructor(private http: HttpClient) { }

  getAll(includeInactive: boolean = false): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}?includeInactive=${includeInactive}`);
  }

  getById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.baseUrl}/${id}`);
  }
}