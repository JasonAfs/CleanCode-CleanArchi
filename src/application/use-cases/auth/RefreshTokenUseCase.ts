import { AuthTokensDTO } from '@application/dtos/auth/AuthTokensDTO';
import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { Result } from '@domain/shared/Result';

export class RefreshTokenUseCase {
  constructor(private readonly authService: IAuthenticationService) {}

  public async execute(
    refreshToken: string,
  ): Promise<Result<AuthTokensDTO, Error>> {
    try {
      // Vérifier le refresh token
      const payload = await this.authService.verifyRefreshToken(refreshToken);

      // Générer de nouveaux tokens
      return this.authService.generateTokens(payload.userId, payload.role);
    } catch (error) {
      return error as Error;
    }
  }
}
