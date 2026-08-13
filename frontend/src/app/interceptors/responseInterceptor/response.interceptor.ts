import { HttpInterceptorFn } from '@angular/common/http';

// Simple pass-through response interceptor. Authentication state is managed
// centrally by AuthService and IsLoggedInService during app initialization
// and auth flows; do not set user on every API response here.
export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
