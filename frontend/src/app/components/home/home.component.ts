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
  readonly isLoading = signal<boolean>(true);
  readonly isError = signal<boolean>(false);
  readonly isTakingLong = signal<boolean>(false);

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Show a helpful tip if the backend takes longer than 4 seconds to respond
    setTimeout(() => {
      if (this.isLoading()) {
        this.isTakingLong.set(true);
      }
    }, 4000);

    this.productService.getTaxonomy().subscribe({
      next: (data) => this.taxonomy.set(data.types ?? []),
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    this.productService.getProducts({ page: 1 }).subscribe({
      next: (data) => {
        this.trendingProducts.set((data.data ?? []).slice(0, 4));
        this.isLoading.set(false);
        this.isError.set(false);
      },
      error: (err) => {
        console.error('Error loading trending products:', err);
        this.isLoading.set(false);
        this.isError.set(true);
      }
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

  retry(): void {
    this.isLoading.set(true);
    this.isError.set(false);
    this.isTakingLong.set(false);
    this.ngOnInit();
  }
}
