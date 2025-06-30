import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

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
export class RegisterComponent {
  newUser: User = {
    fullName: '',
    email: '',
    password: '',
    role: 'client',
    address: '',
    phone: ''
  };
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  passwordMismatch: boolean = false;
  passwordPattern: string = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};\':"\\\\|,.<>\\/?]).{8,20}$';


  @ViewChild('registerForm') registerForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordMismatch = false;

    this.registerForm.form.markAllAsTouched();

    if (this.registerForm.form.invalid) {
      this.errorMessage = 'Por favor, corrige los errores en el formulario antes de enviar.';
      return;
    }

    if (this.newUser.password !== this.confirmPassword) {
      this.passwordMismatch = true;
      this.errorMessage = 'Las contraseñas no coinciden. Por favor, verifica.';
      return;
    }

    if (this.authService.getUserByEmail(this.newUser.email)) {
      this.errorMessage = 'Este correo electrónico ya está registrado. Por favor, utiliza otro.';
      return;
    }

    const userToRegister: User = {
      fullName: this.newUser.fullName,
      email: this.newUser.email,
      password: this.newUser.password,
      role: 'client',
      address: this.newUser.address,
      phone: this.newUser.phone
    };

    if (this.authService.register(userToRegister)) {
      this.successMessage = '¡Registro exitoso! Ahora puedes iniciar sesión.';
      this.registerForm.resetForm();
      this.confirmPassword = '';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = 'Hubo un error al intentar registrar el usuario. Por favor, inténtalo de nuevo.';
    }
  }
}