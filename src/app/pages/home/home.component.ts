import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from '../../services/product.service';
import { Subscription, combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  mangas: Product[] = [];
  comics: Product[] = [];
  latestProducts: Product[] = [];
  featuredProducts: Product[] = [];

  private originalAllProducts: Product[] = []; 
  private combinedSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    
    this.combinedSubscription = combineLatest([
      this.productService.products$.pipe(startWith([])), 
      this.route.queryParams.pipe(startWith({} as Params)) 
    ]).subscribe(([products, params]) => {
      this.originalAllProducts = products; 

      const searchTerm = (params['q'] as string) || ''; 

      let filteredProducts: Product[] = [];
      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        filteredProducts = this.originalAllProducts.filter(product =>
          product.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.author.toLowerCase().includes(lowerCaseSearchTerm) 
        );
      } else {
        
        filteredProducts = [...this.originalAllProducts];
      }

      
      this.mangas = filteredProducts.filter(p => p.type === 'manga');
      this.comics = filteredProducts.filter(p => p.type === 'comic');

      
      this.latestProducts = filteredProducts.sort((a, b) => b.id! - a.id!).slice(0, 5);
      this.featuredProducts = filteredProducts.filter(p => p.id! % 2 === 0).slice(0, 5);
    });
  }

  ngOnDestroy(): void {
    if (this.combinedSubscription) {
      this.combinedSubscription.unsubscribe(); 
    }
  }

  searchProducts(searchTerm: string): void {
      console.log('searchProducts fue llamado, pero el filtrado ahora es manejado reactivamente vía queryParams.');
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