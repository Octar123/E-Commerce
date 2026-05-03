import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {

  isLoggedIn = new BehaviorSubject<UserData | null>(null);
  isInitialized = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this.isLoggedIn.asObservable();
  isInitialized$ = this.isInitialized.asObservable();
  constructor() { }

}
