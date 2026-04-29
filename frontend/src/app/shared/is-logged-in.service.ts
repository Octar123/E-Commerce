import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserData } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {

  isLoggedIn = new BehaviorSubject<UserData | null>(null);

  isLoggedIn$ = this.isLoggedIn.asObservable();
  constructor() { }

}
