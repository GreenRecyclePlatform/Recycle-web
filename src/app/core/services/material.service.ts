// src/app/core/services/material.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Material } from '../models/material.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = `${environment.apiUrl}/Materials`;

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    console.error('Error Status:', error.status);
    console.error('Error Body:', error.error);

    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors) {
      const validationErrors = error.error.errors;
      errorMessage = Object.keys(validationErrors)
        .map(key => `${key}: ${validationErrors[key].join(', ')}`)
        .join('\n');
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Formatted Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getMaterials(includeInactive: boolean = false): Observable<Material[]> {
    const params = new HttpParams().set('includeInactive', includeInactive.toString());
    return this.http.get<Material[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  getActiveMaterials(): Observable<Material[]> {
    return this.getMaterials(false);
  }

  getMaterialById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchMaterials(searchTerm: string, onlyActive: boolean = true): Observable<Material[]> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('onlyActive', onlyActive.toString());

    return this.http.get<Material[]>(`${this.apiUrl}/search`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  createMaterial(material: any, imageFile: File | null): Observable<Material> {
    const formData = new FormData();

    formData.append('name', material.name || '');
    formData.append('description', material.description || '');
    formData.append('unit', material.unit || 'kg');
    formData.append('icon', material.icon || '♻️');
    formData.append('buyingPrice', material.buyingPrice?.toString() || '0');
    formData.append('sellingPrice', material.sellingPrice?.toString() || '0');
    formData.append('pricePerKg', material.pricePerKg?.toString() || '0');
    formData.append('status', material.status || 'active');

    if (imageFile) {
      formData.append('Image', imageFile, imageFile.name);
    }

    console.log('📤 Sending FormData to backend');

    return this.http.post<Material>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  updateMaterial(id: string, material: any, imageFile: File | null): Observable<Material> {
    const formData = new FormData();

    formData.append('name', material.name || '');
    formData.append('description', material.description || '');
    formData.append('unit', material.unit || 'kg');
    formData.append('icon', material.icon || '♻️');
    formData.append('buyingPrice', material.buyingPrice?.toString() || '0');
    formData.append('sellingPrice', material.sellingPrice?.toString() || '0');
    formData.append('pricePerKg', material.pricePerKg?.toString() || '0');
    formData.append('status', material.status || 'active');

    if (imageFile) {
      formData.append('Image', imageFile, imageFile.name);
    }

    console.log('📤 Updating material with FormData:', id);

    return this.http.put<Material>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteMaterial(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
