import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/ProductService/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifyService } from '../../services/NotifyService/notify.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { CartService } from '../../services/CartService/cart.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  product: any = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private notifyService: NotifyService,
    private isLoggedIn: IsLoggedInService,
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    const id: number = parseInt(
      this.route.snapshot.paramMap.get('id') as string,
    );
    this.productService.getProductDetail(id).subscribe((data) => {
      this.product = data.product;
      // console.log(this.product)
    });
  }

  quantity: number = 1;

  updateQuantity(val: number) {
    if (
      this.quantity + val >= 1 &&
      this.quantity + val <= this.product.stockQuantity
    ) {
      this.quantity += val;
    }
  }

  addToCart() {
    // this.toast.show(`Added ${this.quantity} ${this.product.name} to cart`, 'success');
    // let isLoggedIn = false;
    let user = {};
    this.isLoggedIn.isLoggedIn$.subscribe((data) => {
      // console.log(data);
      if (data === null) {
        this.notifyService.show('You have to Login', false);
        this.router.navigate(['login']);
      } else {
        user = data;
        // this.cartService.addToCart(this.product.id, this.quantity).subscribe();
      }
    });
    // console.log(this.quantity);
    this.cartService.addToCart(this.product.id, this.quantity).subscribe();

    // if(this.isLoggedIn.isLoggedIn$)
  }

  async shareProduct() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      this.notifyService.show('URL copied to clipboard!', true);
    } catch (err) {
      this.notifyService.show('Failed to copy URL', false);
    }
  }
}
