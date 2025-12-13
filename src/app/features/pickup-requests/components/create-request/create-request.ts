import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { PickupRequestService } from '../../services/pickup-request.service';
import { AddressService } from '../../services/address.service';
import { MaterialService } from '../../services/material.service';
import { Address } from '../../models/address.model';
import { Material } from '../../models/material.model';
import { CreatePickupRequestDto } from '../../models/create-request.dto';

@Component({
  selector: 'app-create-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-request.html',
  styleUrls: ['./create-request.css']
})
export class CreateRequest implements OnInit {
  requestForm: FormGroup;
  addresses: Address[] = [];
  materials: Material[] = [];
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private pickupRequestService: PickupRequestService,
    private addressService: AddressService,
    private materialService: MaterialService,
    private router: Router
  ) {
    this.requestForm = this.fb.group({
      addressId: ['', Validators.required],
      preferredPickupDate: ['', Validators.required],
      notes: [''],
      materials: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadAddresses();
    this.loadMaterials();
    this.addMaterialRow(); // Add one empty row by default
  }

  get materialsFormArray(): FormArray {
    return this.requestForm.get('materials') as FormArray;
  }

  loadAddresses(): void {
    this.addressService.getMyAddresses().subscribe({
      next: (data: Address[]) => {
        this.addresses = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading addresses:', err);
        this.error = 'Failed to load addresses';
      }
    });
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.materialService.getAll(false).subscribe({
      next: (data: Material[]) => {
        this.materials = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading materials:', err);
        this.error = 'Failed to load materials';
        this.isLoading = false;
      }
    });
  }

  addMaterialRow(): void {
    const materialGroup = this.fb.group({
      materialId: ['', Validators.required],
      estimatedWeight: ['', [Validators.required, Validators.min(0.1)]]
    });
    this.materialsFormArray.push(materialGroup);
  }

  removeMaterialRow(index: number): void {
    if (this.materialsFormArray.length > 1) {
      this.materialsFormArray.removeAt(index);
    }
  }

  getMaterialPrice(materialId: string): number {
    const material = this.materials.find(m => m.id === materialId);
    return material ? material.pricePerKg : 0;
  }

  calculateMaterialTotal(index: number): number {
    const material = this.materialsFormArray.at(index).value;
    const price = this.getMaterialPrice(material.materialId);
    const weight = parseFloat(material.estimatedWeight) || 0;
    return price * weight;
  }

  calculateGrandTotal(): number {
    let total = 0;
    for (let i = 0; i < this.materialsFormArray.length; i++) {
      total += this.calculateMaterialTotal(i);
    }
    return total;
  }

  calculateTotalWeight(): number {
    let total = 0;
    this.materialsFormArray.controls.forEach(control => {
      const weight = parseFloat(control.get('estimatedWeight')?.value) || 0;
      total += weight;
    });
    return total;
  }

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.markFormGroupTouched(this.requestForm);
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.requestForm.value;
    const createDto: CreatePickupRequestDto = {
      addressId: formValue.addressId,
      preferredPickupDate: new Date(formValue.preferredPickupDate),
      notes: formValue.notes || undefined,
      materials: formValue.materials.map((m: any) => ({
        materialId: m.materialId,
        estimatedWeight: parseFloat(m.estimatedWeight)
      }))
    };

    this.pickupRequestService.create(createDto).subscribe({
      next: (response) => {
        alert('The pickup request has been created successfully.');
        this.router.navigate(['/pickup-requests/my-requests']);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Failed to create pickup request.';
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/pickup-requests/my-requests']);
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
}