// src/app/pages/register/register.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de la ruta correcta
import { User } from '../../models/user.model'; // Asegúrate de la ruta correcta

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // Para routerLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // Inicializa las propiedades del nuevo usuario
  newUser: User = {
    id: 0, // <<-- Ahora 'id' en User puede ser 'number', así que '0' es válido. El servicio lo generará.
    fullName: '',
    email: '',
    password: '',
    role: 'client', // Por defecto, los usuarios registrados son 'client'
    address: '',
    phone: ''
  };
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = ''; // Limpiar mensajes previos
    this.successMessage = '';

    if (this.registerForm.valid) {
      if (this.newUser.password !== this.confirmPassword) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      // Verificar si el email ya existe antes de intentar registrar
      if (this.authService.getUserByEmail(this.newUser.email)) {
        this.errorMessage = 'Este correo electrónico ya está registrado.';
        return;
      }

      // Llamar al método register del AuthService
      // No pasar 'id' ya que el servicio lo generará
      const userToRegister: User = {
        fullName: this.newUser.fullName,
        email: this.newUser.email,
        password: this.newUser.password,
        role: 'client', // Asegurarse de que el rol sea 'client' por defecto para nuevos registros
        address: this.newUser.address,
        phone: this.newUser.phone
      };

      if (this.authService.register(userToRegister)) {
        this.successMessage = '¡Registro exitoso! Ahora puedes iniciar sesión.';
        this.registerForm.resetForm(); // Limpiar el formulario
        // Opcional: redirigir automáticamente al login después de un breve retraso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      } else {
        // Esto solo debería ocurrir si el email ya existía (manejado arriba) o por algún otro fallo interno del servicio.
        this.errorMessage = 'Hubo un error al intentar registrar el usuario. Por favor, inténtalo de nuevo.';
      }
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos y asegúrate de que sean válidos.';
    }
  }
}