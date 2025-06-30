// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { CartModalComponent } from './components/cart-modal/cart-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    CartModalComponent
  ],
  template: `
    <app-header *ngIf="!hideNavbar"></app-header>
    <router-outlet></router-outlet>
    <app-footer *ngIf="!hideNavbar"></app-footer>
    <app-cart-modal></app-cart-modal>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'matcha-manga-web';
  hideNavbar: boolean = false; // Esta variable controla la visibilidad de ambos

  // Define las rutas donde el navbar y el footer deben estar ocultos
  // ¡ACTUALIZA ESTA LISTA!
  private hideNavbarRoutes: string[] = ['/login', '/register', '/forgot-password', '/reset-password'];

  constructor(private router: Router) {}

  ngOnInit() {
    // Suscribirse a los eventos del router para controlar la visibilidad del navbar y el footer
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Verifica si la URL actual es una de las rutas donde se debe ocultar el navbar/footer
      this.hideNavbar = this.hideNavbarRoutes.includes(event.urlAfterRedirects);
    });
  }
}