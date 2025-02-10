import { Module } from '@nestjs/common';
import { MaintenanceController } from './controllers/maintenance.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { GetMaintenanceDetailsUseCase } from '@application/use-cases/maintenance/GetMaintenanceDetailsUseCase';
import { GetMaintenancesUseCase } from '@application/use-cases/maintenance/GetMaintenancesUseCase';
import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';

import { PrismaMaintenanceRepository } from '@infrastructure/repositories/prisma/PrismaMaintenanceRepository';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';
import { PrismaCompanyRepository } from '@infrastructure/repositories/prisma/PrismaCompanyRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';

@Module({
  imports: [PrismaModule],
  controllers: [MaintenanceController],
  providers: [
    // Repositories
    {
      provide: 'IMaintenanceRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaMaintenanceRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IDealershipRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaDealershipRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'ICompanyRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaCompanyRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IUserRepository',
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },

    // Use Cases
    {
      provide: GetMaintenancesUseCase,
      useFactory: (
        maintenanceRepo: IMaintenanceRepository,
        userRepo: IUserRepository,
      ) => new GetMaintenancesUseCase(maintenanceRepo, userRepo),
      inject: ['IMaintenanceRepository', 'IUserRepository'],
    },
    {
      provide: GetMaintenanceDetailsUseCase,
      useFactory: (
        maintenanceRepo: IMaintenanceRepository,
        dealershipRepo: IDealershipRepository,
        companyRepo: ICompanyRepository,
      ) =>
        new GetMaintenanceDetailsUseCase(
          maintenanceRepo,
          dealershipRepo,
          companyRepo,
        ),
      inject: [
        'IMaintenanceRepository',
        'IDealershipRepository',
        'ICompanyRepository',
      ],
    },
  ],
})
export class MaintenanceModule {}
