import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Product, ProductService } from './product.service';

export interface CartItem {
  product: Product; 
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>([]);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();
  public totalAmount$: Observable<number>;

  constructor(
    private productService: ProductService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCartFromLocalStorage();
    }

    this.totalAmount$ = this.cart$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0))
    );
  }

  private loadCartFromLocalStorage(): void {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const cartItems: CartItem[] = JSON.parse(storedCart);
      const productObservables = cartItems.map(item =>
        this.productService.getProductById(item.product.id).pipe(
          map(product => product ? { product, quantity: item.quantity } : undefined)
        )
      );

      if (productObservables.length > 0) {
        combineLatest(productObservables).pipe(
          map(items => items.filter(item => item !== undefined) as CartItem[]),
          take(1) 
        ).subscribe(fullCartItems => {
          this.cartSubject.next(fullCartItems);
        });
      } else {
        this.cartSubject.next([]); 
      }
    }
  }

  private saveCartToLocalStorage(cart: CartItem[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      const updatedCart = currentCart.map(item =>
        item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
      this.cartSubject.next(updatedCart);
    } else {
      const newItem: CartItem = { product: product, quantity: quantity };
      this.cartSubject.next([...currentCart, newItem]);
    }
    this.saveCartToLocalStorage(this.cartSubject.value);
  }

  updateCartItemQuantity(productId: number, change: number): void {
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.product.id === productId);

    if (existingItemIndex > -1) {
      const updatedCart = [...currentCart];
      updatedCart[existingItemIndex].quantity += change;

      if (updatedCart[existingItemIndex].quantity <= 0) {
        updatedCart.splice(existingItemIndex, 1);
      }
      this.cartSubject.next(updatedCart);
      this.saveCartToLocalStorage(this.cartSubject.value);
    }
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.product.id !== productId);
    this.cartSubject.next(updatedCart);
    this.saveCartToLocalStorage(this.cartSubject.value);
  }

  clearCart(): void {
    this.cartSubject.next([]); 
    this.saveCartToLocalStorage([]); 
    console.log("Carrito vaciado.");
  }
}