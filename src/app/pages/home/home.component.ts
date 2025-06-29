// src/app/pages/home/home.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  allProducts: Product[] = []; // Esta es la lista que se mostrará y se filtrará
  mangas: Product[] = [];
  comics: Product[] = [];
  latestProducts: Product[] = [];
  featuredProducts: Product[] = [];
  private productsSubscription!: Subscription;
  private querySubscription!: Subscription;

  // Una copia de todos los productos sin filtrar, para la función de búsqueda
  private originalAllProducts: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productsSubscription = this.productService.products$.subscribe((products: Product[]) => {
      this.originalAllProducts = products; // Guardar la lista original sin filtrar
      this.allProducts = [...products]; // Mostrar todos los productos inicialmente
      this.mangas = products.filter(p => p.type === 'manga');
      this.comics = products.filter(p => p.type === 'comic');

      this.latestProducts = products.slice(-4);
      this.featuredProducts = products.filter(p => [1, 6].includes(p.id));
    });

    this.querySubscription = this.route.queryParams.subscribe(params => {
      const searchTerm = params['search'];
      if (searchTerm) {
        this.searchProducts(searchTerm);
      } else {
        // Si no hay término de búsqueda, asegurar que se muestren todos los productos originales
        this.allProducts = [...this.originalAllProducts];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  searchProducts(searchTerm: string): void {
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      // Filtrar a partir de la lista original de todos los productos
      this.allProducts = this.originalAllProducts.filter(product =>
        product.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        product.author.toLowerCase().includes(lowerCaseSearchTerm)
      );
    } else {
      // Si la búsqueda está vacía, mostrar la lista original de todos los productos
      this.allProducts = [...this.originalAllProducts];
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