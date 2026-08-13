import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/AdminService/admin.service';
import { Category, SubCategory, Type } from '../../../models/taxonomy.model';
import { NotifyService } from '../../../services/NotifyService/notify.service';

@Component({
  selector: 'app-admin-taxonomy',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-taxonomy.component.html',
  styleUrl: './admin-taxonomy.component.css',
})
export class AdminTaxonomyComponent implements OnInit {
  readonly types = signal<Type[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly subCategories = signal<SubCategory[]>([]);

  selectedTypeId: number | null = null;
  selectedCategoryId: number | null = null;

  newTypeName = '';
  newCategoryName = '';
  newSubCategoryName = '';

  constructor(
    private adminService: AdminService,
    private notifyService: NotifyService,
  ) {}

  ngOnInit(): void {
    this.loadTypes();
  }

  loadTypes(): void {
    this.adminService.getTypes().subscribe({
      next: (types) => this.types.set(types),
      error: () => this.notifyService.show('Failed to load types', false),
    });
  }

  selectType(typeId: number): void {
    this.selectedTypeId = typeId;
    this.selectedCategoryId = null;
    this.subCategories.set([]);
    this.adminService.getCategories(typeId).subscribe({
      next: (res: any) => this.categories.set(res?.categories ?? []),
      error: () => this.notifyService.show('Failed to load categories', false),
    });
  }

  selectCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.adminService.getSubCategories(categoryId).subscribe({
      next: (res: any) => this.subCategories.set(res?.subCategories ?? []),
      error: () =>
        this.notifyService.show('Failed to load subcategories', false),
    });
  }

  addType(): void {
    if (!this.newTypeName.trim()) return;
    this.adminService.addType(this.newTypeName.trim()).subscribe({
      next: () => {
        this.newTypeName = '';
        this.loadTypes();
      },
    });
  }

  addCategory(): void {
    if (!this.selectedTypeId || !this.newCategoryName.trim()) return;
    this.adminService
      .addCategory(this.selectedTypeId, this.newCategoryName.trim())
      .subscribe({
        next: () => {
          this.newCategoryName = '';
          this.selectType(this.selectedTypeId!);
        },
      });
  }

  addSubCategory(): void {
    if (!this.selectedCategoryId || !this.newSubCategoryName.trim()) return;
    this.adminService
      .addSubCategory(this.selectedCategoryId, this.newSubCategoryName.trim())
      .subscribe({
        next: () => {
          this.newSubCategoryName = '';
          this.selectCategory(this.selectedCategoryId!);
        },
      });
  }

  deleteType(id: number): void {
    this.adminService.deleteType(id).subscribe({
      next: () => {
        if (this.selectedTypeId === id) {
          this.selectedTypeId = null;
          this.categories.set([]);
          this.subCategories.set([]);
        }
        this.loadTypes();
      },
    });
  }

  deleteCategory(id: number): void {
    this.adminService.deleteCategory(id).subscribe({
      next: () => {
        if (this.selectedTypeId) this.selectType(this.selectedTypeId);
      },
    });
  }

  deleteSubCategory(id: number): void {
    this.adminService.deleteSubCategory(id).subscribe({
      next: () => {
        if (this.selectedCategoryId) this.selectCategory(this.selectedCategoryId);
      },
    });
  }
}
