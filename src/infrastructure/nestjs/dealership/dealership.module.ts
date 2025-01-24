import { Module } from '@nestjs/common';
import { DealershipController } from './controllers/dealership.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { CreateDealershipUseCase } from '@application/use-cases/dealership/CreateDealershipUseCase';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { PrismaDealershipRepository } from '@infrastructure/repositories/prisma/PrismaDealershipRepository';
import { GetDealershipsUseCase } from '@application/use-cases/dealership/GetDealershipsUseCase';

@Module({
  imports: [PrismaModule],
  controllers: [DealershipController],
  providers: [
    // Repository Provider
    {
      provide: 'IDealershipRepository',
      useFactory: (prismaService: PrismaService) => {
        return new PrismaDealershipRepository(prismaService);
      },
      inject: [PrismaService],
    },
    // Use Case Provider
    {
      provide: CreateDealershipUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) => {
        return new CreateDealershipUseCase(dealershipRepo);
      },
      inject: ['IDealershipRepository'],
    },
    {
      provide: GetDealershipsUseCase,
      useFactory: (dealershipRepo: IDealershipRepository) => {
        return new GetDealershipsUseCase(dealershipRepo);
      },
      inject: ['IDealershipRepository'],
    },
  ],
})
export class DealershipModule {}
