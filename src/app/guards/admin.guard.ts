import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators'; // Importa map
import { User } from '../models/user.model'; // <-- Importa User directamente desde su modelo

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usa currentUser$ y map para verificar el rol del usuario
  return authService.currentUser$.pipe(
    map((user: User | undefined) => { // Asegura el tipo de 'user'
      if (user && user.role === 'admin') {
        return true; // Permitir acceso si es admin
      } else {
        router.navigate(['/']); // Redirigir a home o a una página de acceso denegado
        return false; // Denegar acceso
      }
    })
  );
};