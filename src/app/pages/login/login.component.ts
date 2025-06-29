// src/app/pages/login/login.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importa tu servicio de autenticación
import { Router, RouterModule } from '@angular/router'; // Importa Router y RouterModule

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // Necesario para routerLink en el template
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; // Usaremos esta cadena para los mensajes de error

  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = ''; // Limpia mensajes de error previos
    
    // Asegúrate de que el formulario es válido antes de intentar el login
    if (this.loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe(success => {
        if (success) {
          // Redirige según el rol del usuario
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin-dashboard']); // Ruta para el panel de administración
          } else {
            this.router.navigate(['/']); // Ruta para la página de inicio de cliente
          }
        } else {
          // Muestra el mensaje de error si las credenciales son inválidas
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      // Si el formulario no es válido (ej. campos vacíos), puedes mostrar un mensaje general
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }
}