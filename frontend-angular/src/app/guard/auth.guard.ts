import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CommonserviceService } from '../services/commonservice.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(CommonserviceService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
