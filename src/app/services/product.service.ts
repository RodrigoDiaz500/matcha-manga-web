import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; 


export interface Product {
  id: number;
  title: string;
  author: string;
  price: number;
  image: string;
  type: 'manga' | 'comic';
  stock?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  // URL a  JSON local
  private productsJsonUrl = 'assets/products.json';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient 
  ) {
    this.loadProductsFromJson();
  }

  private loadProductsFromJson(): void {
    this.http.get<Product[]>(this.productsJsonUrl)
      .pipe(
        tap(data => {         
          this.products = data; 
          this.productsSubject.next(this.products); 
        }),
        catchError(error => {
          console.error('Error al cargar productos desde JSON:', error);
          this.products = [];
          this.productsSubject.next(this.products);
          return throwError(() => new Error('No se pudieron cargar los productos desde el JSON. Por favor, verifica la ruta y el archivo.'));
        })
      )
      .subscribe(); 
  }

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductsByType(type: 'manga' | 'comic'): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.type === type);
    return of(filteredProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  addProduct(product: Product): Observable<Product> {
    const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    this.products.push(newProduct);
    this.productsSubject.next(this.products); 
    return of(newProduct);
  }

  updateProduct(updatedProduct: Product): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.products[index] = updatedProduct;
      this.productsSubject.next(this.products); 
      return of(true);
    }
    return of(false);
  }

  deleteProduct(id: number): Observable<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length < initialLength) {
      this.productsSubject.next(this.products); 
      return of(true);
    }
    return of(false);
  }

}