export interface User {
  id?: string; 
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