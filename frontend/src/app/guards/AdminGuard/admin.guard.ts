import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { NotifyService } from '../../services/NotifyService/notify.service';
import { filter, map, switchMap, take } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const isLoggedIn = inject(IsLoggedInService);
  const router = inject(Router);
  const notify = inject(NotifyService);

  return isLoggedIn.isInitialized$.pipe(
    filter((val) => val === true),
    switchMap(() => isLoggedIn.isLoggedIn$),
    take(1),
    map((user) => {
      if (user === null || user.role !== 'admin') {
        notify.show('You are not Authorized!', false);
        return router.createUrlTree(['/login']);
      }
      return true;
    }),
  );
};
