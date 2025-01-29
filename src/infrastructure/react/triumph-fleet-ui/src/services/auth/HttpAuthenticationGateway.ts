import { AxiosAuthenticationGateway } from '@infrastructure/gateways/AxiosAuthenticationGateway';
import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import { User } from '@domain/entities/UserEntity';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '@domain/enums/UserRole';

interface JwtPayload {
  userId: string;
  role: UserRole;
  exp: number;
}

export class HttpAuthenticationGateway extends AxiosAuthenticationGateway {
  constructor() {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    super(baseURL);

    // Restaurer l'utilisateur depuis le localStorage au démarrage
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const userData = this.getUserFromToken(accessToken);
      if (userData) {
        this.currentUser = userData as User;
      }
    }
  }

  protected override saveTokens(tokens: AuthTokensDTO): void {
    super.saveTokens(tokens);
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    const userData = this.getUserFromToken(tokens.accessToken);
    if (userData) {
      this.currentUser = userData as User;
    }
  }

  override async logout(): Promise<void> {
    await super.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  public async checkAuthStatus(): Promise<void> {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      await this.logout();
      return;
    }
    // Si le token n'est pas expiré, on ne fait rien
    if (!this.isTokenExpired(accessToken)) {
      // Mettre à jour l'utilisateur courant si nécessaire
      if (!this.currentUser) {
        const userData = this.getUserFromToken(accessToken);
        if (userData) {
          this.currentUser = userData as User;
        }
      }
      return;
    }

    // Si le token est expiré, on essaie de le rafraîchir
    try {
      await this.refreshTokens();
    } catch (error) {
      console.error('Failed to refresh token:', error);
      await this.logout();
      throw error;
    }
  }

  protected override getUserFromToken(token: string): Partial<User> | null {
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
