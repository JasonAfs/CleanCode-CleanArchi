import { Module } from '@nestjs/common';
import { MotorcycleController } from './controllers/motorcycle.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMotorcycleUseCase } from '@application/use-cases/motorcycle/CreateMotorcycleUseCase';
import { UpdateMotorcycleUseCase } from '@application/use-cases/motorcycle/UpdateMotorcycleUseCase';
import { UpdateMotorcycleMileageUseCase } from '@application/use-cases/motorcycle/UpdateMotorcycleMileageUseCase';
import { TransferMotorcycleToDealershipUseCase } from '@application/use-cases/motorcycle/TransferMotorcycleToDealershipUseCase';
import { IMotorcycleRepository } from '@application/ports/repositories/IMotorcycleRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { PrismaMotorcycleRepository } from '@infrastructure/repositories/prisma/PrismaMotorcycleRepository';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';

@Module({
  imports: [PrismaModule],
  controllers: [MotorcycleController],
  providers: [
    {
      provide: 'IMotorcycleRepository',
      useFactory: (prisma: PrismaService) => new PrismaMotorcycleRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IDealershipRepository',
      useFactory: (prisma: PrismaService) => new PrismaDealershipRepository(prisma),
      inject: [PrismaService],
    },
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
      ) => new UpdateMotorcycleMileageUseCase(motorcycleRepo, dealershipRepo),
      inject: ['IMotorcycleRepository', 'IDealershipRepository'],
    },
    {
      provide: TransferMotorcycleToDealershipUseCase,
      useFactory: (
        motorcycleRepo: IMotorcycleRepository,
        dealershipRepo: IDealershipRepository,
      ) => new TransferMotorcycleToDealershipUseCase(motorcycleRepo, dealershipRepo),
      inject: ['IMotorcycleRepository', 'IDealershipRepository'],
    },
  ],
  exports: [
    CreateMotorcycleUseCase,
    UpdateMotorcycleUseCase,
    UpdateMotorcycleMileageUseCase,
    TransferMotorcycleToDealershipUseCase
  ],
})
export class MotorcycleModule {}
