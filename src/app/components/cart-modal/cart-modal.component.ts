// src/app/components/cart-modal/cart-modal.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem, CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // <-- Importa Router!

declare var bootstrap: any; // Declara bootstrap para que TypeScript lo reconozca

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.css']
})
export class CartModalComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  private cartSubscription!: Subscription;
  private totalAmountSubscription!: Subscription;

  constructor(
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe(items => {
      console.log('Cart items:', items);
      this.cartItems = items;
    });

    this.totalAmountSubscription = this.cartService.totalAmount$.subscribe(amount => {
      this.totalAmount = amount;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.totalAmountSubscription) {
      this.totalAmountSubscription.unsubscribe();
    }
  }

  increaseQuantity(productId: number): void {
    this.cartService.updateCartItemQuantity(productId, 1);
  }

  decreaseQuantity(productId: number): void {
    this.cartService.updateCartItemQuantity(productId, -1);
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.hideModal(); // Llama a la función para ocultar el modal
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      this.cartService.clearCart();
      this.hideModal(); // Llama a la función para ocultar el modal
      this.router.navigate(['/simulated-payment']);
    } else {
      alert('Tu carrito está vacío. Añade productos antes de finalizar la compra.');
    }
  }

  // Nuevo método para ocultar el modal usando Bootstrap JS
  private hideModal(): void {
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
      const bsModal = bootstrap.Modal.getInstance(cartModalElement) || new bootstrap.Modal(cartModalElement);
      bsModal.hide();
    }
  }
}