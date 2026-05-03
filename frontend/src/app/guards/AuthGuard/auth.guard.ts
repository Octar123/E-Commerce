import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { IsLoggedInService } from '../../shared/is-logged-in.service';
import { filter, map, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const isLoggedIn = inject(IsLoggedInService);
  const router = inject(Router);

  return isLoggedIn.isInitialized$.pipe(
    filter(val => val === true),
    switchMap(() => isLoggedIn.isLoggedIn$),
    take(1),
    map(user => {
      if(user === null){
        return router.createUrlTree(['/login']);
      }else{
        return true;
      }
    })
  )

  // if(isLoggedIn.isLoggedIn.value === null){
  //   return router.createUrlTree(['/login']);
  // }else{
  //   return true;
  // }
};
