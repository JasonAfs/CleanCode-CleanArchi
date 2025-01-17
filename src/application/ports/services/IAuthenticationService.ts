import { UserRole } from "@domain/enums/UserRole";
import { AuthTokensDTO } from "@application/dtos/auth/AuthTokensDTO";

export interface IAuthenticationService {
    generateTokens(userId: string, role: UserRole): Promise<AuthTokensDTO>;
    verifyAccessToken(token: string): Promise<AuthPayload>;
    verifyRefreshToken(token: string): Promise<AuthPayload>;
    revokeRefreshToken(token: string): Promise<void>;
}

interface AuthPayload {
    userId: string;
    role: UserRole;
    exp: number;
}