import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface ProductFilters {
  page?: number;
  search?: string;
  subCategoryId?: number;
  categoryId?: number;
  typeId?: number;
  minPrice?: number;
  maxPrice?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:3001/api/product';

  constructor(private http: HttpClient) { }

  getProducts(filters: ProductFilters):Observable<any>{
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if(value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/search`, { params});
  }

  getTaxonomy(): Observable<any> {
    return this.http.get(`${this.apiUrl}/taxo`);
  }

  getProductDetail(id: number): Observable<any>{
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // addToCart():Observable<any> {

  // }
}
