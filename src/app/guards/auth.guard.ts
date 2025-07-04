import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), 
    map(user => {
      if (user) {
        return true;
      } else {
        console.log('Acceso denegado: Usuario no autenticado. Redirigiendo a /login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};