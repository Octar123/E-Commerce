import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
products: any[] = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      category: 'Electronics',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      isNew: true,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Minimalist Leather Watch',
      category: 'Accessories',
      price: 125.00,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      isNew: false,
      rating: 4.5
    },
    // Add more mock products as needed...
  ];

  addToCart(product: any) {
    console.log(`Added ${product.name} to cart`);
  }
}
