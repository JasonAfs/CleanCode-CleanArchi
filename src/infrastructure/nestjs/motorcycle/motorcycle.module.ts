import { Module } from '@nestjs/common';
import { MotorcycleController } from './controllers/motorcycle.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

// Use Cases
import { CreateMotorcycleUseCase } from '@application/use-cases/motorcycle/CreateMotorcycleUseCase';
import { UpdateMotorcycleUseCase } from '@application/use-cases/motorcycle/UpdateMotorcycleUseCase';
import { UpdateMotorcycleMileageUseCase } from '@application/use-cases/motorcycle/UpdateMotorcycleMileageUseCase';
import { TransferMotorcycleToDealershipUseCase } from '@application/use-cases/motorcycle/TransferMotorcycleToDealershipUseCase';
import { AssignMotorcycleToCompanyUseCase } from '@application/use-cases/motorcycle/AssignMotorcycleToCompanyUseCase';
import { ReleaseMotorcycleFromCompanyUseCase } from '@application/use-cases/motorcycle/ReleaseMotorcycleFromCompanyUseCase';
import { TransferMotorcycleBetweenCompaniesUseCase } from '@application/use-cases/motorcycle/TransferMotorcycleBetweenCompaniesUseCase';
import { GetMotorcyclesUseCase } from '@application/use-cases/motorcycle/GetMotorcyclesUseCase';

// Repositories
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ICompanyRepository } from '@application/ports/repositories/ICompanyRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { PrismaMotorcycleRepository } from '@infrastructure/repositories/prisma/PrismaMotorcycleRepository';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';
import { PrismaCompanyRepository } from '@infrastructure/repositories/prisma/PrismaCompanyRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';
import { PrismaMaintenanceRepository } from '@infrastructure/repositories/prisma/PrismaMaintenanceRepository';
import { PrismaMaintenanceNotificationRepository } from '@infrastructure/repositories/prisma/PrismaMaintenanceNotificationRepository';
import { IMaintenanceRepository } from '@application/ports/repositories/IMaintenanceRepository';
import { IMaintenanceNotificationRepository } from '@application/ports/repositories/IMaintenanceNotificationRepository';

@Module({
  imports: [PrismaModule],
  controllers: [MotorcycleController],
  providers: [
    // Repository providers
    {
      provide: 'IMotorcycleRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaMotorcycleRepository(prisma),
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
    {
      provide: 'IMaintenanceRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaMaintenanceRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IMaintenanceNotificationRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaMaintenanceNotificationRepository(prisma),
      inject: [PrismaService],
    },

    // Use Case providers
    {
      provide: CreateMotorcycleUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        dealershipRepo: IDealershipRepository,
      ) => new CreateMotorcycleUseCase(motorcycleRepo, dealershipRepo),
      inject: ['IMotorcycleRepository', 'IDealershipRepository'],
    },
    {
      provide: UpdateMotorcycleUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        dealershipRepo: IDealershipRepository,
      ) => new UpdateMotorcycleUseCase(motorcycleRepo, dealershipRepo),
      inject: ['IMotorcycleRepository', 'IDealershipRepository'],
    },
    {
      provide: UpdateMotorcycleMileageUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        dealershipRepo: IDealershipRepository,
        maintenanceRepo: IMaintenanceRepository,
        notificationRepo: IMaintenanceNotificationRepository,
      ) =>
        new UpdateMotorcycleMileageUseCase(
          motorcycleRepo,
          dealershipRepo,
          maintenanceRepo,
          notificationRepo,
        ),
      inject: [
        'IMotorcycleRepository',
        'IDealershipRepository',
        'IMaintenanceRepository',
        'IMaintenanceNotificationRepository',
      ],
    },
    {
      provide: TransferMotorcycleToDealershipUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        dealershipRepo: IDealershipRepository,
      ) =>
        new TransferMotorcycleToDealershipUseCase(
          motorcycleRepo,
          dealershipRepo,
        ),
      inject: ['IMotorcycleRepository', 'IDealershipRepository'],
    },
    {
      provide: AssignMotorcycleToCompanyUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        companyRepo: ICompanyRepository,
      ) => new AssignMotorcycleToCompanyUseCase(motorcycleRepo, companyRepo),
      inject: ['IMotorcycleRepository', 'ICompanyRepository'],
    },
    {
      provide: ReleaseMotorcycleFromCompanyUseCase,
      useFactory: (motorcycleRepo: IMotorcycleRepository) =>
        new ReleaseMotorcycleFromCompanyUseCase(motorcycleRepo),
      inject: ['IMotorcycleRepository'],
    },
    {
      provide: TransferMotorcycleBetweenCompaniesUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        companyRepo: ICompanyRepository,
      ) =>
        new TransferMotorcycleBetweenCompaniesUseCase(
          motorcycleRepo,
          companyRepo,
        ),
      inject: ['IMotorcycleRepository', 'ICompanyRepository'],
    },
    {
      provide: GetMotorcyclesUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        userRepo: IUserRepository,
      ) => new GetMotorcyclesUseCase(motorcycleRepo, userRepo),
      inject: ['IMotorcycleRepository', 'IUserRepository'],
    },
  ],
  exports: [
    CreateMotorcycleUseCase,
    UpdateMotorcycleUseCase,
    UpdateMotorcycleMileageUseCase,
    TransferMotorcycleToDealershipUseCase,
    AssignMotorcycleToCompanyUseCase,
    ReleaseMotorcycleFromCompanyUseCase,
    TransferMotorcycleBetweenCompaniesUseCase,
    GetMotorcyclesUseCase,
  ],
})
export class MotorcycleModule {}
