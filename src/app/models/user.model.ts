// src/app/models/user.model.ts
export interface User {
  id?: number; // <<-- CAMBIADO A 'number' Y HECHO OPCIONAL. El servicio lo generará.
  fullName: string;
  email: string;
  password?: string; // <<-- HECHO OPCIONAL para permitir 'delete' y manejo de la contraseña
  role: 'admin' | 'client';
  address?: string; // Opcional, si no todos los usuarios tienen dirección
  phone?: string;   // Opcional, si no todos los usuarios tienen teléfono
}