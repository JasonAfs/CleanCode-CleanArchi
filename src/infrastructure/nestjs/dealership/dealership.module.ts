import { Module } from '@nestjs/common';
import { DealershipController } from './controllers/dealership.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

// Use Cases
import { CreateDealershipUseCase } from '@application/use-cases/dealership/CreateDealershipUseCase';
import { GetDealershipsUseCase } from '@application/use-cases/dealership/GetDealershipsUseCase';
import { GetDealershipByIdUseCase } from '@application/use-cases/dealership/GetDealershipByIdUseCase';
import { UpdateDealershipInfoUseCase } from '@application/use-cases/dealership/UpdateDealershipInfoUseCase';
import { DeactivateDealershipUseCase } from '@application/use-cases/dealership/DeactivateDealershipUseCase';
import { AddDealershipEmployeeUseCase } from '@application/use-cases/dealershipEmployee/AddDealershipEmployeeUseCase';
import { RemoveDealershipEmployeeUseCase } from '@application/use-cases/dealershipEmployee/RemoveDealershipEmployeeUseCase';
import { GetDealershipMotorcyclesUseCase } from '@application/use-cases/dealership/GetDealershipMotorcyclesUseCase';
import { GetDealershipEmployeesUseCase } from '@application/use-cases/dealershipEmployee/GetDealershipEmployeesUseCase';

// Repositories
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { IUserRepository } from '@application/ports/repositories/IUserRepository';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';
import { PrismaUserRepository } from '@infrastructure/repositories/prisma/PrismaUserRepository';
import { PrismaMotorcycleRepository } from '@infrastructure/repositories/prisma/PrismaMotorcycleRepository';

@Module({
  imports: [PrismaModule],
  controllers: [DealershipController],
  providers: [
    // Repository Providers
    {
      provide: 'IDealershipRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaDealershipRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IMotorcycleRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaMotorcycleRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IUserRepository',
      useFactory: (prisma: PrismaService) => new PrismaUserRepository(prisma),
      inject: [PrismaService],
    },

    // Use Case Providers
    {
      provide: CreateDealershipUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) =>
        new CreateDealershipUseCase(dealershipRepo),
      inject: ['IDealershipRepository'],
    },
    {
      provide: GetDealershipsUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) =>
        new GetDealershipsUseCase(dealershipRepo),
      inject: ['IDealershipRepository'],
    },
    {
      provide: GetDealershipByIdUseCase,
      useFactory: (
        dealershipRepo: IDealershipRepository,
        userRepo: IUserRepository,
      ) => new GetDealershipByIdUseCase(dealershipRepo, userRepo),
      inject: ['IDealershipRepository', 'IUserRepository'],
    },
    {
      provide: UpdateDealershipInfoUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) =>
        new UpdateDealershipInfoUseCase(dealershipRepo),
      inject: ['IDealershipRepository'],
    },
    {
      provide: DeactivateDealershipUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) =>
        new DeactivateDealershipUseCase(dealershipRepo),
      inject: ['IDealershipRepository'],
    },
    {
      provide: AddDealershipEmployeeUseCase,
      useFactory: (
        dealershipRepo: IDealershipRepository,
        userRepo: IUserRepository,
      ) => new AddDealershipEmployeeUseCase(dealershipRepo, userRepo),
      inject: ['IDealershipRepository', 'IUserRepository'],
    },
    {
      provide: RemoveDealershipEmployeeUseCase,
      useFactory: (
        dealershipRepo: IDealershipRepository,
        userRepo: IUserRepository,
      ) => new RemoveDealershipEmployeeUseCase(dealershipRepo, userRepo),
      inject: ['IDealershipRepository', 'IUserRepository'],
    },
    {
      provide: GetDealershipMotorcyclesUseCase,
      useFactory: (motorcycleRepo: IMotorcycleRepository) =>
        new GetDealershipMotorcyclesUseCase(motorcycleRepo),
      inject: ['IMotorcycleRepository'],
    },
    {
      provide: GetDealershipEmployeesUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) =>
        new GetDealershipEmployeesUseCase(dealershipRepo),
      inject: ['IDealershipRepository'],
    },
  ],
  exports: [
    CreateDealershipUseCase,
    GetDealershipsUseCase,
    GetDealershipByIdUseCase,
    UpdateDealershipInfoUseCase,
    DeactivateDealershipUseCase,
    AddDealershipEmployeeUseCase,
    RemoveDealershipEmployeeUseCase,
    GetDealershipMotorcyclesUseCase,
    GetDealershipEmployeesUseCase,
  ],
})
export class DealershipModule {}
