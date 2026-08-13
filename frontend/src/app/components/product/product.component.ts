import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/ProductService/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  Product,
  ProductFilters,
  ProductSearchMetadata,
} from '../../models/product.model';

@Component({
  selector: 'app-product',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly metadata = signal<ProductSearchMetadata | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fetchData(params);
    });
  }

  private fetchData(params: Record<string, string>): void {
    const filters: ProductFilters = {
      page: params['page'] ? Number(params['page']) : 1,
      search: params['search'] || '',
      typeId: params['typeId'] ? Number(params['typeId']) : null,
      categoryId: params['categoryId'] ? Number(params['categoryId']) : null,
      subCategoryId: params['subCategoryId']
        ? Number(params['subCategoryId'])
        : null,
      minPrice: params['minPrice'] ? Number(params['minPrice']) : null,
      maxPrice: params['maxPrice'] ? Number(params['maxPrice']) : null,
    };

    this.fetchProducts(filters);
  }

  fetchProducts(filters: ProductFilters): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService.getProducts(filters).subscribe({
      next: (data) => {
        this.products.set(data.data ?? []);
        this.metadata.set(data.metadata ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load products.');
        this.loading.set(false);
      },
    });
  }

  handleFilters(filters: ProductFilters): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filters,
    });
  }

  getDetails(id: number): void {
    this.router.navigate(['/details', id]);
  }

  onPageChange(page: number): void {
    const meta = this.metadata();
    if (meta && page >= 1 && page <= meta.lastPage) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge',
      });
    }
  }
}
