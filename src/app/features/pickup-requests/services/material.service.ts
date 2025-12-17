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

  // Get all materials (with option to include inactive)
  getMaterials(includeInactive: boolean = false): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}?includeInactive=${includeInactive}`);
  }

  // Alias for getMaterials - for backwards compatibility
  getAll(includeInactive: boolean = false): Observable<Material[]> {
    return this.getMaterials(includeInactive);
  }

  // Get only active materials
  getActiveMaterials(): Observable<Material[]> {
    return this.getMaterials(false);
  }

  // Get material by ID
  getMaterialById(id: string): Observable<Material> {
    return this.http.get<Material>(`${this.baseUrl}/${id}`);
  }

  // Alias for getMaterialById - for backwards compatibility
  getById(id: string): Observable<Material> {
    return this.getMaterialById(id);
  }

  // Create new material
  createMaterial(materialData: any, imageFile: File | null): Observable<Material> {
    const formData = new FormData();

    formData.append('name', materialData.name);
    formData.append('icon', materialData.icon);
    formData.append('description', materialData.description || '');
    formData.append('unit', materialData.unit || 'kg');
    formData.append('buyingPrice', materialData.buyingPrice.toString());
    formData.append('sellingPrice', materialData.sellingPrice.toString());
    formData.append('pricePerKg', materialData.pricePerKg.toString());
    formData.append('status', materialData.status);

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.post<Material>(this.baseUrl, formData);
  }

  // Update existing material
  updateMaterial(id: string, materialData: any, imageFile: File | null): Observable<Material> {
    const formData = new FormData();

    formData.append('name', materialData.name);
    formData.append('icon', materialData.icon);
    formData.append('description', materialData.description || '');
    formData.append('unit', materialData.unit || 'kg');
    formData.append('buyingPrice', materialData.buyingPrice.toString());
    formData.append('sellingPrice', materialData.sellingPrice.toString());
    formData.append('pricePerKg', materialData.pricePerKg.toString());
    formData.append('status', materialData.status);

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
    }

    return this.http.put<Material>(`${this.baseUrl}/${id}`, formData);
  }

  // Delete material
  deleteMaterial(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Search materials
  searchMaterials(searchTerm: string, onlyActive: boolean = true): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/search?searchTerm=${searchTerm}&onlyActive=${onlyActive}`);
  }
}
