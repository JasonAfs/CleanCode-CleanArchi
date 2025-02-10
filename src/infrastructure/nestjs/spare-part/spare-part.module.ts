import { Module } from '@nestjs/common';
import { SparePartController } from './controllers/spare-part.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { PrismaSparePartRepository } from '@infrastructure/repositories/prisma/PrismaSparePartRepository';

import { CreateSparePartUseCase } from '@application/use-cases/spare-part/CreateSparePartUseCase';
import { GetSparePartsUseCase } from '@application/use-cases/spare-part/GetSparePartsUseCase';
import { GetSparePartDetailsUseCase } from '@application/use-cases/spare-part/GetSparePartDetailsUseCase';
import { UpdateSparePartUseCase } from '@application/use-cases/spare-part/UpdateSparePartUseCase';
import { DeleteSparePartUseCase } from '@application/use-cases/spare-part/DeleteSparePartUseCase';

@Module({
  imports: [PrismaModule],
  controllers: [SparePartController],
  providers: [
    // Repository Provider
    {
      provide: 'ISparePartRepository',
      useFactory: (prisma: PrismaService) =>
        new PrismaSparePartRepository(prisma),
      inject: [PrismaService],
    },

    // Use Case Providers
    {
      provide: CreateSparePartUseCase,
      useFactory: (sparePartRepo: ISparePartRepository) =>
        new CreateSparePartUseCase(sparePartRepo),
      inject: ['ISparePartRepository'],
    },
    {
      provide: GetSparePartsUseCase,
      useFactory: (sparePartRepo: ISparePartRepository) =>
        new GetSparePartsUseCase(sparePartRepo),
      inject: ['ISparePartRepository'],
    },
    {
      provide: GetSparePartDetailsUseCase,
      useFactory: (sparePartRepo: ISparePartRepository) =>
        new GetSparePartDetailsUseCase(sparePartRepo),
      inject: ['ISparePartRepository'],
    },
    {
      provide: UpdateSparePartUseCase,
      useFactory: (sparePartRepo: ISparePartRepository) =>
        new UpdateSparePartUseCase(sparePartRepo),
      inject: ['ISparePartRepository'],
    },
    {
      provide: DeleteSparePartUseCase,
      useFactory: (sparePartRepo: ISparePartRepository) =>
        new DeleteSparePartUseCase(sparePartRepo),
      inject: ['ISparePartRepository'],
    },
  ],
})
export class SparePartModule {}
