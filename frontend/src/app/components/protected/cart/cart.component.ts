import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime } from 'rxjs';
import { CartService } from '../../../services/CartService/cart.service';
import { OrderService } from '../../../services/OrderService/order.service';
import { CartItem } from '../../../models/cart.model';
import { PaymentMethod } from '../../../models/order.model';
import { UserData } from '../../../models/user.model';
import { NotifyService } from '../../../services/NotifyService/notify.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  readonly cartItems = signal<CartItem[]>([]);
  readonly user = signal<UserData | null>(null);
  readonly isModalOpen = signal(false);
  readonly selectedPayment = signal<PaymentMethod | ''>('');
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly placingOrder = signal(false);

  readonly totalAmount = computed(() =>
    this.cartItems().reduce(
      (acc, item) => acc + Number(item.product.price) * item.quantity,
      0,
    ),
  );

  private readonly quantityUpdate$ = new Subject<{
    item: CartItem;
    newQty: number;
  }>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private notifyService: NotifyService,
  ) {
    this.quantityUpdate$
      .pipe(debounceTime(1000), takeUntilDestroyed())
      .subscribe(({ item, newQty }) => this.performUpdate(item, newQty));
  }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.loading.set(true);
    this.error.set(null);
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems.set(data.cartItems ?? []);
        this.user.set(data.currentUser ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load cart.');
        this.loading.set(false);
      },
    });
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQty = item.quantity + change;
    if (newQty >= 1 && newQty <= item.product.stockQuantity) {
      this.cartItems.update((items) =>
        items.map((i) =>
          i.id === item.id ? { ...i, quantity: newQty } : i,
        ),
      );
      this.quantityUpdate$.next({
        item: { ...item, quantity: newQty },
        newQty,
      });
    }
  }

  private performUpdate(item: CartItem, qty: number): void {
    this.cartService.updateQuantity(item.id, qty).subscribe({
      error: () => this.notifyService.show('Failed to update quantity', false),
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.deleteCartItem(item.id).subscribe({
      next: () => {
        this.cartItems.update((items) => items.filter((i) => i.id !== item.id));
      },
      error: () => this.notifyService.show('Failed to remove item', false),
    });
  }

  placeOrder(): void {
    if (this.cartItems().length > 0) {
      this.selectedPayment.set('');
      this.isModalOpen.set(true);
    }
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  confirmOrder(): void {
    const payment = this.selectedPayment();
    if (!payment || this.placingOrder()) {
      return;
    }

    this.placingOrder.set(true);
    this.orderService.placeOrder(payment).subscribe({
      next: () => {
        this.placingOrder.set(false);
        this.isModalOpen.set(false);
        this.cartItems.set([]);
        this.router.navigate(['/order']);
      },
      error: () => {
        this.placingOrder.set(false);
        this.notifyService.show('Failed to place order', false);
      },
    });
  }
}
