// src/app/pages/profile/profile.component.ts
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
  editableUser: User | undefined; // Copia editable para el formulario
  private userSubscription!: Subscription;
  successMessage: string = '';
  errorMessage: string = '';
  changePasswordMode: boolean = false; // Para controlar la visibilidad de campos de contraseña
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  @ViewChild('profileForm') profileForm!: NgForm;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        // Crear una copia profunda del usuario para editar
        this.editableUser = { ...user, password: '' }; // No cargamos la contraseña existente en el formulario
      } else {
        // Si no hay usuario logueado, redirigir al login (aunque el guard debería manejarlo)
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

    // Preparar el objeto para enviar al servicio
    const userToUpdate: User = {
      ...this.editableUser,
      id: this.currentUser?.id, // Asegurar que el ID del usuario original se mantenga
      role: this.currentUser?.role || 'client' // Mantener el rol original
    };

    // Si el usuario está cambiando la contraseña
    if (this.changePasswordMode) {
      // Validar la contraseña actual (simulación)
      // En una app real, esto debería ser validado en el backend
      const storedUserWithPassword = this.authService['users'].find(u => u.id === this.currentUser?.id); // Acceso a la lista interna para validar la contraseña
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
      userToUpdate.password = this.newPassword; // Añadir la nueva contraseña al objeto de actualización
    } else {
      // Si no se está cambiando la contraseña, asegurarse de no enviar una contraseña vacía o modificada
      userToUpdate.password = this.currentUser?.password; // Mantener la contraseña existente si no se cambia
    }


    this.authService.updateUser(userToUpdate).subscribe(
      success => {
        if (success) {
          this.successMessage = 'Perfil actualizado exitosamente.';
          // Resetear campos de contraseña después de la actualización exitosa
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
    // Limpiar campos de contraseña al cambiar el modo
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
  }
}