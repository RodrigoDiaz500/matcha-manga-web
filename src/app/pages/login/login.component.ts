import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; 
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 

  @ViewChild('loginForm') loginForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = ''; 
    if (this.loginForm.valid) {
      this.authService.login(this.email, this.password).subscribe(success => {
        if (success) {
          if (this.authService.isAdmin()) {
            this.router.navigate(['/admin-dashboard']); 
          } else {
            this.router.navigate(['/']); 
          }
        } else {
          this.errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
    }
  }
}