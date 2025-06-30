import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
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
    this.message = '';
    this.isError = false;
    this.forgotPasswordForm.form.markAllAsTouched();

    if (this.forgotPasswordForm.form.invalid) {
      this.message = 'Por favor, introduce un email válido.';
      this.isError = true;
      return;
    }

    const user = this.authService.getUserByEmail(this.email);

    if (user) {
      this.message = 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña. (Simulado)';
      this.isError = false;
      setTimeout(() => {
        this.router.navigate(['/reset-password'], { queryParams: { email: this.email } });
      }, 3000);
    } else {
      this.message = 'Si tu email está registrado, recibirás un enlace para restablecer tu contraseña.';
      this.isError = false; 
    }
  }
}