// src/app/services/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model'; // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
  public currentUser$: Observable<User | undefined> = this.currentUserSubject.asObservable();

  // Usuarios de ejemplo para la demostración
  // En una aplicación real, estos datos provendrían de un backend seguro.
  private users: User[] = [
    { id: '1', fullName: 'Admin User', email: 'admin@correo.com', password: 'admin123', role: 'admin', address: '123 Admin St', phone: '555-1111' },
    { id: '2', fullName: 'Client User', email: 'client@correo.com', password: 'cliente123', role: 'client', address: '456 Client Ave', phone: '555-2222' },
    { id: '3', fullName: 'Pepe Gato', email: 'pepe@correo.com', password: 'password123', role: 'client', address: '789 Cat Rd', phone: '555-3333' }
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsersFromLocalStorage();
      this.loadCurrentUserFromLocalStorage();
    }
  }

  private saveUsersToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  private loadUsersFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        // Asegúrate de que los IDs cargados del localStorage también sean tratados como strings
        // Esto previene errores si los IDs se guardaron como números previamente.
        const parsedUsers: User[] = JSON.parse(storedUsers).map((user: any) => ({
          ...user,
          id: user.id ? String(user.id) : undefined // Convertir a string explícitamente
        }));
        this.users = parsedUsers;
      } else {
        // Si no hay usuarios en localStorage, guarda los predefinidos
        this.saveUsersToLocalStorage();
      }
    }
  }

  private loadCurrentUserFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user: User = JSON.parse(storedUser);
          // Asegurarse de que el objeto cargado del localStorage no tenga la contraseña
          // La propiedad `password` ahora es opcional en User, así que 'delete' es seguro.
          if (user.password !== undefined) {
            delete user.password;
          }
          // Asegurarse de que el ID del usuario cargado sea un string
          user.id = user.id ? String(user.id) : undefined;
          this.currentUserSubject.next(user);
        } catch (e) {
          console.error("Error al parsear el usuario del localStorage:", e);
          localStorage.removeItem('currentUser'); // Limpiar datos corruptos
        }
      }
    }
  }

  // Método de login
  login(email: string, password: string): Observable<boolean> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      const userToStore = { ...user }; // Crear una copia para evitar mutar el original
      // La propiedad `password` ahora es opcional en User, así que 'delete' es seguro.
      if (userToStore.password !== undefined) {
        delete userToStore.password;
      }
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('currentUser', JSON.stringify(userToStore));
      }
      this.currentUserSubject.next(userToStore);
      console.log('Login exitoso para:', user.email);
      return of(true);
    } else {
      console.log('Fallo de login para:', email);
      return of(false);
    }
  }

  // Método de logout
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(undefined);
    console.log('Usuario ha cerrado sesión.');
  }

  // Método de registro de usuario
  register(newUser: User): boolean {
    if (this.getUserByEmail(newUser.email)) {
      console.warn('Registro fallido: El email ya está en uso.');
      return false; // El email ya existe
    }

    // Generar un ID único para el nuevo usuario.
    // Usamos string para que coincida con `id?: string` en user.model.ts
    const newId = this.users.length > 0
      ? (Math.max(...this.users.map(u => parseInt(u.id || '0'))) + 1).toString()
      : '1';
    const userWithId: User = { ...newUser, id: newId };

    this.users.push(userWithId);
    this.saveUsersToLocalStorage();
    console.log('Usuario registrado:', userWithId.email);
    return true;
  }

  // Obtener usuario por email
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  // Obtener usuario por ID
  getUserById(id: string): User | undefined { // Cambia el parámetro 'id' a string si tus IDs son strings
    return this.users.find(u => u.id === id);
  }

  // Verificar si el usuario actual es admin
  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === 'admin';
  }

  // Método para actualizar perfil de usuario
  updateUser(updatedUser: User): Observable<boolean> {
    // Asegúrate de que el ID del usuario actualizado sea un string si tu modelo lo define así
    const userIndex = this.users.findIndex(u => u.id === updatedUser.id);
    if (userIndex > -1) {
      // Crear una copia del usuario existente para modificar
      const updatedUserCopy = { ...this.users[userIndex] };

      // Actualizar solo las propiedades que pueden ser modificadas por el usuario
      updatedUserCopy.fullName = updatedUser.fullName;
      updatedUserCopy.email = updatedUser.email;
      updatedUserCopy.address = updatedUser.address;
      updatedUserCopy.phone = updatedUser.phone;
      // No modificamos updatedUserCopy.role directamente aquí.

      // Si se proporciona una nueva contraseña, actualízala
      if (updatedUser.password) {
        updatedUserCopy.password = updatedUser.password;
      }
      
      // Asegurarse de que el email no esté ya en uso por otro usuario
      const existingUserWithEmail = this.users.find(u => u.email === updatedUserCopy.email && u.id !== updatedUserCopy.id);
      if (existingUserWithEmail) {
        console.warn('Actualización fallida: El nuevo email ya está en uso por otro usuario.');
        return of(false);
      }

      this.users[userIndex] = updatedUserCopy; // Reemplazar el usuario en el array
      this.saveUsersToLocalStorage(); // Guardar la lista completa de usuarios

      // Actualizar el usuario logueado si es el mismo que se está editando
      const currentUser = this.currentUserSubject.value;
      if (currentUser && currentUser.id === updatedUserCopy.id) {
        const userToEmit = { ...updatedUserCopy };
        // La propiedad `password` ahora es opcional en User, así que 'delete' es seguro.
        if (userToEmit.password !== undefined) {
          delete userToEmit.password; // Eliminar la contraseña antes de emitir
        }
        localStorage.setItem('currentUser', JSON.stringify(userToEmit));
        this.currentUserSubject.next(userToEmit);
      }

      console.log('Usuario actualizado:', updatedUserCopy.email);
      return of(true);
    } else {
      console.warn('Actualización fallida: Usuario no encontrado.');
      return of(false);
    }
  }
}