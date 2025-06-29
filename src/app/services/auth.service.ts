import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, generateUniqueId } from '../models/user.model'; // Importa User y generateUniqueId si lo usas

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: { [email: string]: User } = {}; // Almacenamos usuarios por email para facilitar la búsqueda
  private currentUserSubject: BehaviorSubject<User | undefined>;
  public currentUser$: Observable<User | undefined>;

  private isLoggedInSubject: BehaviorSubject<boolean>;
  public isLoggedIn$: Observable<boolean>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadUsersFromLocalStorage(); // Carga usuarios de localStorage
      const storedUserEmail = localStorage.getItem('currentUserEmail'); // Tu JS usa 'currentUserEmail'
      const initialUser = storedUserEmail ? this.users[storedUserEmail] : undefined;
      this.currentUserSubject = new BehaviorSubject<User | undefined>(initialUser);
      this.isLoggedInSubject = new BehaviorSubject<boolean>(!!initialUser);
    } else {
      this.currentUserSubject = new BehaviorSubject<User | undefined>(undefined);
      this.isLoggedInSubject = new BehaviorSubject<boolean>(false);
    }

    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoggedIn$ = this.isLoggedInSubject.asObservable();
  }

  // Carga inicial de usuarios desde localStorage o datos simulados
  private loadUsersFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      } else {
        // Datos iniciales si no hay nada en localStorage, como en tu script.js
        this.users = {
          'cliente@correo.com': { id: generateUniqueId(), fullName: 'Cliente Ejemplo', email: 'cliente@correo.com', password: 'password123', role: 'client', address: 'Av. Siempre Viva 742', phone: '+56911112222' },
          'admin@correo.com': { id: generateUniqueId(), fullName: 'Admin Ejemplo', email: 'admin@correo.com', password: 'admin123', role: 'admin', address: 'Calle Ficticia 101', phone: '+56933334444' }
        };
        this.saveUsersToLocalStorage(); // Guarda estos usuarios iniciales
      }
    }
  }

  private saveUsersToLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }

  // --- Métodos de autenticación ---

  register(user: User): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    if (this.users[user.email]) {
      console.warn('El email ya está registrado.');
      return false; // Email ya existe
    }

    // Asigna un ID si no viene (aunque con generateUniqueId ya lo haríamos al crear el objeto)
    if (!user.id) {
        user.id = generateUniqueId();
    }
    // Asigna un rol por defecto si no viene
    if (!user.role) {
        user.role = 'client';
    }

    this.users[user.email] = user;
    this.saveUsersToLocalStorage();
    return true;
  }

  login(email: string, password_input: string): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;

    const user = this.users[email];
    if (user && user.password === password_input) { // Tu JS usa 'password', no 'password_hash'
      localStorage.setItem('currentUserEmail', user.email); // Almacena el email para recuperar el user
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(true);
      return true;
    }
    return false;
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUserEmail');
    }
    this.currentUserSubject.next(undefined);
    this.isLoggedInSubject.next(false);
  }

  // --- Métodos para obtener información del usuario ---

  getCurrentUser(): User | undefined {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  isAdmin(): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.role === 'admin' : false;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users[email];
  }

  // Método para actualizar los datos del usuario (usado en el perfil)
  updateUser(updatedUser: User): void {
    if (!isPlatformBrowser(this.platformId) || !updatedUser.email) return;

    if (this.users[updatedUser.email]) {
      this.users[updatedUser.email] = updatedUser;
      this.saveUsersToLocalStorage();
      // Si el usuario actualizado es el usuario logueado, también actualiza el BehaviorSubject
      if (this.currentUserSubject.value?.email === updatedUser.email) {
        this.currentUserSubject.next(updatedUser);
      }
    }
  }

  // Agregamos un método para obtener todos los usuarios (para el admin dashboard si lo necesitas)
  getAllUsers(): User[] {
    return Object.values(this.users);
  }
}