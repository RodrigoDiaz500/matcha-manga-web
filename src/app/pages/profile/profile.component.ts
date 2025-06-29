import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common'; // <-- ¡IMPORTANTE: Añade CommonModule!
import { FormsModule } from '@angular/forms'; // Si usas [(ngModel)] en tu template
import { Router } from '@angular/router'; // <-- ¡IMPORTANTE: Importa Router!

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,   // Necesario para *ngIf, *ngFor, etc.
    FormsModule     // Necesario si usas formularios y [(ngModel)]
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: User | undefined;
  // Puedes añadir variables para controlar el modo de edición si lo implementas:
  // isEditing: boolean = false;
  // editableUser: User | undefined; // Para trabajar con una copia editable del usuario

  constructor(private authService: AuthService, private router: Router) { } // Inyecta Router

  ngOnInit(): void {
    // Suscribirse a currentUser$ para obtener el usuario actual de forma reactiva
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // if (user) { this.editableUser = { ...user }; } // Si usas editableUser
    });

    // También podrías obtener el valor actual al inicio si no esperas un cambio inmediato
    // this.currentUser = this.authService.getCurrentUser();
  }

  // Método para manejar la edición del perfil (este es un stub funcional)
  editProfile(): void {
    console.log("Navegando a la edición de perfil o activando modo edición...");
    // Opción 1: Navegar a una ruta de edición
    // this.router.navigate(['/perfil/editar']);

    // Opción 2: Cambiar una bandera para mostrar un formulario de edición en la misma página
    // this.isEditing = true;
  }

  // Método para cerrar sesión (llamará al servicio y redirigirá)
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirigir a la página de login
  }

  // Si implementas un formulario de edición, necesitarías un método para guardar los cambios:
  // saveProfileChanges(): void {
  //   if (this.editableUser) {
  //     // Llama a un método en AuthService para actualizar el usuario en localStorage
  //     // this.authService.updateUser(this.editableUser); // Asumiendo que existe un método updateUser
  //     // this.isEditing = false;
  //     // alert('Perfil actualizado con éxito.');
  //   }
  // }
}