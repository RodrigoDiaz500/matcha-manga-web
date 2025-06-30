import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-simulated-payment',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './simulated-payment.component.html',
  styleUrls: ['./simulated-payment.component.css'] 
})
export class SimulatedPaymentComponent {
}