import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  toastState = new Subject<Pick<ApiResponse, 'success' | 'message'> | null>();

  show(message: string, success: boolean) {
    this.toastState.next({ message, success });

    setTimeout(() => {
      this.toastState.next(null);
    }, 3000);
  }
}
