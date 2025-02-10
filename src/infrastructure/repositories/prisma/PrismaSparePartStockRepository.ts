import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/nestjs/prisma/prisma.service';
import { ISparePartStockRepository } from '@application/ports/repositories/ISparePartStockRepository';
import { DealershipSparePartsStock } from '@domain/aggregates/dealership/DealershipSparePartsStock';
import { SparePart, SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

@Injectable()
export class PrismaSparePartStockRepository
  implements ISparePartStockRepository
{
  constructor(private readonly prisma: PrismaService) {}

  private mapPrismaToSparePartCategory(category: any): SparePartCategory {
    return SparePartCategory[category as keyof typeof SparePartCategory];
  }

  private mapPrismaToMotorcycleModels(models: string[]): MotorcycleModel[] {
    return models.map(
      (model) => MotorcycleModel[model as keyof typeof MotorcycleModel],
    );
  }

  async findByDealershipId(
    dealershipId: string,
  ): Promise<DealershipSparePartsStock> {
    const stockEntries = await this.prisma.dealershipStock.findMany({
      where: { dealershipId },
      include: {
        sparePart: true,
      },
    });

    const stock = DealershipSparePartsStock.create(dealershipId);

    for (const entry of stockEntries) {
      const sparePart = SparePart.create({
        reference: entry.sparePart.reference,
        name: entry.sparePart.name,
        category: this.mapPrismaToSparePartCategory(entry.sparePart.category),
        description: entry.sparePart.description,
        manufacturer: entry.sparePart.manufacturer,
        compatibleModels: this.mapPrismaToMotorcycleModels(
          entry.sparePart.compatibleModels,
        ),
        minimumStockThreshold: entry.sparePart.minimumThreshold,
        unitPrice: entry.sparePart.unitPrice,
      });
      stock.addStock(sparePart, entry.quantity);
      stock.setThreshold(sparePart, entry.threshold);
    }

    return stock;
  }

  async updateStock(
    dealershipId: string,
    stock: DealershipSparePartsStock,
  ): Promise<void> {
    const entries = stock.getStockEntries();

    await this.prisma.$transaction(async (prisma) => {
      for (const [reference, quantity] of entries) {
        const sparePart = await prisma.sparePart.findUnique({
          where: { reference },
        });
        if (!sparePart) continue;

        await prisma.dealershipStock.upsert({
          where: {
            dealershipId_sparePartId: {
              dealershipId,
              sparePartId: sparePart.id,
            },
          },
          update: {
            quantity,
            threshold: stock.getMinimumThreshold(reference),
          },
          create: {
            dealershipId,
            sparePartId: sparePart.id,
            quantity,
            threshold: stock.getMinimumThreshold(reference),
          },
        });
      }
    });
  }

  async addStock(
    dealershipId: string,
    sparePart: SparePart,
    quantity: number,
  ): Promise<void> {
    const stock = await this.findByDealershipId(dealershipId);
    stock.addStock(sparePart, quantity);
    await this.updateStock(dealershipId, stock);
  }

  async removeStock(
    dealershipId: string,
    sparePart: SparePart,
    quantity: number,
  ): Promise<void> {
    const stock = await this.findByDealershipId(dealershipId);
    stock.removeStock(sparePart, quantity);
    await this.updateStock(dealershipId, stock);
  }

  async findLowStock(
    dealershipId: string,
  ): Promise<Array<{ sparePart: SparePart; quantity: number }>> {
    const stock = await this.findByDealershipId(dealershipId);
    const lowStockRefs = stock.getLowStockParts();

    const result = await Promise.all(
      lowStockRefs.map(async (ref) => {
        const sparePartData = await this.prisma.sparePart.findUnique({
          where: { reference: ref },
        });
        if (!sparePartData) throw new Error(`SparePart ${ref} not found`);

        const sparePart = SparePart.create({
          reference: sparePartData.reference,
          name: sparePartData.name,
          category: this.mapPrismaToSparePartCategory(sparePartData.category),
          description: sparePartData.description,
          manufacturer: sparePartData.manufacturer,
          compatibleModels: this.mapPrismaToMotorcycleModels(
            sparePartData.compatibleModels,
          ),
          minimumStockThreshold: sparePartData.minimumThreshold,
          unitPrice: sparePartData.unitPrice,
        });

        return {
          sparePart,
          quantity: stock.getStock(ref),
        };
      }),
    );

    return result;
  }

  async getStockLevel(
    dealershipId: string,
    reference: string,
  ): Promise<number> {
    const stock = await this.findByDealershipId(dealershipId);
    return stock.getStock(reference);
  }

  async findOutOfStock(dealershipId: string): Promise<SparePart[]> {
    const stock = await this.findByDealershipId(dealershipId);
    const entries = stock.getStockEntries();
    const outOfStock = entries.filter(([_, quantity]) => quantity === 0);

    return Promise.all(
      outOfStock.map(async ([reference]) => {
        const sparePartData = await this.prisma.sparePart.findUnique({
          where: { reference },
        });
        if (!sparePartData) throw new Error(`SparePart ${reference} not found`);

        return SparePart.create({
          reference: sparePartData.reference,
          name: sparePartData.name,
          category: this.mapPrismaToSparePartCategory(sparePartData.category),
          description: sparePartData.description,
          manufacturer: sparePartData.manufacturer,
          compatibleModels: this.mapPrismaToMotorcycleModels(
            sparePartData.compatibleModels,
          ),
          minimumStockThreshold: sparePartData.minimumThreshold,
          unitPrice: sparePartData.unitPrice,
        });
      }),
    );
  }

  async getStockHistory(
    dealershipId: string,
    sparePartReference: string,
    startDate: Date,
    endDate: Date,
  ): Promise<
    Array<{ date: Date; quantity: number; type: 'IN' | 'OUT'; reason: string }>
  > {
    const movements = await this.prisma.stockMovement.findMany({
      where: {
        dealershipStock: {
          dealershipId,
          sparePart: { reference: sparePartReference },
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return movements.map((movement) => ({
      date: movement.createdAt,
      quantity: movement.quantity,
      type: movement.type,
      reason: movement.reason,
    }));
  }
}
