import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { NotifyService } from '../../services/NotifyService/notify.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const isLoggedIn = inject(IsLoggedInService);
  const router = inject(Router);
  const notify = inject(NotifyService);

  if (
    isLoggedIn.isLoggedIn.value === null ||
    isLoggedIn.isLoggedIn.value.role !== 'admin'
  ) {
    notify.show('You are not Authorized!', false);
    return router.createUrlTree(['/login']);
  } else {
    return true;
  }
};
