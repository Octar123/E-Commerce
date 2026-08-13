import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { Order, PaymentMethod } from '../../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/order`;

  constructor(private http: HttpClient) {}

  placeOrder(paymentMethod: PaymentMethod | string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/place`, {
      paymentMethod,
    });
  }

  getAllOrders(): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/all`);
  }

  getOrderDetail(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }
}
