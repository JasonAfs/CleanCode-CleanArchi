import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { ICompanyMotorcycleRepository } from '@application/ports/repositories/ICompanyMotorcycleRepository';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';

import { PrismaCompanyRepository } from '@infrastructure/repositories/prisma/PrismaCompanyRepository';
import { PrismaCompanyMotorcycleRepository } from '@infrastructure/repositories/prisma/PrismaCompanyMotorcycleRepository';
import { PrismaMotorcycleRepository } from '@infrastructure/repositories/prisma/PrismaMotorcycleRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';

import { CreateCompanyUseCase } from '@application/use-cases/company/CreateCompanyUseCase';
import { UpdateCompanyInfoUseCase } from '@application/use-cases/company/UpdateCompanyInfoUseCase';
import { DeactivateCompanyUseCase } from '@application/use-cases/company/DeactivateCompanyUseCase';
import { GetCompanyAssignedMotorcyclesUseCase } from '@application/use-cases/company/GetCompanyAssignedMotorcyclesUseCase';
import { GetCompanyEmployeeHistoryUseCase } from '@application/use-cases/company/GetCompanyEmployeeHistoryUseCase';
import { AddCompanyEmployeeUseCase } from '@application/use-cases/companyEmployee/AddCompanyEmployeeUseCase';
import { RemoveCompanyEmployeeUseCase } from '@application/use-cases/companyEmployee/RemoveCompanyEmployeeUseCase';

@Module({
  imports: [PrismaModule],
  controllers: [CompanyController],
  providers: [
    // Repository Providers
    {
      provide: 'ICompanyRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaCompanyRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'ICompanyMotorcycleRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaCompanyMotorcycleRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'IMotorcycleRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaMotorcycleRepository(prismaService);
      },
      inject: [PrismaService],
    },
    {
      provide: 'IUserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaUserRepository(prismaService);
      },
      inject: [PrismaService],
    },

    // Use Case Providers
    {
      provide: CreateCompanyUseCase,
      useFactory: (companyRepo: ICompanyRepository) => {
        return new CreateCompanyUseCase(companyRepo);
      },
      inject: ['ICompanyRepository'],
    },
    {
      provide: UpdateCompanyInfoUseCase,
      useFactory: (companyRepo: ICompanyRepository) => {
        return new UpdateCompanyInfoUseCase(companyRepo);
      },
      inject: ['ICompanyRepository'],
    },
    {
      provide: DeactivateCompanyUseCase,
      useFactory: (
        companyRepo: ICompanyRepository,
        companyMotorcycleRepo: ICompanyMotorcycleRepository
      ) => {
        return new DeactivateCompanyUseCase(
          companyRepo,
          companyMotorcycleRepo
        );
      },
      inject: ['ICompanyRepository', 'ICompanyMotorcycleRepository'],
    },
    {
      provide: GetCompanyAssignedMotorcyclesUseCase,
      useFactory: (
        companyRepo: ICompanyRepository,
        companyMotorcycleRepo: ICompanyMotorcycleRepository,
        motorcycleRepo: IMotorcycleRepository
      ) => {
        return new GetCompanyAssignedMotorcyclesUseCase(
          companyRepo,
          companyMotorcycleRepo,
          motorcycleRepo
        );
      },
      inject: [
        'ICompanyRepository',
        'ICompanyMotorcycleRepository',
        'IMotorcycleRepository'
      ],
    },
    {
      provide: GetCompanyEmployeeHistoryUseCase,
      useFactory: (companyRepo: ICompanyRepository) => {
        return new GetCompanyEmployeeHistoryUseCase(companyRepo);
      },
      inject: ['ICompanyRepository'],
    },
    {
      provide: AddCompanyEmployeeUseCase,
      useFactory: (
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository
      ) => {
        return new AddCompanyEmployeeUseCase(companyRepo, userRepo);
      },
      inject: ['ICompanyRepository', 'IUserRepository'],
    },
    {
      provide: RemoveCompanyEmployeeUseCase,
      useFactory: (
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository
      ) => {
        return new RemoveCompanyEmployeeUseCase(companyRepo, userRepo);
      },
      inject: ['ICompanyRepository', 'IUserRepository'],
    },
  ],
})
export class CompanyModule {}