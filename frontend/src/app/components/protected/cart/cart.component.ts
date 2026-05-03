import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../../services/CartService/cart.service';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = []; 
  user: any = {};

  private quantityUpdate$ = new Subject<{item: any, newQty: number}>();
  private subscription: Subscription = new Subscription();

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart(){
    this.cartService.getCart().subscribe(data => {
      this.cartItems = data.cartItems;
      this.user = data.currentUser;
    });

    this.subscription = this.quantityUpdate$.pipe(
      debounceTime(1000) 
    ).subscribe(({ item, newQty }) => {
      this.performUpdate(item, newQty);
    });
  }

  get totalAmount(): number {
    return this.cartItems.reduce(
      (acc: number, item: any) => acc + item.product.price * item.quantity,
      0,
    );
  }

  updateQuantity(item: any, change: number) {
    const newQty = item.quantity + change;
    if (newQty >= 1 && newQty <= item.product.stockQuantity) {
      item.quantity = newQty;
      this.quantityUpdate$.next({ item, newQty });
    }
  }

  private performUpdate(item: any, qty: number) {
    console.log('API call or heavy logic executed for:', item.product.name, 'New Qty:', qty);
    // Add your service call here, e.g., this.cartService.update(item.id, qty).subscribe();
    this.cartService.updateQuantity(item.id, qty).subscribe();
  }

  removeItem(index: number, item:any) {
    this.cartService.deleteCartItem(item.id).subscribe();
    this.cartItems.splice(index, 1);
  }

  placeOrder() {
    // console.log('Order placed for:', this.cartData.currentUser.name);
    // Integrate with your OrderService here
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
