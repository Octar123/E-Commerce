import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, SessionResponse } from '../../models/api-response.model';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly meUrl = `${environment.apiBaseUrl}/me`;

  constructor(private http: HttpClient) {}

  checkSession(): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(this.meUrl);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: {
    name: string;
    email: string;
    password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, credentials);
  }

  logout(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/logout`);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/getProfile`);
  }

  updateProfile(data: { name?: string; email?: string }): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/update`, data);
  }

  changePassword(password: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(`${this.apiUrl}/change`, { password });
  }

  forgotPassword(email: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/forgot`, { email });
  }

  resetPassword(data: {
    email: string;
    code: string;
    password: string;
  }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset`, data);
  }
}
