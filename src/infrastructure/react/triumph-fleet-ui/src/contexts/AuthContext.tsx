// src/infrastructure/react/triumph-fleet-ui/src/contexts/AuthContext.tsx
import { createContext } from 'react';
import type { User } from '@domain/entities/UserEntity';
import type { LoginDTO } from '@application/dtos/auth/LoginDTO';
import type { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import type { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';

export interface AuthContextType {
  user: User | null;
  login: (credentials: LoginDTO) => Promise<AuthTokensDTO>;
  register: (data: RegisterDTO) => Promise<AuthTokensDTO>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
