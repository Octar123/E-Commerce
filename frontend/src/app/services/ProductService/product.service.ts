import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProductFilters,
  ProductSearchResponse,
} from '../../models/product.model';
import { TaxonomyResponse } from '../../models/taxonomy.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/product`;

  constructor(private http: HttpClient) {}

  getProducts(filters: ProductFilters): Observable<ProductSearchResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<ProductSearchResponse>(`${this.apiUrl}/search`, {
      params,
    });
  }

  getTaxonomy(): Observable<TaxonomyResponse> {
    return this.http.get<TaxonomyResponse>(`${this.apiUrl}/taxo`);
  }

  getProductDetail(id: number): Observable<{ product: import('../../models/product.model').Product }> {
    return this.http.get<{ product: import('../../models/product.model').Product }>(
      `${this.apiUrl}/${id}`,
    );
  }
}
