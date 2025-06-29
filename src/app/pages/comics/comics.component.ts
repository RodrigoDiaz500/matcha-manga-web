// src/app/pages/mangas/mangas.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs'; // Importar Subscription
import { CartService } from '../../services/cart.service'; // Importar CartService

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.css']
})
export class ComicsComponent implements OnInit, OnDestroy {
  comics: Product[] = [];
  private productsSubscription!: Subscription; // Para desuscribirse

  constructor(private productService: ProductService, private cartService: CartService) { } // Inyectar CartService

  ngOnInit(): void {
    // Suscribirse a products$ para obtener la lista de productos y reaccionar a cambios
    this.productsSubscription = this.productService.products$.subscribe((allProducts: Product[]) => {
      this.comics = allProducts.filter(p => p.type === 'comic');
    });
  }

  ngOnDestroy(): void {
    // Desuscribirse para evitar fugas de memoria
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  addToCart(productId: number): void {
    // Necesitamos obtener el objeto Product completo para añadirlo al carrito.
    this.productService.getProductById(productId).subscribe(product => {
      if (product) {
        this.cartService.addToCart(product);
        console.log(`Producto ${product.title} añadido al carrito.`);
        // Opcional: mostrar un mensaje de éxito al usuario
        // alert(`${product.title} añadido al carrito!`);
      } else {
        console.warn(`No se encontró el producto con ID: ${productId}`);
      }
    });
  }
}