export interface IRefreshTokenRepository {
  save(token: string, userId: string, expiresAt: Date): Promise<void>;
  verify(token: string): Promise<string | null>;
  revoke(token: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}
