import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import { UserRole } from '@domain/enums/UserRole';
import { IRefreshTokenRepository } from '@application/ports/repositories/IRefreshTokenRepository';
import * as jwt from 'jsonwebtoken'; // Il faudra installer ce package

export interface AuthPayload {
  userId: string;
  role: UserRole;
  exp: number;
  iat?: number;
}

export class JwtAuthenticationService implements IAuthenticationService {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtSecret: string = process.env.JWT_SECRET ||
      'your-secret-key',
    private readonly accessTokenExpiration: string = '1d',
    private readonly refreshTokenExpiration: string = '7d',
  ) {}

  public async generateTokens(
    userId: string,
    role: UserRole,
  ): Promise<AuthTokensDTO> {
    const accessToken = jwt.sign({ userId, role }, this.jwtSecret, {
      expiresIn: this.accessTokenExpiration,
    });

    const refreshToken = jwt.sign({ userId, role }, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiration,
    });

    // Calculer la date d'expiration
    const refreshExpiration = new Date();
    refreshExpiration.setDate(refreshExpiration.getDate() + 7); // 7 jours

    // Sauvegarder le refresh token
    await this.refreshTokenRepository.save(
      refreshToken,
      userId,
      refreshExpiration,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyAccessToken(token: string): Promise<AuthPayload> {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as AuthPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  public async verifyRefreshToken(token: string): Promise<AuthPayload> {
    try {
      // Vérifier la validité du token
      const payload = jwt.verify(token, this.jwtSecret) as AuthPayload;

      // Vérifier que le token existe en base
      const userId = await this.refreshTokenRepository.verify(token);
      if (!userId) {
        throw new Error('Refresh token has been revoked');
      }

      return payload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  public async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.revoke(token);
  }
}
