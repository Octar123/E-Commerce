import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/AdminService/admin.service';
import { Product } from '../../../models/product.model';
import { SubCategory, Type } from '../../../models/taxonomy.model';
import { NotifyService } from '../../../services/NotifyService/notify.service';

@Component({
  selector: 'app-admin-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent implements OnInit {
  readonly products = signal<Product[]>([]);
  readonly types = signal<Type[]>([]);
  readonly subCategories = signal<SubCategory[]>([]);
  readonly loading = signal(false);

  form = {
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    subCategoryId: 0,
  };
  selectedFile: File | null = null;
  editingId: number | null = null;

  constructor(
    private adminService: AdminService,
    private notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadTaxonomyOptions();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.adminService.searchProducts(1).subscribe({
      next: (res) => {
        this.products.set(res.data ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notifyService.show('Failed to load products', false);
      },
    });
  }

  loadTaxonomyOptions(): void {
    this.adminService.getTypes().subscribe({
      next: (types) => {
        this.types.set(types);
        // Flatten subcategories by walking categories for each type
        const allSubs: SubCategory[] = [];
        types.forEach((type) => {
          this.adminService.getCategories(type.id).subscribe({
            next: (typeWithCats: any) => {
              const categories = typeWithCats?.categories ?? [];
              categories.forEach((cat: { id: number }) => {
                this.adminService.getSubCategories(cat.id).subscribe({
                  next: (catWithSubs: any) => {
                    const subs = catWithSubs?.subCategories ?? [];
                    allSubs.push(...subs);
                    this.subCategories.set([...allSubs]);
                  },
                });
              });
            },
          });
        });
      },
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }

  startEdit(product: Product): void {
    this.editingId = product.id;
    this.form = {
      name: product.name,
      description: product.description,
      price: Number(product.price),
      stockQuantity: product.stockQuantity,
      subCategoryId: 0,
    };
  }

  resetForm(): void {
    this.editingId = null;
    this.selectedFile = null;
    this.form = {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      subCategoryId: 0,
    };
  }

  private buildFormData(): FormData {
    const fd = new FormData();
    fd.append('name', this.form.name);
    fd.append('description', this.form.description);
    fd.append('price', String(this.form.price));
    fd.append('stockQuantity', String(this.form.stockQuantity));
    if (this.form.subCategoryId) {
      fd.append('subCategoryId', String(this.form.subCategoryId));
    }
    if (this.selectedFile) {
      fd.append('imagePath', this.selectedFile);
    }
    return fd;
  }

  saveProduct(): void {
    const fd = this.buildFormData();
    const request =
      this.editingId === null
        ? this.adminService.addProduct(fd)
        : this.adminService.updateProduct(this.editingId, fd);

    request.subscribe({
      next: () => {
        this.resetForm();
        this.loadProducts();
      },
      error: () => this.notifyService.show('Failed to save product', false),
    });
  }

  deleteProduct(id: number): void {
    this.adminService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: () => this.notifyService.show('Failed to delete product', false),
    });
  }
}
