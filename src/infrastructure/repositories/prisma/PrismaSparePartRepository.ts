import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/nestjs/prisma/prisma.service';
import { ISparePartRepository } from '@application/ports/repositories/ISparePartRepository';
import { SparePart, SparePartCategory } from '@domain/value-objects/SparePart';
import { MotorcycleModel } from '@domain/enums/MotorcycleEnums';

@Injectable()
export class PrismaSparePartRepository implements ISparePartRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sparePart: SparePart): Promise<void> {
    await this.prisma.sparePart.create({
      data: {
        reference: sparePart.sparePartReference,
        name: sparePart.sparePartName,
        category: sparePart.sparePartCategory,
        description: sparePart.sparePartDescription,
        manufacturer: sparePart.sparePartManufacturer,
        compatibleModels: sparePart.sparePartCompatibleModels,
        minimumThreshold: sparePart.sparePartMinimumThreshold,
        unitPrice: sparePart.sparePartUnitPrice,
        isActive: true,
      },
    });
  }

  async update(sparePart: SparePart): Promise<void> {
    await this.prisma.sparePart.update({
      where: { reference: sparePart.sparePartReference },
      data: {
        name: sparePart.sparePartName,
        category: sparePart.sparePartCategory,
        description: sparePart.sparePartDescription,
        manufacturer: sparePart.sparePartManufacturer,
        compatibleModels: sparePart.sparePartCompatibleModels,
        minimumThreshold: sparePart.sparePartMinimumThreshold,
        unitPrice: sparePart.sparePartUnitPrice,
        isActive: sparePart.isActive,
      },
    });
  }

  async findByReference(reference: string): Promise<SparePart | null> {


    if (!reference) {
      console.error('Repository - Reference is undefined or empty');
      return null;
    }

    const sparePart = await this.prisma.sparePart.findUnique({
      where: {
        reference: reference,
      },
    });


    if (!sparePart) return null;

    return SparePart.create({
      reference: sparePart.reference,
      name: sparePart.name,
      category: this.mapPrismaToSparePartCategory(sparePart.category),
      description: sparePart.description,
      manufacturer: sparePart.manufacturer,
      compatibleModels: this.mapPrismaToMotorcycleModels(
        sparePart.compatibleModels,
      ),
      minimumStockThreshold: sparePart.minimumThreshold,
      unitPrice: sparePart.unitPrice,
    });
  }

  private mapPrismaToSparePartCategory(category: any): SparePartCategory {
    return SparePartCategory[category as keyof typeof SparePartCategory];
  }

  private mapPrismaToMotorcycleModels(models: string[]): MotorcycleModel[] {
    return models.map(
      (model) => MotorcycleModel[model as keyof typeof MotorcycleModel],
    );
  }

  async findAll(filters?: {
    category?: SparePartCategory;
    manufacturer?: string;
    compatibleModel?: string;
  }): Promise<SparePart[]> {
    const where: any = { isActive: true };

    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.manufacturer) {
      where.manufacturer = filters.manufacturer;
    }
    if (filters?.compatibleModel) {
      where.compatibleModels = {
        has: filters.compatibleModel,
      };
    }

    const spareParts = await this.prisma.sparePart.findMany({ where });

    return spareParts.map((sp) =>
      SparePart.create({
        reference: sp.reference,
        name: sp.name,
        category: sp.category as SparePartCategory,
        description: sp.description,
        manufacturer: sp.manufacturer,
        compatibleModels: sp.compatibleModels as MotorcycleModel[],
        minimumStockThreshold: sp.minimumThreshold,
        unitPrice: sp.unitPrice,
      }),
    );
  }

  async findByCategory(category: SparePartCategory): Promise<SparePart[]> {
    return this.findAll({ category });
  }

  async findByManufacturer(manufacturer: string): Promise<SparePart[]> {
    return this.findAll({ manufacturer });
  }

  async findByCompatibleModel(modelId: string): Promise<SparePart[]> {
    return this.findAll({ compatibleModel: modelId });
  }

  async exists(reference: string): Promise<boolean> {
    const count = await this.prisma.sparePart.count({
      where: { reference },
    });
    return count > 0;
  }

  async delete(reference: string): Promise<void> {
    await this.prisma.sparePart.update({
      where: { reference },
      data: { isActive: false },
    });
  }

  async findById(id: string): Promise<SparePart | null> {
    const sparePart = await this.prisma.sparePart.findUnique({
      where: { id },
    });

    if (!sparePart) return null;

    return SparePart.create({
      reference: sparePart.reference,
      name: sparePart.name,
      category: sparePart.category as SparePartCategory,
      description: sparePart.description,
      manufacturer: sparePart.manufacturer,
      compatibleModels: sparePart.compatibleModels as MotorcycleModel[],
      minimumStockThreshold: sparePart.minimumThreshold,
      unitPrice: sparePart.unitPrice,
    });
  }
}
