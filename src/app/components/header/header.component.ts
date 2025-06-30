import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

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
      this.isLoggedIn = !!user;
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
    this.router.navigate(['/']); 
  }
}

  openCartModal(): void {
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
      const bsModal = new (window as any).bootstrap.Modal(cartModalElement);
      bsModal.show();
    } else {
      console.warn("Modal del carrito con ID 'cartModal' no encontrado.");
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}