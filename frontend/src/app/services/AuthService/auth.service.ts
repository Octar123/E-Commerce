import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { Observable } from 'rxjs';

export interface ResponseData {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3001/api/auth';
  constructor(
    private http: HttpClient,
    private isLoggedIn: IsLoggedInService,
  ) {}

  login(credentials: {
    email: string,
    password: string
  }): Observable<ResponseData> {
    return this.http
      .post<ResponseData>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: {name: string, email:string, password: string}): Observable<any> {
    return this.http.post<ResponseData>(`${this.apiUrl}/register`, credentials);
  }

  logout(): Observable<ResponseData> {
    return this.http.get<ResponseData>(`${this.apiUrl}/logout`);
  }
}
