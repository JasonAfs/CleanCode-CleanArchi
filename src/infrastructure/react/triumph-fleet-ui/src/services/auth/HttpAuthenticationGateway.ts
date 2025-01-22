import type { IAuthenticationGateway } from '@application/ports/services/IAuthenticationGateway';
import type { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import type { LoginDTO } from '@application/dtos/auth/LoginDTO';
import type { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import type { User } from '@domain/entities/UserEntity';
import { AuthValidationError } from '@domain/errors/auth/AuthValidationError';
import { Email } from '@domain/value-objects/Email';

export class HttpAuthenticationGateway implements IAuthenticationGateway {
  private readonly API_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3000';
  private currentUser: User | null = null;

  constructor() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
    }
  }

  async login(credentials: LoginDTO): Promise<AuthTokensDTO> {
    try {
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AuthValidationError(error.message || 'Login failed');
      }

      const data = await response.json();
      this.saveTokens(data);
      return data;
    } catch (error) {
      throw new AuthValidationError(
        error instanceof Error ? error.message : 'Failed to login',
      );
    }
  }

  async register(data: RegisterDTO): Promise<AuthTokensDTO> {
    try {
      new Email(data.email);

      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AuthValidationError(error.message || 'Registration failed');
      }
      return await response.json();
    } catch (error) {
      throw new AuthValidationError(
        error instanceof Error ? error.message : 'Failed to register',
      );
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private saveTokens(tokens: AuthTokensDTO): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
}
