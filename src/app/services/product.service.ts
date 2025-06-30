import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; 
import { isPlatformBrowser } from '@angular/common'; 
import { BehaviorSubject, Observable, of } from 'rxjs';


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
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {
    if (isPlatformBrowser(this.platformId)) { 
      this.loadProductsFromLocalStorage();
    } else {
      this.initializeDefaultProducts();
    }
  }

  private initializeDefaultProducts(): void {
  this.products = [
    { id: 1, title: 'Fullmetal Alchemist - Tomo 1', author: 'Hiromu Arakawa', price: 9.990, image: 'manga1.jpg', type: 'manga' }, 
    { id: 2, title: 'Shingeki no Kyojin - Tomo 1', author: 'Hajime Isayama', price: 11.990, image: 'manga2.jpg', type: 'manga' }, 
    { id: 3, title: 'JoJos Bizarre Adventure: Stardust Crusaders - Tomo 2', author: 'Hirohiko Araki', price: 16.990, type: 'manga', image: 'manga3.jpg' }, 
    { id: 4, title: 'Dragon Ball - Tomo 1', author: 'Akira Toriyama', price: 9.990, image: 'manga4.jpg', type: 'manga' }, 
    { id: 5, title: 'One Piece - Tomo 2', author: 'Eiichirō Oda', price: 9.990, image: 'manga5.jpg', type: 'manga' }, 
    { id: 6, title: 'Akatsuki no Yona - Tomo 12', author: 'Mizuho Kusanagi', price: 11.990, image: 'manga6.jpg', type: 'manga' }, 
    { id: 7, title: 'Pokémon Rojo - Tomo 1', author: 'Hidenori Kusaka', price: 18.990, image: 'manga7.jpg', type: 'manga' }, 
    { id: 8, title: 'Cardcaptor Sakura - Tomo 1', author: 'CLAMP', price: 15.990, image: 'manga8.jpg', type: 'manga' }, 
    { id: 9, title: 'Fairy Tail - Tomo 34', author: 'Hiro Mashima', price: 9.990, image: 'manga9.jpg', type: 'manga' },
    { id: 10, title: 'Dungeon Meshi - Tomo 2', author: 'Ryōko Kui', price: 15.990, image: 'manga10.jpg', type: 'manga' }, 
    { id: 11, title: 'Inuyasha - Tomo 18', author: 'Rumiko Takahashi', price: 15.990, image: 'manga11.jpg', type: 'manga' }, 
    { id: 12, title: 'Sword art online Phantom Bullet - Tomo 1', author: 'Reki Kawahara', price: 9.990, image: 'manga12.jpg', type: 'manga' }, 
    { id: 13, title: 'Batman N#50 ', author: 'Scott Snyder,Marcio Takara,', price: 9.990, image: 'comic1.jpg', type: 'comic' }, 
    { id: 14, title: 'Watchmen', author: 'Alan Moore ', price: 24.990, image: 'comic2.jpg', type: 'comic' }, 
    { id: 15, title: 'The Amazing Spider-Man N#70', author: 'Joe Kelly', price: 55.000, image: 'comic3.jpg', type: 'comic' }, 
    { id: 16, title: 'batman who laughs', author: 'Scott Snyder', price: 27.990, image: 'comic4.jpg', type: 'comic' }, 
    { id: 17, title: 'Los Vengadores N#1', author: 'Stan Lee', price: 49.990, image: 'comic5.jpg', type: 'comic' }, 
    { id: 18, title: 'Spawn N#300', author: 'Scott Snyder', price: 23.990, image: 'comic6.jpg', type: 'comic' }, 
    { id: 19, title: 'Star Wars N#13', author: 'Greg Pak', price: 9.990, image: 'comic7.jpg', type: 'comic' }, 
    { id: 20, title: 'Venom: Lethal Protector N#11', author: 'David Michelinie', price: 20.990, image: 'comic8.jpg', type: 'comic' }, 
    { id: 21, title: 'X-Men (2024) N#1', author: 'Jed Mackay', price: 9.990, image: 'comic9.jpg', type: 'comic' }, 
    { id: 22, title: 'Iron Man N#26/145', author: 'Christopher Cantwell, Murewa Ayodele', price: 7.990, image: 'comic10.jpg', type: 'comic' },
    { id: 23, title: 'Invencible Vol.27', author: 'Robert Kirkman', price: 25.650, image: 'comic11.jpg', type: 'comic' }, 
    { id: 24, title: 'Warhammer 40k Ahriman Vol. 1: Exilio', author: 'John French', price: 20.900, image: 'comic12.jpg', type: 'comic' }, 
  ];
  this.productsSubject.next(this.products);
}

  private loadProductsFromLocalStorage(): void {
    const storedComics = localStorage.getItem('comicsData');
    if (storedComics) {
      this.products = JSON.parse(storedComics);
    } else {
      this.initializeDefaultProducts();
    }
    this.productsSubject.next(this.products); 
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
    this.saveProductsToLocalStorage(); 
    this.productsSubject.next(this.products); 
    return of(newProduct);
  }

  updateProduct(updatedProduct: Product): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index > -1) {
      this.products[index] = updatedProduct;
      this.saveProductsToLocalStorage(); 
      this.productsSubject.next(this.products); 
      return of(true);
    }
    return of(false);
  }

  deleteProduct(id: number): Observable<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    this.saveProductsToLocalStorage(); 
    if (this.products.length < initialLength) {
      this.productsSubject.next(this.products); 
      return of(true);
    }
    return of(false);
  }
}