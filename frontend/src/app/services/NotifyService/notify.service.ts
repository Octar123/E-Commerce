import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ResponseData } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  toastState = new Subject<ResponseData | null>();

  show(message: string, success: boolean) {
    this.toastState.next({ message,  success});
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      this.toastState.next(null);
    }, 3000);
  }
}
