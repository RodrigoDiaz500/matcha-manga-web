import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient

// Define la interfaz de tus productos
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

  // URL a tu archivo JSON local
  private productsJsonUrl = 'assets/products.json';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient // Inyecta HttpClient en el constructor
  ) {
    // Al iniciar el servicio, carga los productos desde el archivo JSON.
    this.loadProductsFromJson();
  }

  /**
   * Carga los productos desde el archivo JSON estático.
   * Reemplaza la lógica de carga desde localStorage y la inicialización por defecto.
   */
  private loadProductsFromJson(): void {
    this.http.get<Product[]>(this.productsJsonUrl)
      .pipe(
        tap(data => {
          // console.log('Productos cargados desde JSON:', data); // Puedes descomentar para depurar
          this.products = data; // Asigna los datos cargados al arreglo de productos del servicio
          this.productsSubject.next(this.products); // Emite los productos a los suscriptores
        }),
        catchError(error => {
          console.error('Error al cargar productos desde JSON:', error);
          // Si hay un error al cargar el JSON (ej. archivo no encontrado, ruta incorrecta),
          // inicializa con un arreglo vacío o con datos de respaldo para evitar que la app falle.
          this.products = [];
          this.productsSubject.next(this.products);
          // Relanza el error para que los componentes puedan manejarlo si es necesario.
          return throwError(() => new Error('No se pudieron cargar los productos desde el JSON. Por favor, verifica la ruta y el archivo.'));
        })
      )
      .subscribe(); // Es crucial suscribirse para que la petición HTTP se ejecute
  }

  // --- Métodos CRUD (ahora operan en la copia de los datos en memoria) ---

  /**
   * Retorna un Observable con todos los productos cargados.
   * @returns Observable<Product[]>
   */
  getAllProducts(): Observable<Product[]> {
    // Como los productos ya están cargados en `this.products`, simplemente los retornamos.
    return of(this.products);
  }

  /**
   * Retorna un Observable con productos filtrados por tipo (manga o comic).
   * @param type - El tipo de producto a filtrar.
   * @returns Observable<Product[]>
   */
  getProductsByType(type: 'manga' | 'comic'): Observable<Product[]> {
    const filteredProducts = this.products.filter(p => p.type === type);
    return of(filteredProducts);
  }

  /**
   * Retorna un Observable con un producto específico por su ID.
   * @param id - El ID del producto a buscar.
   * @returns Observable<Product | undefined>
   */
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product);
  }

  /**
   * Añade un nuevo producto.
   * IMPORTANTE: Los cambios NO se persistirán en el archivo JSON estático.
   * Solo afectarán la lista de productos en memoria del navegador.
   * Para persistencia real, se necesita una API backend.
   * @param product - El producto a añadir.
   * @returns Observable<Product> - El producto añadido con un ID generado.
   */
  addProduct(product: Product): Observable<Product> {
    // Genera un nuevo ID simple (esto sería manejado por el backend en una API real)
    const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct = { ...product, id: newId };
    this.products.push(newProduct);
    this.productsSubject.next(this.products); // Emite la lista actualizada
    return of(newProduct);
  }

  /**
   * Actualiza un producto existente.
   * IMPORTANTE: Los cambios NO se persistirán en el archivo JSON estático.
   * Solo afectarán la lista de productos en memoria del navegador.
   * @param updatedProduct - El producto con los datos actualizados.
   * @returns Observable<boolean> - True si la actualización fue exitosa, false en caso contrario.
   */
  updateProduct(updatedProduct: Product): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.products[index] = updatedProduct;
      this.productsSubject.next(this.products); // Emite la lista actualizada
      return of(true);
    }
    return of(false);
  }

  /**
   * Elimina un producto por su ID.
   * IMPORTANTE: Los cambios NO se persistirán en el archivo JSON estático.
   * Solo afectarán la lista de productos en memoria del navegador.
   * @param id - El ID del producto a eliminar.
   * @returns Observable<boolean> - True si la eliminación fue exitosa, false en caso contrario.
   */
  deleteProduct(id: number): Observable<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length < initialLength) {
      this.productsSubject.next(this.products); // Emite la lista actualizada
      return of(true);
    }
    return of(false);
  }

  // Los siguientes métodos ya no son necesarios o se reemplazan por loadProductsFromJson()
  // y la manipulación en memoria. Puedes eliminarlos o dejarlos comentados para referencia.

  // private loadProductsFromLocalStorage(): void { ... }
  // private saveProductsToLocalStorage(): void { ... }
  // private initializeDefaultProducts(): void { ... }
}