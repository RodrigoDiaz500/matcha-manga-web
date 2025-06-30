// src/app/pages/reset-password/reset-password.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de la ruta correcta
import { User } from '../../models/user.model'; // Asegúrate de la ruta correcta

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // Para routerLink
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = ''; // Para almacenar el email del usuario que viene por queryParams
  newPassword1: string = '';
  newPassword2: string = '';
  message: string = '';
  isError: boolean = false;
  passwordMismatch: boolean = false; // Flag para error de coincidencia de contraseña

  // Propiedad para la expresión regular de la contraseña (reutilizada de Register)
  passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,20}$';


  @ViewChild('resetPasswordForm') resetPasswordForm!: NgForm;

  constructor(
    private route: ActivatedRoute, // Para obtener el email de los queryParams
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Obtener el email de los queryParams al inicializar el componente
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || ''; // Si no hay email, se inicializa vacío
      if (!this.email) {
        // Si no hay email en los queryParams, es un acceso inválido a esta página
        this.message = 'Acceso no autorizado. Por favor, solicita restablecer tu contraseña desde la página de recuperación.';
        this.isError = true;
      }
    });
  }

  onSubmit(): void {
    this.message = ''; // Reset message
    this.isError = false; // Reset error state
    this.passwordMismatch = false; // Reset mismatch flag

    this.resetPasswordForm.form.markAllAsTouched();

    if (this.resetPasswordForm.form.invalid) {
      this.message = 'Por favor, corrige los errores en el formulario.';
      this.isError = true;
      return;
    }

    if (this.newPassword1 !== this.newPassword2) {
      this.passwordMismatch = true;
      this.message = 'Las nuevas contraseñas no coinciden. Por favor, verifica.';
      this.isError = true;
      return;
    }

    // Aquí, en un escenario real, verificarías el token.
    // En nuestra simulación, simplemente buscamos el usuario por email
    const user = this.authService.getUserByEmail(this.email);

    if (user) {
      // Actualizar la contraseña del usuario
      const updatedUser: User = { ...user, password: this.newPassword1 };
      this.authService.updateUser(updatedUser); // Asumiendo que AuthService tiene un método updateUser

      this.message = 'Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...';
      this.isError = false;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } else {
      this.message = 'Error: No se encontró un usuario con ese email o el enlace no es válido.';
      this.isError = true;
    }
  }
}