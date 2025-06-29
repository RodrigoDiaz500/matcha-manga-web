// src/app/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service'; // Asegúrate de la ruta correcta

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // El usuario está logueado, permitir acceso
  } else {
    // Si no está logueado, redirigir a la página de login
    console.log('Acceso denegado: Usuario no autenticado. Redirigiendo al login.');
    return router.createUrlTree(['/login']);
  }
};