import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {map} from 'rxjs';

import {UserService} from '../services/user.service';

export const authGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.loadSession().pipe(
    map(valid => valid ? true : router.createUrlTree(['/login']))
  );
};
