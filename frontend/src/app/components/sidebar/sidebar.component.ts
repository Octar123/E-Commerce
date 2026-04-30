import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/ProductService/product.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<any>();

  types: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getTaxonomy().subscribe((data) => {
      this.types = data.types;
    });
  }

  filters: any = {
    search: '',
    minPrice: null,
    maxPrice: null,
    subCategoryId: null,
    categoryId: null,
    typeId: null,
    page: 1
  };

  applyFilters() {
    this.filterChanged.emit(this.filters);
  }

  toggleType(id: number) {
    this.filters.typeId = this.filters.typeId === id ? null : id;
    this.filters.categoryId = null;
    this.filters.subCategoryId = null;
    this.applyFilters();
  }

  toggleCategory(id: number) {
    this.filters.categoryId = this.filters.categoryId === id ? null : id;
    this.filters.subCategoryId = null;
    this.applyFilters();
  }

  selectSubCategory(id: number) {
    this.filters.subCategoryId = this.filters.subCategoryId === id ? null : id;
    this.applyFilters();
  }
}
