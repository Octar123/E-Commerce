import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { OrderService } from '../../../services/OrderService/order.service';
import { Order } from '../../../models/order.model';

@Component({
  selector: 'app-order',
  imports: [CommonModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  readonly orders = signal<Order[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly expandedId = signal<string | null>(null);

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.error.set(null);
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        console.log(data)
        this.orders.set(data ? [data] : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load orders.');
        this.loading.set(false);
      },
    });
  }

  toggleExpand(orderId: string): void {
    this.expandedId.update((current) =>
      current === orderId ? null : orderId,
    );
  }

  formatPayment(method: string): string {
    return method
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
