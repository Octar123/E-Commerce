import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/ProductService/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  taxonomy: any = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getTaxonomy().subscribe((data) => {
      this.taxonomy = data.types;
    });
  }

  loadProducts(page: 1) {
    this.router.navigate(['/products'])
  }

  // loadProductWithType(typeId: number) {
  //   this.router.navigate(['/products'], {queryParams: {typeId}});
  // }
}
