import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/ProductService/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-product',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  constructor(private productService: ProductService, private router: Router, private route: ActivatedRoute) {}

  metadata: any = {};
  products: any[] = [];

  ngOnInit(): void {

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      replaceUrl: true
    });
    
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

    this.fetchProducts(filters);
  }

  fetchProducts(filters: any) {
    this.productService.getProducts(filters).subscribe(data => {
      this.products = data.data;
      this.metadata = data.metadata;
    })
  }

  handleFilters(filters: any) {
    this.router.navigate([], {relativeTo: this.route,queryParams: filters});
  }

  getDetails(id: number){
    this.router.navigate(['/details'])
  }


  onPageChange(page: number) {
    if (page >= 1 && page <= this.metadata.lastPage) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page },
        queryParamsHandling: 'merge'
      });
    }
  }


}
