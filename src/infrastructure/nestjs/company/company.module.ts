import { Module } from '@nestjs/common';
import { CompanyController } from './controllers/company.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';

import { PrismaCompanyRepository } from '@infrastructure/repositories/prisma/PrismaCompanyRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';
import { PrismaMotorcycleRepository } from '@infrastructure/repositories/prisma/PrismaMotorcycleRepository';

import { CreateCompanyUseCase } from '@application/use-cases/company/CreateCompanyUseCase';
import { UpdateCompanyInfoUseCase } from '@application/use-cases/company/UpdateCompanyInfoUseCase';
import { DeactivateCompanyUseCase } from '@application/use-cases/company/DeactivateCompanyUseCase';
import { GetCompanyEmployeeHistoryUseCase } from '@application/use-cases/company/GetCompanyEmployeeHistoryUseCase';
import { AddCompanyEmployeeUseCase } from '@application/use-cases/companyEmployee/AddCompanyEmployeeUseCase';
import { RemoveCompanyEmployeeUseCase } from '@application/use-cases/companyEmployee/RemoveCompanyEmployeeUseCase';
import { GetCompaniesUseCase } from '@application/use-cases/company/GetCompaniesUseCase';
import { GetCompanyMotorcyclesUseCase } from '@application/use-cases/company/GetCompanyMotorcyclesUseCase';
import { GetCompanyByIdUseCase } from '@application/use-cases/company/GetCompanyByIdUseCase';

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
      provide: 'IUserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaUserRepository(prismaService);
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

    // Use Case Providers
    {
      provide: GetCompaniesUseCase,
      useFactory: (companyRepo: ICompanyRepository) => {
        return new GetCompaniesUseCase(companyRepo);
      },
      inject: ['ICompanyRepository'],
    },
    {
      provide: DeactivateCompanyUseCase,
      useFactory: (companyRepo: ICompanyRepository) => {
        return new DeactivateCompanyUseCase(companyRepo);
      },
      inject: ['ICompanyRepository'],
    },
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
        userRepo: IUserRepository,
      ) => {
        return new AddCompanyEmployeeUseCase(companyRepo, userRepo);
      },
      inject: ['ICompanyRepository', 'IUserRepository'],
    },
    {
      provide: RemoveCompanyEmployeeUseCase,
      useFactory: (
        companyRepo: ICompanyRepository,
        userRepo: IUserRepository,
      ) => {
        return new RemoveCompanyEmployeeUseCase(companyRepo, userRepo);
      },
      inject: ['ICompanyRepository', 'IUserRepository'],
    },
    {
      provide: GetCompanyMotorcyclesUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        companyRepo: ICompanyRepository,
      ) => {
        return new GetCompanyMotorcyclesUseCase(motorcycleRepo, companyRepo);
      },
      inject: ['IMotorcycleRepository', 'ICompanyRepository'],
    },
    {
      provide: GetCompanyByIdUseCase,
      useFactory: (companyRepo: ICompanyRepository) => {
        return new GetCompanyByIdUseCase(companyRepo);
      },
      inject: ['ICompanyRepository'],
    },
  ],
})
export class CompanyModule {}
