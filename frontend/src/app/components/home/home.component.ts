import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/ProductService/product.service';
import { Router } from '@angular/router';
import { Type } from '../../models/taxonomy.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  readonly taxonomy = signal<Type[]>([]);
  readonly trendingProducts = signal<Product[]>([]);

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productService.getTaxonomy().subscribe({
      next: (data) => this.taxonomy.set(data.types ?? []),
    });

    this.productService.getProducts({ page: 1 }).subscribe({
      next: (data) => this.trendingProducts.set((data.data ?? []).slice(0, 4)),
    });
  }

  loadProducts(): void {
    this.router.navigate(['/products']);
  }

  loadProductWithType(typeId: number): void {
    this.router.navigate(['/products'], { queryParams: { typeId } });
  }

  getDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }

  viewAllProducts(): void {
    this.router.navigate(['/products']);
  }
}
