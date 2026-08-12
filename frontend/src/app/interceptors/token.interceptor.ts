import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('jwt_token');

  if (token) {
    return next(request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    }));
  }

  return next(request);
};
