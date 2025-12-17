import { Routes } from '@angular/router';

export const supplierRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/supplier-dashboard/supplier-dashboard').then(
        (m) => m.SupplierDashboardComponent
      ),
    title: 'Supplier Dashboard'
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/supplier-checkout/supplier-checkout').then(
        (m) => m.SupplierCheckoutComponent
      ),
    title: 'Checkout'
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/supplier-orders/supplier-orders').then(
        (m) => m.SupplierOrdersComponent
      ),
    title: 'My Orders'
  }
];