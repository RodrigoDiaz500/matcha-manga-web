import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../../services/product.service'; 
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from './product-modal/product-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  private productsSubscription!: Subscription;

  constructor(
    private productService: ProductService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.productsSubscription = this.productService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  openProductModal(product?: Product): void {
    const modalRef = this.modalService.open(ProductModalComponent, { size: 'lg', centered: true });
    if (product) {
      modalRef.componentInstance.product = { ...product }; 
    } else {
      modalRef.componentInstance.product = { id: 0, title: '', author: '', price: 0, image: '', type: 'manga' };
    }


    modalRef.result.then((result: Product) => {
      if (result.id) {
        this.productService.updateProduct(result);
        alert('Producto actualizado con éxito.'); 
      } else {
        this.productService.addProduct(result);
        alert('Nuevo producto agregado con éxito.'); 
      }
    }, (reason: any) => {
      console.log(`Modal dismissed with: ${reason}`);
    });
  }
  
  editProduct(product: Product): void {
    this.openProductModal(product);
  }

  deleteProduct(productId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
      this.productService.deleteProduct(productId);
      alert('Producto eliminado correctamente.');
    }
  }
}