// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1), // Toma el valor actual y completa el observable
    map(user => {
      if (user) {
        // Si hay un usuario logueado, permite el acceso a la ruta
        return true;
      } else {
        // Si no hay usuario, redirige a la página de login
        console.log('Acceso denegado: Usuario no autenticado. Redirigiendo a /login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};