import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usa isLoggedIn$ para verificar si el usuario está logueado
  return authService.isLoggedIn$.pipe(
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return true; // Permitir acceso si está logueado
      } else {
        router.navigate(['/login']); // Redirigir a la página de login si no está logueado
        return false; // Denegar acceso
      }
    })
  );
};