import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { User } from '../../models/user.model';
import { Subject, Subscription } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; 
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';


declare var bootstrap: any;

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


  private searchInputSubject = new Subject<string>();
  private searchSubscription!: Subscription;


  @ViewChild('searchInputDesktop') searchInputDesktop!: ElementRef;
  @ViewChild('searchInputMobileHeader') searchInputMobileHeader!: ElementRef;


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

    this.searchSubscription = this.searchInputSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged() 
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm); 
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe(); 
    }
    this.searchInputSubject.complete(); 
  }


  onSearchInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchInputSubject.next(inputElement.value);
  }


  performSearch(query: string): void {
    if (query && query.trim() !== '') {
      this.router.navigate(['/'], { queryParams: { q: query.trim() } });
    } else {
      this.router.navigate(['/']);
    }

    setTimeout(() => {
        const offcanvasElement = document.getElementById('offcanvasNavbar');
        if (offcanvasElement) {
          const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
          if (offcanvas) {
            offcanvas.hide();
          }
        }
    }, 100); 
  }

  onSearchSubmit(query: string): void {
    this.performSearch(query);
    if (this.searchInputDesktop) this.searchInputDesktop.nativeElement.value = query;
    if (this.searchInputMobileHeader) this.searchInputMobileHeader.nativeElement.value = query;
  }


  openCartModal(): void {
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
      const modal = new bootstrap.Modal(cartModalElement);
      modal.show();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}