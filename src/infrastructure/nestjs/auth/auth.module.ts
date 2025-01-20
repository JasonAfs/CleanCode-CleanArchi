// src/infrastructure/nestjs/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

// Controllers
import { AuthController } from './controllers/auth.controller';

// Use Cases
import { LoginUseCase } from '@application/use-cases/auth/LoginUseCase';
import { RegisterUseCase } from '@application/use-cases/auth/RegisterUseCase';

// Repositories
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { PrismaRefreshTokenRepository } from '@infrastructure/repositories/prisma/PrismaRefreshTokenRepository';
import { IRefreshTokenRepository } from '@application/ports/repositories/IRefreshTokenRepository';

// Services
import { JwtAuthenticationService } from '@infrastructure/services/auth/JwtAuthenticationService';
import { IAuthenticationService } from '@application/ports/services/IAuthenticationService';
import { BcryptPasswordService } from '@infrastructure/services/auth/BcryptPasswordService';
import { IPasswordService } from '@application/ports/services/IPasswordService';

// Validators
import { RegisterValidator } from '@application/validation/auth/RegisterValidator';
import { LoginValidator } from '@application/validation/auth/LoginValidator';

// Modules
import { PrismaModule } from '../prisma/prisma.module';

// Strategy
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
    RegisterValidator,
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
      provide: 'IAuthenticationService',
      useFactory: (refreshTokenRepo: IRefreshTokenRepository) => {
        return new JwtAuthenticationService(refreshTokenRepo);
      },
      inject: ['IRefreshTokenRepository'],
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
        validator: LoginValidator
      ) => {
        return new LoginUseCase(userRepo, passwordService, authService, validator);
      },
      inject: ['IUserRepository', 'IPasswordService', 'IAuthenticationService', LoginValidator],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepo: IUserRepository,
        passwordService: IPasswordService,
        authService: IAuthenticationService,
        validator: RegisterValidator
      ) => {
        return new RegisterUseCase(userRepo, passwordService, authService, validator);
      },
      inject: ['IUserRepository', 'IPasswordService', 'IAuthenticationService', RegisterValidator],
    },
  ],
})
export class AuthModule {}