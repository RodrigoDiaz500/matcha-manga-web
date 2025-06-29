export interface User {
  id?: string; // Angular generará IDs, o puedes usar el email como ID si es único.
  username?: string; // En tu JS, el login es por email, pero Angular prefiere 'username' si existe. Lo haré opcional.
  email: string;
  password: string; // Tu JS usa 'password', no 'password_hash'. Ajusto esto.
  fullName: string;
  role: 'client' | 'admin'; // Tu JS usa 'client' y 'admin'.
  address: string;
  phone: string;
}

// Puedes añadir una función helper para generar IDs si no usas una API
export function generateUniqueId(): string {
  return Math.random().toString(36).substr(2, 9);
}