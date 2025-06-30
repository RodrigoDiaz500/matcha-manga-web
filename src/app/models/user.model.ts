// src/app/models/user.model.ts
export interface User {
  id?: string; // Mantener como string, como está definido.
  username?: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'client' | 'admin';
  address: string;
  phone: string;
}

export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}