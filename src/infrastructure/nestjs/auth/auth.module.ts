// src/infrastructure/nestjs/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';
import { RefreshTokenUseCase } from '@application/use-cases/auth/RefreshTokenUseCase';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { PrismaRefreshTokenRepository } from '@infrastructure/repositories/prisma/PrismaRefreshTokenRepository';
import { IRefreshTokenRepository } from '@application/ports/repositories/IRefreshTokenRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { JwtAuthenticationService } from '@infrastructure/services/auth/JwtAuthenticationService';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';
import { PrismaCompanyRepository } from '@infrastructure/repositories/prisma/PrismaCompanyRepository';
import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { BcryptPasswordService } from '@infrastructure/services/auth/BcryptPasswordService';
import { IPasswordService } from '@application/ports/services/IPasswordService';
import { LoginValidator } from '@application/validation/auth/LoginValidator';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginValidator,
    {
      provide: 'IUserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaUserRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'IRefreshTokenRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaRefreshTokenRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'IDealershipRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaDealershipRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'ICompanyRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaCompanyRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'IAuthenticationService',
      useFactory: (
        refreshTokenRepo: IRefreshTokenRepository,
        dealershipRepo: IDealershipRepository,
        companyRepo: ICompanyRepository,
      ) => {
        return new JwtAuthenticationService(
          refreshTokenRepo,
          dealershipRepo,
          companyRepo,
          process.env.JWT_SECRET,
        );
      },
      inject: [
        'IRefreshTokenRepository',
        'IDealershipRepository',
        'ICompanyRepository',
      ],
    },
    {
      provide: 'IPasswordService',
      useClass: BcryptPasswordService,
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepo: IUserRepository,
        passwordService: IPasswordService,
        authService: IAuthenticationService,
      ) => {
        return new LoginUseCase(userRepo, passwordService, authService);
      },
      inject: ['IUserRepository', 'IPasswordService', 'IAuthenticationService'],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepo: IUserRepository,
        passwordService: IPasswordService,
      ) => {
        return new RegisterUseCase(userRepo, passwordService);
      },
      inject: ['IUserRepository', 'IPasswordService'],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (authService: IAuthenticationService) => {
        return new RefreshTokenUseCase(authService);
      },
      inject: ['IAuthenticationService'],
    },
  ],
})
export class AuthModule {}
