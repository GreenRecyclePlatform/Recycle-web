
export interface AvailableMaterial {
  materialId: string;
  name: string;
  description: string | null;
  icon: string;
  imageUrl: string | null;
  sellingPrice: number;
  unit: string;
  isActive: boolean;
  availableQuantity: number;
}

export interface OrderItemInput {
  materialId: string;
  quantity: number;
}

export interface CreateSupplierOrderDto {
  items: OrderItemInput[];
}

export interface OrderItemResponse {
  materialId: string;
  materialName: string;
  materialIcon: string;
  quantity: number;
  pricePerKg: number;
  totalPrice: number;
}

export interface SupplierOrderResponse {
  orderId: string;
  supplierId: string;
  supplierCompanyName: string;
  orderDate: string;
  totalAmount: number;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  paidAt: string | null;
  createdAt: string;
  items: OrderItemResponse[];
}

export interface PaymentIntentDto {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  orderId: string;
}

export interface ConfirmPaymentDto {
  orderId: string;
  paymentIntentId: string;
}

export interface CartItem {
  material: AvailableMaterial;
  quantity: number;
  totalPrice: number;
}