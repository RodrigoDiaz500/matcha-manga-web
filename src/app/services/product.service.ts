// src/app/services/product.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // Importar Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Importar isPlatformBrowser
import { BehaviorSubject, Observable, of } from 'rxjs';

// Interfaz para un producto
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object // Inyectar PLATFORM_ID
  ) {
    if (isPlatformBrowser(this.platformId)) { // Solo cargar si estamos en el navegador
      this.loadProductsFromLocalStorage();
    } else {
      // Si no estamos en el navegador, inicializar con array vacío o datos predeterminados
      // que no dependan de localStorage.
      // Aquí, podríamos simplemente cargar los datos de ejemplo directamente si no hay localStorage.
      this.initializeDefaultProducts();
    }
  }

  private initializeDefaultProducts(): void {
    this.products = [
      { id: 1, title: 'Fullmetal Alchemist - Tomo 1', author: 'Hiromu Arakawa', price: 9.990, image: '/assets/manga1.jpg', type: 'manga' },
        { id: 2, title: 'Shingeki no Kyojin - Tomo 1', author: 'Hajime Isayama', price: 11.990, image: 'assets/manga2.jpg', type: 'manga' },
        { id: 3, title: 'JoJos Bizarre Adventure: Stardust Crusaders - Tomo 2', author: 'Hirohiko Araki', price: 16.990, type: 'manga', image: 'assets/manga3.jpg' },
        { id: 4, title: 'Dragon Ball - Tomo 1', author: 'Akira Toriyama', price: 9.990, image: 'assets/manga4.jpg', type: 'manga' },
        { id: 5, title: 'One Piece - Tomo 2', author: 'Eiichirō Oda', price: 9.990, image: 'assets/manga5.jpg', type: 'manga' },
        { id: 6, title: 'Akatsuki no Yona - Tomo 12', author: 'Mizuho Kusanagi', price: 11.990, image: 'assets/manga6.jpg', type: 'manga' },
        { id: 7, title: 'Pokémon Rojo - Tomo 1', author: 'Hidenori Kusaka', price: 18.990, image: 'assets/manga7.jpg', type: 'manga' },
        { id: 8, title: 'Cardcaptor Sakura - Tomo 1', author: 'CLAMP', price: 15.990, image: 'assets/manga8.jpg', type: 'manga' },
        { id: 9, title: 'Fairy Tail - Tomo 34', author: 'Hiro Mashima', price: 9.990, image: 'assets/manga9.jpg', type: 'manga' },
        { id: 10, title: 'Dungeon Meshi - Tomo 2', author: 'Ryōko Kui', price: 15.990, image: 'assets/manga10.jpg', type: 'manga' },
        { id: 11, title: 'Inuyasha - Tomo 18', author: 'Rumiko Takahashi', price: 15.990, image: 'assets/manga11.jpg', type: 'manga' },
        { id: 12, title: 'Sword art online Phantom Bullet - Tomo 1', author: 'Reki Kawahara', price: 9.990, image: 'assets/manga12.jpg', type: 'manga' },
        { id: 13, title: 'Batman N#50 ', author: 'Scott Snyder,Marcio Takara,', price: 9.990, image: 'assets/comic1.jpg', type: 'comic' },
        { id: 14, title: 'Watchmen', author: 'Alan Moore ', price: 24.990, image: 'assets/comic2.jpg', type: 'comic' },
        { id: 15, title: 'The Amazing Spider-Man N#70', author: 'Joe Kelly', price: 55.000, image: 'assets/comic3.jpg', type: 'comic' },
        { id: 16, title: 'batman who laughs', author: 'Scott Snyder', price: 27.990, image: 'assets/comic4.jpg', type: 'comic' },
        { id: 17, title: 'Los Vengadores N#1', author: 'Stan Lee', price: 49.990, image: 'assets/comic5.jpg', type: 'comic' },
        { id: 18, title: 'Spawn N#300', author: 'Scott Snyder', price: 23.990, image: 'assets/comic6.jpg', type: 'comic' },
        { id: 19, title: 'Star Wars N#13', author: 'Greg Pak', price: 9.990, image: 'assets/comic7.jpg', type: 'comic' },
        { id: 20, title: 'Venom: Lethal Protector N#11', author: 'David Michelinie', price: 20.990, image: 'assets/comic8.jpg', type: 'comic' },
        { id: 21, title: 'X-Men (2024) N#1', author: 'Jed Mackay', price: 9.990, image: 'assets/comic9.jpg', type: 'comic' },
        { id: 22, title: 'Iron Man N#26/145', author: 'Christopher Cantwell, Murewa Ayodele', price: 7.990, image: 'assets/comic10.jpg', type: 'comic' },
        { id: 23, title: 'Invencible Vol.27', author: 'Robert Kirkman', price: 25.650, image: 'assets/comic11.jpg', type: 'comic' },
        { id: 24, title: 'Warhammer 40k Ahriman Vol. 1: Exilio', author: 'John French', price: 20.900, image: 'assets/comic12.jpg', type: 'comic' },
    ];
    this.productsSubject.next(this.products);
  }

  private loadProductsFromLocalStorage(): void {
    const storedComics = localStorage.getItem('comicsData');
    if (storedComics) {
      this.products = JSON.parse(storedComics);
    } else {
      this.initializeDefaultProducts(); // Cargar los datos por defecto si no hay en localStorage
    }
    this.productsSubject.next(this.products); // Emitir los productos cargados
  }

  private saveProductsToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('comicsData', JSON.stringify(this.products));
    }
  }

  getProducts(): Observable<Product[]> {
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
    this.saveProductsToLocalStorage(); // Guardar cambios
    this.productsSubject.next(this.products); // Emitir el cambio
    return of(newProduct);
  }

  updateProduct(updatedProduct: Product): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.products[index] = updatedProduct;
      this.saveProductsToLocalStorage(); // Guardar cambios
      this.productsSubject.next(this.products); // Emitir el cambio
      return of(true);
    }
    return of(false);
  }

  deleteProduct(id: number): Observable<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    this.saveProductsToLocalStorage(); // Guardar cambios
    if (this.products.length < initialLength) {
      this.productsSubject.next(this.products); // Emitir el cambio
      return of(true);
    }
    return of(false);
  }
}