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
    { id: 1, fullName: 'Admin User', email: 'admin@correo.com', password: 'admin123', role: 'admin', address: '123 Admin St', phone: '555-1111' },
    { id: 2, fullName: 'Client User', email: 'client@correo.com', password: 'cliente123', role: 'client', address: '456 Client Ave', phone: '555-2222' },
    { id: 3, fullName: 'Pepe Gato', email: 'pepe@correo.com', password: 'password123', role: 'client', address: '789 Cat Rd', phone: '555-3333' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Solo intentar cargar desde localStorage si estamos en un navegador
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsersFromLocalStorage(); // Cargar todos los usuarios (si existen)
      this.loadCurrentUserFromLocalStorage();
    }
  }

  // Carga el usuario actual si existe en localStorage
  private loadCurrentUserFromLocalStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user: User = JSON.parse(storedUser);
        // Por seguridad, elimina la propiedad 'password' antes de emitir
        if (user.password !== undefined) {
          delete user.password;
        }
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error("Error al analizar el usuario almacenado en localStorage", e);
        localStorage.removeItem('currentUser'); // Limpiar datos inválidos
      }
    }
  }

  // Carga la lista completa de usuarios (para simular un "backend" persistente)
  private loadUsersFromLocalStorage(): void {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      try {
        const parsedUsers: User[] = JSON.parse(storedUsers);
        // Merge con los usuarios iniciales, asegurando no duplicados por ID o email
        const uniqueUsers = new Map<number, User>();
        this.users.forEach(u => {
          if (u.id !== undefined) {
            uniqueUsers.set(u.id, u);
          }
        });
        parsedUsers.forEach(u => {
          if (u.id !== undefined && !uniqueUsers.has(u.id)) {
            uniqueUsers.set(u.id, u);
          } else if (u.email && !this.users.some(existing => existing.email === u.email)) {
             // Si el ID existe, pero el email es nuevo, podrías actualizar o decidir qué hacer
             // Para esta demo, si el ID existe, lo ignoramos para evitar conflictos
          }
        });
        this.users = Array.from(uniqueUsers.values());
      } catch (e) {
        console.error("Error al analizar usuarios registrados en localStorage", e);
        localStorage.removeItem('registeredUsers');
      }
    }
  }

  // Guarda la lista completa de usuarios en localStorage
  private saveUsersToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('registeredUsers', JSON.stringify(this.users));
    }
  }

  /**
   * Intenta iniciar sesión con las credenciales proporcionadas.
   * @param email El correo electrónico del usuario.
   * @param password La contraseña del usuario.
   * @returns Un Observable que emite `true` si el login fue exitoso, `false` en caso contrario.
   */
  login(email: string, password: string): Observable<boolean> {
    const foundUser = this.users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      // Crear una copia del usuario y eliminar la contraseña antes de almacenar/emitir
      const userToStore = { ...foundUser };
      if (userToStore.password !== undefined) {
        delete userToStore.password;
      }
      
      localStorage.setItem('currentUser', JSON.stringify(userToStore));
      this.currentUserSubject.next(userToStore);
      console.log('Login exitoso para:', userToStore.fullName);
      return of(true); // Login exitoso
    } else {
      console.log('Fallo de login para:', email);
      return of(false); // Login fallido
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(undefined);
    console.log('Sesión cerrada.');
  }

  /**
   * Verifica si el usuario actual tiene el rol de administrador.
   * @returns `true` si el usuario es administrador, `false` en caso contrario.
   */
  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'admin';
  }

  /**
   * Verifica si hay un usuario logueado.
   * @returns `true` si hay un usuario logueado, `false` en caso contrario.
   */
  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param email El correo electrónico a buscar.
   * @returns El usuario si lo encuentra, o `undefined`.
   */
  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  /**
   * Registra un nuevo usuario.
   * @param newUser El objeto de usuario a registrar.
   * @returns `true` si el registro fue exitoso, `false` si el email ya existe.
   */
  register(newUser: User): boolean {
    if (this.getUserByEmail(newUser.email)) {
      console.warn('Registro fallido: El email ya está en uso.');
      return false; // El email ya existe
    }

    // Asignar un nuevo ID único de tipo 'number'
    const newId = this.users.length > 0 ? Math.max(...this.users.map(u => u.id ?? 0)) + 1 : 1;
    const userToRegister: User = { ...newUser, id: newId };
    
    this.users.push(userToRegister);
    this.saveUsersToLocalStorage(); // Guardar la lista actualizada de usuarios
    console.log('Usuario registrado:', userToRegister.email);
    return true; // Registro exitoso
  }

  /**
   * Actualiza la información de un usuario existente.
   * No permite modificar el rol.
   * @param updatedUser Los datos del usuario a actualizar.
   * @returns Un Observable que emite `true` si la actualización fue exitosa, `false` en caso contrario.
   */
  updateUser(updatedUser: User): Observable<boolean> {
    const userIndex = this.users.findIndex(u => u.id === updatedUser.id);

    if (userIndex > -1) {
      const originalUser = this.users[userIndex];
      // Crear una copia para modificar y asegurarse de que el ID sea un número válido
      const updatedUserCopy: User = { ...originalUser };

      // Actualizar solo las propiedades permitidas (todas excepto el rol y la contraseña si no se cambia)
      updatedUserCopy.fullName = updatedUser.fullName;
      updatedUserCopy.email = updatedUser.email;
      updatedUserCopy.address = updatedUser.address;
      updatedUserCopy.phone = updatedUser.phone;
      // No modificamos updatedUserCopy.role

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
        if (userToEmit.password !== undefined) {
          delete userToEmit.password; // Eliminar la contraseña antes de emitir
        }
        localStorage.setItem('currentUser', JSON.stringify(userToEmit));
        this.currentUserSubject.next(userToEmit);
      }

      console.log('Usuario actualizado:', updatedUserCopy.email);
      return of(true);
    }
    console.warn('Actualización fallida: Usuario no encontrado.');
    return of(false);
  }
}