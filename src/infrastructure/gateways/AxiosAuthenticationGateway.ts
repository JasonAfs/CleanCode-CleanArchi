// src/infrastructure/gateways/AxiosAuthenticationGateway.ts
import { IAuthenticationGateway } from '@application/ports/services/IAuthenticationGateway';
import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import { LoginDTO } from '@application/dtos/auth/LoginDTO';
import { RegisterDTO } from '@application/dtos/auth/RegisterDTO';
import { User } from '@domain/entities/UserEntity';
import { AuthValidationError } from '@domain/errors/auth/AuthValidationError';
import { HttpClient } from '@infrastructure/http/HttpClient';
import { Email } from '@domain/value-objects/Email';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '@domain/enums/UserRole';

interface JwtPayload {
  userId: string;
  role: UserRole;
  exp: number;
}

export class AxiosAuthenticationGateway implements IAuthenticationGateway {
  protected readonly httpClient: HttpClient;
  protected currentUser: User | null = null;

  constructor(baseURL: string) {
    this.httpClient = new HttpClient(
      { baseURL },
      async () => this.refreshTokens(), // Fonction appelée quand un token expire
    );
  }

  async login(credentials: LoginDTO): Promise<AuthTokensDTO> {
    try {
      const response = await this.httpClient.post<AuthTokensDTO>(
        '/auth/login',
        credentials,
      );
      this.saveTokens(response.data);
      return response.data;
    } catch (error) {
      throw new AuthValidationError('Failed to login');
    }
  }

  async register(data: RegisterDTO): Promise<AuthTokensDTO> {
    try {
      // Valider l'email avant l'envoi
      new Email(data.email);

      const response = await this.httpClient.post<AuthTokensDTO>(
        '/auth/register',
        data,
      );
      return response.data;
    } catch (error) {
      throw new AuthValidationError('Failed to register');
    }
  }

  protected async refreshTokens(): Promise<AuthTokensDTO> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.httpClient.post<AuthTokensDTO>(
        '/auth/refresh',
        {
          refreshToken,
        },
      );

      this.saveTokens(response.data);
      return response.data;
    } catch (error) {
      await this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.httpClient.removeAuthorizationHeader();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  protected saveTokens(tokens: AuthTokensDTO): void {
    this.httpClient.setAuthorizationHeader(tokens.accessToken);
  }

  protected isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  protected getUserFromToken(token: string): Partial<User> | null {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        id: decoded.userId,
        role: decoded.role,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
