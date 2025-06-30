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
  hideNavbar: boolean = false;
  private hideNavbarRoutes: string[] = ['/login', '/register', '/forgot-password', '/reset-password'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentPath = event.urlAfterRedirects.split('?')[0];
      this.hideNavbar = this.hideNavbarRoutes.includes(currentPath);
    });
  }
}