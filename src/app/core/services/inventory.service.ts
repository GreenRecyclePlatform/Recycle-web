import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:5139/api/Materials';

  constructor(private http: HttpClient) {}

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error) {
      errorMessage = error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }

  getMaterials(includeInactive: boolean = false): Observable<Material[]> {
    const params = new HttpParams().set('includeInactive', includeInactive.toString());
    return this.http.get<Material[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  // Add this method for getting only active materials
  getActiveMaterials(): Observable<Material[]> {
    return this.getMaterials(false); // false = only active materials
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
      name: material.name,
      description: material.description || '',
      unit: material.unit || '',
      icon: material.icon,
      image: material.image || '',
      buyingPrice: material.buyingPrice,
      sellingPrice: material.sellingPrice,
      pricePerKg: material.pricePerKg,
      status: material.status
    };

    return this.http.post<Material>(this.apiUrl, payload).pipe(
      catchError(this.handleError)
    );
  }

  updateMaterial(id: string, material: any): Observable<Material> {
    const payload = {
      name: material.name,
      description: material.description || '',
      unit: material.unit || '',
      icon: material.icon,
      image: material.image || '',
      buyingPrice: material.buyingPrice,
      sellingPrice: material.sellingPrice,
      pricePerKg: material.pricePerKg,
      status: material.status
    };

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
