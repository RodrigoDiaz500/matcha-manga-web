import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators'; 
import { User } from '../models/user.model'; 

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.currentUser$.pipe(
    map((user: User | undefined) => { 
      if (user && user.role === 'admin') {
        return true;
      } else {
        router.navigate(['/']); 
        return false; 
      }
    })
  );
};