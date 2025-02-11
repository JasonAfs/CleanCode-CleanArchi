// src/infrastructure/react/triumph-fleet-ui/providers/AuthProvider.tsx
import { useState, useEffect, ReactNode, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { HttpAuthenticationGateway } from '../services/auth/HttpAuthenticationGateway';
import type { User } from '@domain/entities/UserEntity';
import type { LoginDTO } from '@application/dtos/auth/LoginDTO';
import type { RegisterDTO } from '@application/dtos/auth/RegisterDTO';

interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const authGateway = useMemo(() => new HttpAuthenticationGateway(), []);

  const value = useMemo(
    () => ({
      user,
      login: async (credentials: LoginDTO) => {
        const tokens = await authGateway.login(credentials);
        setUser(authGateway.getCurrentUser());
        return tokens;
      },
      register: async (data: RegisterDTO) => {
        return authGateway.register(data);
      },
      logout: async () => {
        await authGateway.logout();
        setUser(null);
      },
    }),
    [user, authGateway],
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authGateway.checkAuthStatus();
        const currentUser = authGateway.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    // Vérification initiale
    checkAuth();

    // Vérification périodique uniquement après l'initialisation
    const interval = setInterval(checkAuth, 60000);
    return () => clearInterval(interval);
  }, [authGateway]);

  if (isInitializing) {
    return null; // Ou un spinner/loader
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
