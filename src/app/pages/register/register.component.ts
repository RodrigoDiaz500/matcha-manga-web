import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model'; // <-- Ruta corregida si el modelo está en src/app/models/

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  fullName: string = '';
  email: string = '';
  passwordA: string = '';
  confirmPasswordA: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // Código de inicialización si es necesario
  }

  onSubmit(form: NgForm): void {
    // Validaciones de contraseñas
    if (this.passwordA !== this.confirmPasswordA) {
      if (form.controls['confirmPassword']) {
          form.controls['confirmPassword'].setErrors({ 'passwordMismatch': true });
      }
    } else {
        if (form.controls['confirmPassword'] && form.controls['confirmPassword'].errors?.['passwordMismatch']) {
            form.controls['confirmPassword'].setErrors(null);
        }
    }

    form.form.markAllAsTouched();

    if (form.valid && this.passwordA === this.confirmPasswordA) {
      // Usa getUserByEmail para verificar si el email ya existe
      if (this.authService.getUserByEmail(this.email)) { // <-- Método corregido
        alert('El email ya está registrado. Por favor, usa otro o inicia sesión.');
        if (form.controls['email']) {
            form.controls['email'].setErrors({ 'emailTaken': true });
        }
      } else {
        const newUser: User = {
          fullName: this.fullName,
          email: this.email,
          password: this.passwordA,
          role: 'client', // Por defecto, los registros son clientes
          address: '',
          phone: ''
        };
        // Usa el método register del servicio
        if (this.authService.register(newUser)) { // <-- Método corregido
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        } else {
          // Esto debería ser manejado por la verificación previa, pero es un fallback
          alert('No se pudo registrar el usuario. Inténtalo de nuevo.');
        }
      }
    } else {
      alert('Por favor, completa el formulario correctamente y asegúrate de que las contraseñas coincidan.');
    }
  }
}