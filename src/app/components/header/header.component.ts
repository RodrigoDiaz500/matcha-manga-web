// src/app/components/header/header.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

declare var bootstrap: any; // ¡IMPORTANTE: Declara bootstrap para que TypeScript lo reconozca!

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isAdminUser: boolean = false;
  currentUser: User | undefined;
  cartItemCount: number = 0;
  private authSubscription!: Subscription;
  private cartSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user; // true si hay user, false si es undefined/null
      this.isAdminUser = this.authService.isAdmin();
    });

    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onSearchSubmit(query: string): void {
    if (query && query.trim() !== '') {
      this.router.navigate(['/'], { queryParams: { q: query.trim() } });
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  // Método para abrir el modal del carrito usando el objeto global de Bootstrap
  openCartModal(): void {
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
      // Ahora usamos 'bootstrap.Modal' directamente
      const bsModal = new bootstrap.Modal(cartModalElement);
      bsModal.show();
    } else {
      console.warn("Modal del carrito con ID 'cartModal' no encontrado. Asegúrate de tener el componente del modal en tu app.component.html o donde sea accesible.");
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirige al login después de cerrar sesión
  }
}