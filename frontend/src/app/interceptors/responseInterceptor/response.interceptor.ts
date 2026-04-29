import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { Router } from '@angular/router';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {

  const isLoggedInService = inject(IsLoggedInService);
  const router = inject(Router);

  return next(req).pipe(
    tap((event:any) => {
      if(event instanceof HttpResponse) {
        const user = event.body?.currentUser;

        if(user === null && isLoggedInService.isLoggedIn.value !== null) {
          isLoggedInService.isLoggedIn.next(null);
          router.navigate(['/']);
        }
      }
    })
  );
};
