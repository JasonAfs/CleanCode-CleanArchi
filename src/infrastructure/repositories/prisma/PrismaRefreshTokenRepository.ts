// src/infrastructure/repositories/prisma/PrismaRefreshTokenRepository.ts
import { IRefreshTokenRepository } from '@application/ports/repositories/IRefreshTokenRepository';
import { PrismaService } from '@infrastructure/nestjs/prisma/prisma.service';

export class PrismaRefreshTokenRepository implements IRefreshTokenRepository {
    constructor(private readonly prisma: PrismaService) {}

    async save(token: string, userId: string, expiresAt: Date): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                token,
                userId,
                expiresAt
            }
        });
    }

    async verify(token: string): Promise<string | null> {
        const refreshToken = await this.prisma.refreshToken.findUnique({
            where: { token }
        });
        
        if (!refreshToken || refreshToken.expiresAt < new Date()) {
            return null;
        }
        
        return refreshToken.userId;
    }

    async revoke(token: string): Promise<void> {
        await this.prisma.refreshToken.delete({
            where: { token }
        });
    }

    async revokeAllForUser(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: { userId }
        });
    }
}