import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs'; 
import { CartService } from '../../services/cart.service'; 

@Component({
  selector: 'app-comics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comics.component.html',
  styleUrls: ['./comics.component.css']
})
export class ComicsComponent implements OnInit, OnDestroy {
  comics: Product[] = [];
  private productsSubscription!: Subscription; 

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    this.productsSubscription = this.productService.products$.subscribe((allProducts: Product[]) => {
      this.comics = allProducts.filter(p => p.type === 'comic');
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
        console.log(`Producto ${product.title} añadido al carrito.`);
      } else {
        console.warn(`No se encontró el producto con ID: ${productId}`);
      }
    });
  }
}