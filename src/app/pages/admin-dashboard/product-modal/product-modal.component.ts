// src/app/pages/admin-dashboard/product-modal/product-modal.component.ts
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; // <-- ¡IMPORTANTE! Agrega esta importación
import { Product } from '../../../services/product.service'; // Asegúrate de que la ruta sea correcta
import { ProductService } from '../../../services/product.service'; // Si lo usas aquí directamente

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})
export class ProductModalComponent implements OnInit {
  // Asegúrate de que product tenga valores por defecto para que no sea undefined
  @Input() product: Product = { id: 0, title: '', author: '', price: 0, image: '', type: 'manga' };
  @ViewChild('productForm') productForm!: NgForm;

  constructor(
    public activeModal: NgbActiveModal, // <-- ¡IMPORTANTE! Inyecta NgbActiveModal
    private productService: ProductService // Si necesitas el servicio aquí para manejar el guardado
  ) { }

  ngOnInit(): void {
    // Si el modal se abre para un producto existente, el @Input 'product' ya lo habrá seteado.
    // Si se abre para un nuevo producto, 'product' ya tiene los valores por defecto.
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      // Notificamos al componente padre (AdminDashboardComponent) con el producto modificado/nuevo
      // El componente padre se encargará de llamar a productService.addProduct/updateProduct
      this.activeModal.close(this.product); // Cierra el modal y pasa el objeto product
    } else {
      console.log('Formulario inválido. No se puede guardar.');
    }
  }
}