import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from '../../service/supplierservice';
import { AvailableMaterial, CartItem } from '../../models/supplier.models';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-supplier-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar],
  templateUrl: './supplier-dashboard.html',
  styleUrls: ['./supplier-dashboard.css']
})
export class SupplierDashboardComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  materials = signal<AvailableMaterial[]>([]);
  cart = signal<CartItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  quantities: { [key: string]: number } = {};

  ngOnInit() {
    this.loadMaterials();
  }

  loadMaterials() {
    this.loading.set(true);
    this.supplierService.getAvailableMaterials().subscribe({
      next: (data) => {
        this.materials.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load materials');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  addToCart(material: AvailableMaterial) {
    const quantity = this.quantities[material.materialId] || 1;

    if (quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    if (quantity > material.availableQuantity) {
      alert(`Only ${material.availableQuantity} kg available`);
      return;
    }

    const existingItem = this.cart().find(
      item => item.material.materialId === material.materialId
    );

    if (existingItem) {
      // Update quantity
      const updatedCart = this.cart().map(item => {
        if (item.material.materialId === material.materialId) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            totalPrice: (item.quantity + quantity) * material.sellingPrice
          };
        }
        return item;
      });
      this.cart.set(updatedCart);
    } else {
      // Add new item
      this.cart.update(items => [
        ...items,
        {
          material,
          quantity,
          totalPrice: quantity * material.sellingPrice
        }
      ]);
    }

    // Reset quantity input
    this.quantities[material.materialId] = 1;
  }

  removeFromCart(materialId: string) {
    this.cart.update(items => items.filter(item => item.material.materialId !== materialId));
  }

  getTotalAmount(): number {
    return this.cart().reduce((sum, item) => sum + item.totalPrice, 0);
  }

  getTotalItems(): number {
    return this.cart().reduce((sum, item) => sum + item.quantity, 0);
  }

  proceedToCheckout() {
    if (this.cart().length === 0) {
      alert('Your cart is empty');
      return;
    }

    sessionStorage.setItem('supplierCart', JSON.stringify(this.cart()));
    this.router.navigate(['/supplier/checkout']);
  }
}