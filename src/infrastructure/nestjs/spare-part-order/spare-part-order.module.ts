import { Module } from '@nestjs/common';
import { SparePartOrderController } from './controllers/spare-part-order.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

// Use Cases
import { OrderSparePartsUseCase } from '@application/use-cases/spare-part/OrderSparePartsUseCase';
import { GetDealershipStockUseCase } from '@application/use-cases/spare-part/GetDealershipStockUseCase';
import { GetSparePartOrderHistoryUseCase } from '@application/use-cases/spare-part/GetSparePartOrderHistoryUseCase';

// Repositories
import { ISparePartOrderRepository } from '@application/ports/repositories/ISparePartOrderRepository';
import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { ISparePartStockRepository } from '@application/ports/repositories/ISparePartStockRepository';

import { PrismaSparePartOrderRepository } from '@infrastructure/repositories/prisma/PrismaSparePartOrderRepository';
import { PrismaSparePartRepository } from '@infrastructure/repositories/prisma/PrismaSparePartRepository';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';
import { PrismaSparePartStockRepository } from '@infrastructure/repositories/prisma/PrismaSparePartStockRepository';

import { ValidateSparePartOrderUseCase } from '@application/use-cases/spare-part/ValidateSparePartOrderUseCase';

@Module({
  imports: [PrismaModule],
  controllers: [SparePartOrderController],
  providers: [
    // Repository Providers
    {
      provide: 'ISparePartOrderRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaSparePartOrderRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'ISparePartRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaSparePartRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'IDealershipRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaDealershipRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: 'ISparePartStockRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaSparePartStockRepository(prisma),
      inject: [PrismaService],
    },

    // Use Case Providers
    {
      provide: OrderSparePartsUseCase,
      useFactory: (
        sparePartOrderRepo: ISparePartOrderRepository,
        dealershipRepo: IDealershipRepository,
        sparePartRepo: ISparePartRepository,
      ) =>
        new OrderSparePartsUseCase(
          sparePartOrderRepo,
          dealershipRepo,
          sparePartRepo,
        ),
      inject: [
        'ISparePartOrderRepository',
        'IDealershipRepository',
        'ISparePartRepository',
      ],
    },
    {
      provide: GetDealershipStockUseCase,
      useFactory: (
        sparePartStockRepo: ISparePartStockRepository,
        dealershipRepo: IDealershipRepository,
        sparePartRepo: ISparePartRepository,
      ) =>
        new GetDealershipStockUseCase(
          sparePartStockRepo,
          dealershipRepo,
          sparePartRepo,
        ),
      inject: [
        'ISparePartStockRepository',
        'IDealershipRepository',
        'ISparePartRepository',
      ],
    },
    {
      provide: GetSparePartOrderHistoryUseCase,
      useFactory: (
        sparePartOrderRepo: ISparePartOrderRepository,
        dealershipRepo: IDealershipRepository,
      ) =>
        new GetSparePartOrderHistoryUseCase(sparePartOrderRepo, dealershipRepo),
      inject: ['ISparePartOrderRepository', 'IDealershipRepository'],
    },
    {
      provide: ValidateSparePartOrderUseCase,
      useFactory: (
        sparePartOrderRepo: ISparePartOrderRepository,
        sparePartStockRepo: ISparePartStockRepository,
      ) =>
        new ValidateSparePartOrderUseCase(
          sparePartOrderRepo,
          sparePartStockRepo,
        ),
      inject: ['ISparePartOrderRepository', 'ISparePartStockRepository'],
    },
  ],
})
export class SparePartOrderModule {}
