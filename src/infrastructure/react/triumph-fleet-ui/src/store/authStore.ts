import { create } from 'zustand';
import { UserRole } from '@domain/enums/UserRole';

interface User {
  id: string;
  email: string;
  role: UserRole;
  // ... autres propriétés utilisateur
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  // ... autres propriétés et méthodes d'authentification
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  // ... autres méthodes d'authentification
}));
