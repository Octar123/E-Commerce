import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3001/api/cart';
  constructor(private http: HttpClient) { }

  addToCart(id:number, quantity: number):Observable<any> {
    // console.log(quantity);
    return this.http.post(`${this.apiUrl}/${id}/add`, {quantity});
  }

  getCart():Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  updateQuantity(itemId:number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${itemId}/update`, {quantity})
  }

  deleteCartItem(itemId: number):Observable<any> {
    return this.http.delete(`${this.apiUrl}/${itemId}/delete`);
  }
}
