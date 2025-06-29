// src/app/pages/admin-dashboard/admin-dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Product, ProductService } from '../../services/product.service'; // Asumo que Product está en el mismo archivo
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductModalComponent } from './product-modal/product-modal.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgbModalModule,
    // No es estrictamente necesario importar ProductModalComponent aquí si solo se abre programáticamente
    // ProductModalComponent // Puedes mantenerlo si prefieres, la advertencia seguirá pero funciona
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
    // Asegúrate de cargar los productos iniciales si tu servicio no lo hace automáticamente
    // this.products = this.productService.getProducts(); // Si getProducts() no requiere argumentos
    this.productsSubscription = this.productService.products$.subscribe((products: Product[]) => {
      this.products = products;
    });
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  // Este método ahora se encargará de abrir el modal tanto para agregar como para editar
  openProductModal(product?: Product): void {
    const modalRef = this.modalService.open(ProductModalComponent, { size: 'lg', centered: true });
    if (product) {
      // Si se pasa un producto, es para editar
      modalRef.componentInstance.product = { ...product }; // Pasa una copia del producto para evitar mutaciones directas
    } else {
      // Si no se pasa un producto, es para agregar uno nuevo con valores predeterminados
      modalRef.componentInstance.product = { id: 0, title: '', author: '', price: 0, image: '', type: 'manga' };
    }


    modalRef.result.then((result: Product) => {
      // 'result' es el producto modificado o nuevo que devuelve el modal al cerrarse con éxito
      if (result.id) {
        this.productService.updateProduct(result);
        alert('Producto actualizado con éxito.'); // Feedback al usuario
      } else {
        // En este caso, el ID es 0, lo que indica que es un nuevo producto que el servicio asignará un ID
        this.productService.addProduct(result);
        alert('Nuevo producto agregado con éxito.'); // Feedback al usuario
      }
    }, (reason: any) => {
      // El modal se cerró sin guardar (ej. por clic en "Cancelar" o fuera del modal)
      console.log(`Modal dismissed with: ${reason}`);
    });
  }

  // Puedes eliminar el método editProduct en el HTML y usar openProductModal directamente
  // Si deseas mantener un método con ese nombre por claridad, haz que llame a openProductModal:
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