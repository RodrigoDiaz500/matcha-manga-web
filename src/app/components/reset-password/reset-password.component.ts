import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { User } from '../../models/user.model';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  email: string = ''; 
  newPassword1: string = '';
  newPassword2: string = '';
  message: string = '';
  isError: boolean = false;
  passwordMismatch: boolean = false; 
  passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,20}$';


  @ViewChild('resetPasswordForm') resetPasswordForm!: NgForm;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || ''; 
      if (!this.email) {
        this.message = 'Acceso no autorizado. Por favor, solicita restablecer tu contraseña desde la página de recuperación.';
        this.isError = true;
      }
    });
  }

  onSubmit(): void {
    this.message = ''; 
    this.isError = false;
    this.passwordMismatch = false; 

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

    const user = this.authService.getUserByEmail(this.email);

    if (user) {
      const updatedUser: User = { ...user, password: this.newPassword1 };
      this.authService.updateUser(updatedUser);

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