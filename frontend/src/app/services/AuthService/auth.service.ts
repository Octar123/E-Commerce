import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, SessionResponse } from '../../models/api-response.model';
import { UserData, UserProfile } from '../../models/user.model';
import { IsLoggedInService } from '../../shared/is-logged-in.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/auth`;
  private readonly meUrl = `${environment.apiBaseUrl}/me`;

  private readonly http = inject(HttpClient);
  private readonly isLoggedIn = inject(IsLoggedInService);

  /** Check session (raw) - kept for compatibility */
  checkSession(): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(this.meUrl);
  }

  /** Load current user and update IsLoggedInService centrally */
  loadCurrentUser(): Observable<UserData | null> {
    return this.http.get<SessionResponse>(this.meUrl).pipe(
      map((res) => (res.currentUser as UserData) ?? null),
      tap((user) => this.setCurrentUser(user)),
      catchError(() => {
        this.clearCurrentUser();
        return of(null);
      }),
    );
  }

  /** Set the shared current user state */
  setCurrentUser(user: UserData | null): void {
    this.isLoggedIn.setUser(user);
    this.isLoggedIn.setInitialized(true);
  }

  /** Clear the shared current user state */
  clearCurrentUser(): void {
    this.isLoggedIn.setUser(null);
    this.isLoggedIn.setInitialized(true);
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        const user = (res.currentUser as UserData) || null;
        this.setCurrentUser(user);
      }),
    );
  }

  register(credentials: { name: string; email: string; password: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, credentials);
  }

  logout(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/logout`).pipe(
      tap(() => this.clearCurrentUser()),
    );
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

  resetPassword(data: { email: string; code: string; password: string }): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/reset`, data);
  }
}
