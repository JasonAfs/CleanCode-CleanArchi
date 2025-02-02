import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import { UserRole } from '@domain/enums/UserRole';
import { IRefreshTokenRepository } from '@application/ports/repositories/IRefreshTokenRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import * as jwt from 'jsonwebtoken';

interface ExtendedAuthPayload {
  userId: string;
  role: UserRole;
  exp: number;
  dealershipId?: string;
  companyId?: string;
}

export class JwtAuthenticationService implements IAuthenticationService {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly dealershipRepository: IDealershipRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly jwtSecret: string = process.env.JWT_SECRET ?? 'your-secret-key', 
    private readonly accessTokenExpiration: string = '1d',
    private readonly refreshTokenExpiration: string = '7d',
  ) {}

  public async generateTokens(
    userId: string,
    role: UserRole,
  ): Promise<AuthTokensDTO> {
    // Récupérer les appartenances
    let dealershipId: string | undefined;
    let companyId: string | undefined;

    if (this.isDealershipRole(role)) {
      const dealership = await this.dealershipRepository.findByEmployee(userId); 
      dealershipId = dealership?.id;
    } else if (this.isCompanyRole(role)) {
      const company = await this.companyRepository.findByEmployeeId(userId);
      companyId = company?.id;
    }

    const tokenPayload = {
      userId,
      role,
      ...(dealershipId && { dealershipId }),
      ...(companyId && { companyId })
    };

    const accessToken = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: this.accessTokenExpiration,
    });

    const refreshToken = jwt.sign(tokenPayload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiration,
    });

    const refreshExpiration = new Date();
    refreshExpiration.setDate(refreshExpiration.getDate() + 7);
    await this.refreshTokenRepository.save(refreshToken, userId, refreshExpiration);

    return {
      accessToken,
      refreshToken,
    };
  }

  public async verifyAccessToken(token: string): Promise<ExtendedAuthPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as ExtendedAuthPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  public async verifyRefreshToken(token: string): Promise<ExtendedAuthPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as ExtendedAuthPayload;
      
      const userId = await this.refreshTokenRepository.verify(token);
      if (!userId) {
        throw new Error('Refresh token has been revoked');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  public async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.revoke(token);
  }

  private isDealershipRole(role: UserRole): boolean {
    return [
      UserRole.DEALERSHIP_MANAGER,
      UserRole.DEALERSHIP_EMPLOYEE,
      UserRole.DEALERSHIP_TECHNICIAN,
      UserRole.DEALERSHIP_STOCK_MANAGER
    ].includes(role);
  }

  private isCompanyRole(role: UserRole): boolean {
    return [
      UserRole.COMPANY_MANAGER,
      UserRole.COMPANY_DRIVER
    ].includes(role);
  }
}
