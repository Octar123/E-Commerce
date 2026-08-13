import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { Router } from '@angular/router';
import { UserData } from '../../models/user.model';

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  const isLoggedInService = inject(IsLoggedInService);
  const router = inject(Router);

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        const body = event.body as { currentUser?: UserData | null } | null;
        if (!body || !('currentUser' in body)) {
          return;
        }

        const user = body.currentUser ?? null;

        if (user === null && isLoggedInService.currentUser() !== null) {
          isLoggedInService.setUser(null);
          isLoggedInService.setInitialized(true);
          router.navigate(['/']);
        } else if (user) {
          isLoggedInService.setUser(user);
          isLoggedInService.setInitialized(true);
        } else {
          isLoggedInService.setInitialized(true);
        }
      }
    }),
  );
};
