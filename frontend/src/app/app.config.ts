import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/authInterceptor/auth.interceptor';
import { responseInterceptor } from './interceptors/responseInterceptor/response.interceptor';
import { notifyInterceptor } from './interceptors/notifyInterceptor/notify.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(
    withInterceptors([authInterceptor, responseInterceptor, notifyInterceptor])
  )]
};
