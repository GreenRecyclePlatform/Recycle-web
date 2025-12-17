// src/app/features/supplier/pages/supplier-checkout/supplier-checkout.component.ts

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { SupplierService } from '../../service/supplierservice';
import { CartItem } from '../../models/supplier.models';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { Navbar } from '../../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-supplier-checkout',
  standalone: true,
  imports: [CommonModule,Navbar],
  templateUrl: './supplier-checkout.html',
  styleUrls: ['./supplier-checkout.css']
})
export class SupplierCheckoutComponent implements OnInit {
  private supplierService = inject(SupplierService);
  private router = inject(Router);

  cart = signal<CartItem[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showSuccessModal = signal(false); 
  
  orderId = signal<string | null>(null);
  clientSecret = signal<string | null>(null);
  
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private cardElement: StripeCardElement | null = null;

  ngOnInit() {
    this.loadCart();
    this.initializeStripe();
  }

  loadCart() {
    const cartData = sessionStorage.getItem('supplierCart');
    if (!cartData) {
      this.router.navigate(['/supplier/dashboard']);
      return;
    }
    this.cart.set(JSON.parse(cartData));
  }

  async initializeStripe() {
    try {
      console.log('🔄 Loading Stripe...');
      this.stripe = await loadStripe(environment.stripe.publishableKey);
      
      if (!this.stripe) {
        this.error.set('Failed to load Stripe. Please check your publishable key.');
        console.error('❌ Stripe failed to load');
        return;
      }

      console.log('✅ Stripe loaded successfully');
    } catch (err) {
      console.error('❌ Error loading Stripe:', err);
      this.error.set('Failed to initialize payment system');
    }
  }

  private mountCardElement() {
    if (!this.stripe) {
      console.error('❌ Stripe not initialized');
      return;
    }

    setTimeout(() => {
      const cardElementContainer = document.getElementById('card-element');
      if (!cardElementContainer) {
        console.error('❌ Card element container not found');
        return;
      }

      try {
        this.elements = this.stripe!.elements();
        this.cardElement = this.elements.create('card', {
          style: {
            base: {
              fontSize: '16px',
              color: '#1f2937',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              '::placeholder': {
                color: '#9ca3af'
              }
            },
            invalid: {
              color: '#ef4444',
              iconColor: '#ef4444'
            }
          },
          hidePostalCode: false
        });

        this.cardElement.mount('#card-element');
        console.log('✅ Card element mounted successfully');

        this.cardElement.on('change', (event) => {
          if (event.error) {
            this.error.set(event.error.message);
          } else {
            this.error.set(null);
          }
        });
      } catch (err) {
        console.error('❌ Error mounting card element:', err);
        this.error.set('Failed to initialize card input');
      }
    }, 300);
  }

  getTotalAmount(): number {
    return this.cart().reduce((sum, item) => sum + item.totalPrice, 0);
  }

  async createOrder() {
    this.loading.set(true);
    this.error.set(null);

    const orderDto = {
      items: this.cart().map(item => ({
        materialId: item.material.materialId,
        quantity: item.quantity
      }))
    };

    this.supplierService.createOrder(orderDto).subscribe({
      next: async (response) => {
        console.log('✅ Order created:', response.orderId);
        this.orderId.set(response.orderId);
        await this.createPaymentIntent(response.orderId);
      },
      error: (err) => {
        console.error('❌ Order creation failed:', err);
        this.error.set(err.error?.message || 'Failed to create order');
        this.loading.set(false);
      }
    });
  }

  async createPaymentIntent(orderId: string) {
    this.supplierService.createPaymentIntent(orderId).subscribe({
      next: (response) => {
        console.log('✅ Payment intent created');
        this.clientSecret.set(response.clientSecret);
        this.loading.set(false);
        this.mountCardElement();
      },
      error: (err) => {
        console.error('❌ Payment intent creation failed:', err);
        this.error.set('Failed to initialize payment');
        this.loading.set(false);
      }
    });
  }

  async processPayment() {
    if (!this.stripe || !this.cardElement || !this.clientSecret()) {
      this.error.set('Payment system not initialized properly');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      console.log('🔄 Processing payment...');
      console.log('Client Secret:', this.clientSecret());
      
      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        this.clientSecret()!,
        {
          payment_method: {
            card: this.cardElement,
            billing_details: {
              name: 'Test User' 
            }
          }
        }
      );

      if (error) {
        console.error('❌ Payment failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        this.error.set(error.message || 'Payment failed');
        this.loading.set(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded');
        await this.confirmPayment(paymentIntent.id);
      }
    } catch (err) {
      console.error('❌ Payment error:', err);
      this.error.set('An error occurred during payment processing');
      this.loading.set(false);
    }
  }

  async confirmPayment(paymentIntentId: string) {
    const dto = {
      orderId: this.orderId()!,
      paymentIntentId
    };

    this.supplierService.confirmPayment(dto).subscribe({
      next: () => {
        console.log('✅ Payment confirmed');
        sessionStorage.removeItem('supplierCart');
        this.loading.set(false);
        
        console.log('🎉 Showing success modal...');
        this.showSuccessModal.set(true);
        console.log('Modal state:', this.showSuccessModal());
      },
      error: (err) => {
        console.error('❌ Payment confirmation failed:', err);
        this.error.set('Payment confirmation failed');
        this.loading.set(false);
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal.set(false);
    this.router.navigate(['/supplier/orders']);
  }

  cancelCheckout() {
    this.router.navigate(['/supplier/dashboard']);
  }
}