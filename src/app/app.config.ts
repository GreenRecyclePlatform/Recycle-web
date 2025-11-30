import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './core/interceptors/auth';

/* Interceptor لإضافة الـ Token في كل الطلبات (اختياري)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // لو عندك توكن في localStorage
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    // إضافة الـ Token في الـ headers
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }
  
  return next(req);
};
*/

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    
    // ✅ ده المهم: إضافة HttpClient
   // provideHttpClient(withInterceptors([authInterceptor]))
       // provideHttpClient(withInterceptors([authInterceptor])),

    // ⚠️ لو مش محتاجة Interceptor (مش محتاجة توكن)، استخدمي ده بدل اللي فوق:
   // provideHttpClient()
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
  ],
  
   
};

