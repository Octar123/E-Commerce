import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { NotifyService } from '../../services/NotifyService/notify.service';
import { inject } from '@angular/core';

export const notifyInterceptor: HttpInterceptorFn = (req, next) => {
  const notifyService = inject(NotifyService);

  return next(req).pipe(
    tap({
      next: (event) => {

        if (event instanceof HttpResponse) {
          const success = (event as any).body?.success;
          const message = (event as any).body?.message;

          if (success === true) {
            notifyService.show(message, success);
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {

      const success = error.error?.success;
      const message = error.error?.error;

      if (success === false) {
        notifyService.show(message, success);
      }
      
      return throwError(() => error);
    })
  );
};