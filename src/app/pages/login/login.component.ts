// src/app/pages/login/login.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- ¡IMPORTANTE! Agrega esto
import { FormsModule, NgForm } from '@angular/forms'; // <-- ¡IMPORTANTE! Agrega FormsModule y NgForm
// Importa tu servicio de autenticación si lo tienes
// import { AuthService } from 'path/to/your/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, // Si es un componente standalone
  imports: [
    CommonModule, // <-- ¡IMPORTANTE! Agrega CommonModule aquí
    FormsModule   // <-- ¡IMPORTANTE! Agrega FormsModule aquí
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email!: string;
  password!: string;
  loginError: boolean = false;
  @ViewChild('loginForm') loginForm!: NgForm;

  // constructor(private authService: AuthService) { } // Si usas un servicio de auth

  onLogin(): void {
    this.loginError = false; // Reset error on new attempt
    if (this.loginForm.valid) {
      // Aquí iría tu lógica de autenticación
      console.log('Login attempt with:', this.email, this.password);
      // Ejemplo simplificado:
      if (this.email === 'admin@correo.com' && this.password === 'admin123') {
        console.log('Login exitoso!');
        // Redirigir o emitir evento de login
      } else {
        this.loginError = true;
        console.log('Login fallido.');
      }
    }
  }
}