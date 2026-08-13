import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../services/AdminService/admin.service';
import { Order } from '../../../models/order.model';
import { NotifyService } from '../../../services/NotifyService/notify.service';

@Component({
  selector: 'app-admin-orders',
  imports: [CommonModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent implements OnInit {
  readonly orders = signal<Order[]>([]);
  readonly selected = signal<Order | null>(null);
  readonly loading = signal(false);

  constructor(
    private adminService: AdminService,
    private notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.adminService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(Array.isArray(orders) ? orders : []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notifyService.show('Failed to load orders', false);
      },
    });
  }

  viewDetail(orderId: string): void {
    this.adminService.getOrderDetail(orderId).subscribe({
      next: (order) => this.selected.set(order),
      error: () => this.notifyService.show('Failed to load order detail', false),
    });
  }

  closeDetail(): void {
    this.selected.set(null);
  }
}
