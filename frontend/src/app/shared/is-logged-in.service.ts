import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserData } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInService {
  private readonly _currentUser = signal<UserData | null>(null);
  private readonly _isInitialized = signal(false);

  readonly currentUser = this._currentUser.asReadonly();
  readonly initialized = this._isInitialized.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  /** Observable streams for guards and async-pipe templates */
  readonly isLoggedIn$ = toObservable(this._currentUser);
  readonly isInitialized$ = toObservable(this._isInitialized);

  /** Compatibility accessors used by interceptors and older call sites */
  get isLoggedIn() {
    return {
      value: this._currentUser(),
      next: (user: UserData | null) => this.setUser(user),
    };
  }

  get isInitialized() {
    return {
      value: this._isInitialized(),
      next: (value: boolean) => this.setInitialized(value),
    };
  }

  setUser(user: UserData | null): void {
    this._currentUser.set(user);
  }

  setInitialized(value: boolean): void {
    this._isInitialized.set(value);
  }
}
