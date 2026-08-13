import { Product } from './product.model';

export type PaymentMethod = 'online' | 'debit card' | 'credit card' | 'cash';

export interface OrderItem {
  id: number;
  quantity: number;
  amountAtPurchase: number;
  product: Product;
}

export interface Order {
  id: string;
  totalAmount: number;
  orderDate: string;
  paymentMethod: PaymentMethod;
  /** Backend names the OrderItem relation "orders" */
  orders: OrderItem[];
}
