import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';

import {NotificationService} from '../services/notification.service';
import {UserService} from '../services/user.service';

const SILENT_PATHS = ['/auth/login', '/auth/me', '/auth/logout'];

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notifications = inject(NotificationService);
  const userService = inject(UserService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      const silent = SILENT_PATHS.some(path => request.url.includes(path));

      if (error.status === 401) {
        if (!silent) {
          userService.clearSession();
          notifications.error('Your session has expired. Please sign in again.');
          void router.navigate(['/login']);
        }
      } else if (!silent) {
        notifications.error(describe(error));
      }

      return throwError(() => error);
    })
  );
};

function describe(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'Cannot reach the server. Is the backend running?';
  }
  if (error.status === 403) {
    return 'You do not have permission to do that.';
  }
  if (typeof error.error === 'string' && error.error.trim().length > 0) {
    return error.error;
  }
  return `Request failed (${error.status}).`;
}
