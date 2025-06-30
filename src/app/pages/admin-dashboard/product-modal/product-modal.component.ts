import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'; 
import { Product } from '../../../services/product.service'; 
import { ProductService } from '../../../services/product.service'; 

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
  @Input() product: Product = { id: 0, title: '', author: '', price: 0, image: '', type: 'manga' };
  @ViewChild('productForm') productForm!: NgForm;

  constructor(
    public activeModal: NgbActiveModal, 
    private productService: ProductService 
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.activeModal.close(this.product); 
    } else {
      console.log('Formulario inválido. No se puede guardar.');
    }
  }
}