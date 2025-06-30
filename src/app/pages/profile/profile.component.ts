import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser: User | undefined;
  editableUser: User | undefined; 
  private userSubscription!: Subscription;
  successMessage: string = '';
  errorMessage: string = '';
  changePasswordMode: boolean = false; 
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  @ViewChild('profileForm') profileForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.editableUser = { ...user, password: '' }; 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onUpdateProfile(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.editableUser || !this.profileForm.valid) {
      this.errorMessage = 'Por favor, corrige los errores del formulario.';
      return;
    }

    const userToUpdate: User = {
      ...this.editableUser,
      id: this.currentUser?.id, 
      role: this.currentUser?.role || 'client' 
    };

    if (this.changePasswordMode) {
      const storedUserWithPassword = this.authService['users'].find(u => u.id === this.currentUser?.id); 
      if (!storedUserWithPassword || storedUserWithPassword.password !== this.currentPassword) {
        this.errorMessage = 'La contraseña actual es incorrecta.';
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        this.errorMessage = 'La nueva contraseña y su confirmación no coinciden.';
        return;
      }
      if (this.newPassword.length < 6) {
        this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
        return;
      }
      userToUpdate.password = this.newPassword; 
    } else {
      userToUpdate.password = this.currentUser?.password; 
    }


    this.authService.updateUser(userToUpdate).subscribe(
      success => {
        if (success) {
          this.successMessage = 'Perfil actualizado exitosamente.';
          this.changePasswordMode = false;
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
        } else {
          this.errorMessage = 'No se pudo actualizar el perfil. Verifica el correo electrónico o inténtalo de nuevo.';
        }
      },
      error => {
        console.error('Error al actualizar perfil:', error);
        this.errorMessage = 'Ocurrió un error inesperado al actualizar el perfil.';
      }
    );
  }

  togglePasswordMode(): void {
    this.changePasswordMode = !this.changePasswordMode;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }
}