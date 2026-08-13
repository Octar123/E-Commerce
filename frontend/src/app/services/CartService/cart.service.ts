import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { CartResponse } from '../../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/cart`;

  constructor(private http: HttpClient) {}

  addToCart(id: number, quantity: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${id}/add`, { quantity });
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/`);
  }

  updateQuantity(itemId: number, quantity: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/${itemId}/update`, {
      quantity,
    });
  }

  deleteCartItem(itemId: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${itemId}/delete`);
  }

  clearCart(): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/clear`);
  }

  getCartTotal(): Observable<{ totalAmount: number }> {
    return this.http.get<{ totalAmount: number }>(`${this.apiUrl}/total`);
  }
}
