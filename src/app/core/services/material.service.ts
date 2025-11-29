import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Material } from '../models/material.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = `${environment.apiUrl}/Materials`;

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    console.error('Error Status:', error.status);
    console.error('Error Body:', error.error); // ← This will show backend validation errors

    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.errors) {
      // Handle ASP.NET validation errors
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

  createMaterial(material: any): Observable<Material> {
    const payload = {
      name: material.name || '',
      description: material.description || '',
      unit: material.unit || 'kg',
      icon: material.icon || '♻️',
      image: material.image || '',
      buyingPrice: Number(material.buyingPrice) || 0,
      sellingPrice: Number(material.sellingPrice) || 0,
      pricePerKg: Number(material.pricePerKg) || 0,
      status: material.status || 'active'
    };

    console.log('Sending payload to backend:', payload); // ← Debug log

    return this.http.post<Material>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  updateMaterial(id: string, material: any): Observable<Material> {
    const payload = {
      name: material.name || '',
      description: material.description || '',
      unit: material.unit || 'kg',
      icon: material.icon || '♻️',
      image: material.image || '',
      buyingPrice: Number(material.buyingPrice) || 0,
      sellingPrice: Number(material.sellingPrice) || 0,
      pricePerKg: Number(material.pricePerKg) || 0,
      status: material.status || 'active'
    };

    console.log('Updating material:', id, payload); // ← Debug log

    return this.http.put<Material>(`${this.apiUrl}/${id}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  deleteMaterial(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
