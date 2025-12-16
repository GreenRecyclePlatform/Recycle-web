import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PickupRequestService } from '../../services/pickup-request.service';
import { AddressService } from '../../services/address.service';
import { MaterialService } from '../../services/material.service';
import { Address } from '../../models/address.model';
import { Material } from '../../models/material.model';
import { UpdatePickupRequestDto } from '../../models/create-request.dto';
import { PickupRequest } from '../../models/pickup-request.model';


@Component({
  selector: 'app-edit-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-request.html',
  styleUrls: ['./edit-request.css']
})
export class EditRequest implements OnInit {
  requestForm: FormGroup;
  addresses: Address[] = [];
  materials: Material[] = [];
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;
  requestId: string = '';
  existingRequest: PickupRequest | null = null;

  constructor(
    private fb: FormBuilder,
    private pickupRequestService: PickupRequestService,
    private addressService: AddressService,
    private materialService: MaterialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.requestForm = this.fb.group({
      addressId: ['', Validators.required],
      preferredPickupDate: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.requestId = this.route.snapshot.paramMap.get('id') || '';
    if (this.requestId) {
      this.loadRequestDetails();
      this.loadAddresses();
    } else {
      this.error = 'Invalid request ID';
    }
  }

  loadRequestDetails(): void {
    this.isLoading = true;
    this.pickupRequestService.getById(this.requestId).subscribe({
      next: (request: PickupRequest) => {
        this.existingRequest = request;

        // Check if request can be edited
        if (request.status !== 'Pending' && request.status !== 'Waiting') {
          this.error = `Cannot edit request with status '${request.status}'`;
          this.isLoading = false;
          return;
        }

        // Populate form with existing data
        this.requestForm.patchValue({
          addressId: request.addressId,
          preferredPickupDate: new Date(request.preferredPickupDate).toISOString().split('T')[0],
          notes: request.notes || ''
        });

        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading request:', err);
        this.error = 'Failed to load request details';
        this.isLoading = false;
      }
    });
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

  onSubmit(): void {
    if (this.requestForm.invalid) {
      this.markFormGroupTouched(this.requestForm);
      this.error = 'Please fill out all required fields correctly.';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const formValue = this.requestForm.value;
    const updateDto: UpdatePickupRequestDto = {
      addressId: formValue.addressId,
      preferredPickupDate: new Date(formValue.preferredPickupDate),
      notes: formValue.notes || undefined
    };

    this.pickupRequestService.update(this.requestId, updateDto).subscribe({
      next: (response) => {
        alert('Request updated successfully!');
        this.router.navigate(['/pickup-requests/details', this.requestId]);
      },
      error: (err: HttpErrorResponse) => {
        this.error = err.error?.message || 'Failed to update request.';
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(form: FormGroup | FormArray): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/pickup-requests/details', this.requestId]);
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return `${amount.toFixed(2)} EGP`;
  }
}