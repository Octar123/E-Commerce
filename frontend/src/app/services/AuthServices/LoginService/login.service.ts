import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IsLoggedInService } from '../../../shared/is-logged-in.service';

export interface ResponseData {
  success: boolean;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:3001/api/auth';
  constructor(
    private http: HttpClient,
    private isLoggedIn: IsLoggedInService,
  ) {}

  login(credentials: {
    name: string;
    email: string;
    password: string;
  }): Observable<ResponseData> {
    return this.http
      .post<ResponseData>(`${this.apiUrl}/login`, credentials)
      .pipe();
  }
}
