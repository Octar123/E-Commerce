import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { Category, SubCategory, Type } from '../../models/taxonomy.model';
import { UserData } from '../../models/user.model';

export interface AdminUser extends UserData {
  email: string;
  isLocked: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/admin`;

  constructor(private http: HttpClient) {}

  // Products
  addProduct(formData: FormData): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/add`, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}/delete`);
  }

  // Taxonomy reads
  getTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.apiUrl}/getTypes`);
  }

  getCategories(typeId: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/${typeId}/getCategory`);
  }

  getSubCategories(categoryId: number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.apiUrl}/${categoryId}/getSubCategory`,
    );
  }

  // Taxonomy writes
  addType(name: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/addType`, { name });
  }

  addCategory(typeId: number, name: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${typeId}/addCategory`, {
      name,
    });
  }

  addSubCategory(categoryId: number, name: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${categoryId}/addSubCategory`,
      { name },
    );
  }

  updateType(typeId: number, name: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${typeId}/updateType`, {
      name,
    });
  }

  updateCategory(categoryId: number, name: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${categoryId}/updateCategory`,
      { name },
    );
  }

  updateSubCategory(
    subCategoryId: number,
    name: string,
  ): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.apiUrl}/${subCategoryId}/updateSubCategory`,
      { name },
    );
  }

  deleteType(typeId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${typeId}/deleteType`);
  }

  deleteCategory(categoryId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${categoryId}/deleteCategory`,
    );
  }

  deleteSubCategory(subCategoryId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.apiUrl}/${subCategoryId}/deleteSubCategory`,
    );
  }

  // Users
  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/users`);
  }

  lockUser(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}/lock`);
  }

  unlockUser(id: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${id}/unlock`);
  }

  // Orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }

  getOrderDetail(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${id}`);
  }

  // Convenience: search products via public product API for admin listing
  searchProducts(page = 1): Observable<{ data: Product[] }> {
    return this.http.get<{ data: Product[] }>(
      `${environment.apiBaseUrl}/api/product/search`,
      { params: { page: page.toString() } },
    );
  }
}
