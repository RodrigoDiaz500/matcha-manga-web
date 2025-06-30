import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-mangas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mangas.component.html',
  styleUrls: ['./mangas.component.css']
})
export class MangasComponent implements OnInit, OnDestroy {
  mangas: Product[] = [];
  private productsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService 
  ) { }

  ngOnInit(): void {
    this.productsSubscription = this.productService.getProductsByType('manga').subscribe(mangas => {
      this.mangas = mangas;
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  addToCart(productId: number): void {
    this.productService.getProductById(productId).subscribe(product => {
      if (product) {
        this.cartService.addToCart(product); 
        console.log(`Producto ${product.title} (ID: ${product.id}) añadido al carrito.`);
      } else {
        console.warn(`No se encontró el producto con ID: ${productId}`);
      }
    });
  }
}