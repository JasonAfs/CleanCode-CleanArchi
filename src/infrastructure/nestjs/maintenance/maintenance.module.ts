import { Module } from '@nestjs/common';
import { MaintenanceController } from './controllers/maintenance.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { PrismaMaintenanceRepository } from '@infrastructure/repositories/prisma/PrismaMaintenanceRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';
import { GetMaintenancesUseCase } from '@application/use-cases/maintenance/GetMaintenancesUseCase';

@Module({
  imports: [PrismaModule],
  controllers: [MaintenanceController],
  providers: [
    {
      provide: 'IMaintenanceRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaMaintenanceRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IUserRepository',
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: GetMaintenancesUseCase,
      useFactory: (
        maintenanceRepo: IMaintenanceRepository,
        userRepo: IUserRepository,
      ) => new GetMaintenancesUseCase(maintenanceRepo, userRepo),
      inject: ['IMaintenanceRepository', 'IUserRepository'],
    },
  ],
})
export class MaintenanceModule {}
