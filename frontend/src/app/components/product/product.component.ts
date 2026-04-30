import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/ProductService/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) {}

  metadata: any = {};
  products: any[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.fetchData(params);
    })
  }

  private fetchData(params: any) {
    const filters = {
      page: params['page'] || 1,
      search: params['search'] || '',
      typeId: params['typeId'] || null,
      categoryId: params['categoryId'] || null,
      subCategoryId: params['subCategoryId'] || null,
      minPrice: params['minPrice'] || null,
      maxPrice: params['maxPrice'] || null
    }

    this.productService.getProducts(filters).subscribe(data => {
      this.products = data.data;
      this.metadata = data.metadata;
    })
  }

  // loadProducts(page: number) {
  //   this.productService.getProducts(page).subscribe((data) => {
  //     this.products = data.data;
  //     this.metadata = data.metadata;
  //   });
  // }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.metadata.lastPage) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
    }
  }

  // products: any[] = [
  //   {
  //     id: 1,
  //     name: 'Premium Wireless Headphones',
  //     category: 'Electronics',
  //     price: 199.99,
  //     originalPrice: 249.99,
  //     image:
  //       'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
  //     isNew: true,
  //     rating: 4.8,
  //   },
  //   {
  //     id: 2,
  //     name: 'Minimalist Leather Watch',
  //     category: 'Accessories',
  //     price: 125.0,
  //     image:
  //       'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
  //     isNew: false,
  //     rating: 4.5,
  //   },
  //   // Add more mock products as needed...
  // ];

  addToCart(product: any) {
    console.log(`Added ${product.name} to cart`);
  }
}
