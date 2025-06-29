// src/app/components/simulated-payment/simulated-payment.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importar RouterModule si hay routerLink en el template

@Component({
  selector: 'app-simulated-payment',
  standalone: true,
  imports: [CommonModule, RouterModule], // Añade RouterModule si usas routerLink
  templateUrl: './simulated-payment.component.html',
  styleUrls: ['./simulated-payment.component.css'] // Si tienes un archivo CSS para este componente
})
export class SimulatedPaymentComponent {
  // Aquí podrías añadir lógica si la necesitas, como un temporizador
  // o mostrar detalles de la compra si se pasaran por estado del router.
}