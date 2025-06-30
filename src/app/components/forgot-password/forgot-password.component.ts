// src/app/pages/forgot-password/forgot-password.component.ts
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Asegúrate de la ruta correcta

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // Para routerLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  isError: boolean = false;

  @ViewChild('forgotPasswordForm') forgotPasswordForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit(): void {
    this.message = ''; // Reset message
    this.isError = false; // Reset error state

    // Marca todos los controles del formulario como 'touched' para que se muestren los errores de validación
    this.forgotPasswordForm.form.markAllAsTouched();

    if (this.forgotPasswordForm.form.invalid) {
      this.message = 'Por favor, introduce un email válido.';
      this.isError = true;
      return;
    }

    const user = this.authService.getUserByEmail(this.email);

    if (user) {
      // En un entorno real, aquí enviarías un email con un token único.
      // Para simular, redirigimos al usuario a la página de restablecimiento
      // y pasamos el email como parámetro de consulta (o podrías usar un servicio
      // compartido si el email es sensible o el flujo es más complejo).
      this.message = 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña. (Simulado)';
      this.isError = false;
      // Redirigir al componente de restablecimiento de contraseña, pasando el email
      setTimeout(() => {
        // En un escenario real, pasarías un token. Aquí pasamos el email
        // de forma "insegura" para simplificar la simulación.
        this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
      }, 3000);
    } else {
      // Es una buena práctica de seguridad no confirmar si el email existe o no
      this.message = 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.';
      this.isError = false; // No lo marcamos como error para no dar pistas a atacantes
    }
  }
}