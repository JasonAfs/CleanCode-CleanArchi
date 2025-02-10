import { PrismaClient } from '@prisma/client';
import { IDealershipRepository } from '@application/ports/repositories/IDealershipRepository';
import { Dealership } from '@domain/entities/DealershipEntity';
import { DealershipMapper } from '../mappers/DealershipMapper';
import { DealershipSparePartsStock } from '@domain/aggregates/dealership/DealershipSparePartsStock';

export class PrismaDealershipRepository implements IDealershipRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(dealership: Dealership): Promise<void> {
    const prismaData = DealershipMapper.toPrismaCreate(dealership);
    await this.prisma.dealership.create({
      data: prismaData,
    });
  }

  async update(dealership: Dealership): Promise<void> {
    const prismaData = DealershipMapper.toPrismaUpdate(dealership);
    const employeeIds = dealership.employees.getAll().map((emp) => emp.id);

    await this.prisma.$transaction([
      // Déconnecter les anciens employés
      this.prisma.user.updateMany({
        where: {
          dealershipId: dealership.id,
          id: { notIn: employeeIds },
        },
        data: { dealershipId: null },
      }),

      // Mettre à jour la concession
      this.prisma.dealership.update({
        where: { id: dealership.id },
        data: prismaData,
      }),

      // Mettre à jour les nouveaux employés
      this.prisma.user.updateMany({
        where: { id: { in: employeeIds } },
        data: { dealershipId: dealership.id },
      }),
    ]);
  }

  async findById(id: string): Promise<Dealership | null> {
    const dealership = await this.prisma.dealership.findUnique({
      where: { id },
      include: {
        employees: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!dealership) return null;
    return DealershipMapper.toDomain(dealership);
  }

  async findByName(name: string): Promise<Dealership | null> {
    const dealership = await this.prisma.dealership.findUnique({
      where: { name },
      include: {
        employees: true,
      },
    });

    if (!dealership) return null;
    return DealershipMapper.toDomain(dealership);
  }

  async findByEmployee(userId: string): Promise<Dealership | null> {
    const dealership = await this.prisma.dealership.findFirst({
      where: {
        employees: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        employees: true,
      },
    });

    if (!dealership) return null;
    return DealershipMapper.toDomain(dealership);
  }

  async findAll(): Promise<Dealership[]> {
    const dealerships = await this.prisma.dealership.findMany({
      include: {
        employees: true,
      },
    });
    return dealerships.map(DealershipMapper.toDomain);
  }

  async findActive(): Promise<Dealership[]> {
    const dealerships = await this.prisma.dealership.findMany({
      where: { isActive: true },
      include: {
        employees: true,
      },
    });
    return dealerships.map(DealershipMapper.toDomain);
  }

  async exists(name: string): Promise<boolean> {
    const count = await this.prisma.dealership.count({
      where: { name },
    });
    return count > 0;
  }

  async getSparePartsStock(
    dealershipId: string,
  ): Promise<DealershipSparePartsStock> {
    // Récupérer le stock depuis la base de données
    const stockEntries = await this.prisma.dealershipStock.findMany({
      where: { dealershipId },
      include: {
        sparePart: true,
        stockMovements: true,
        orders: true,
      },
    });

    // Convertir en DealershipSparePartsStock
    const stock = DealershipSparePartsStock.create(dealershipId);

    // Reconstituer l'état du stock à partir des données
    // Cette logique dépendra de votre schéma de base de données
    return stock;
  }

  async updateSparePartsStock(
    dealershipId: string,
    stock: DealershipSparePartsStock,
  ): Promise<void> {
    await this.prisma.$transaction(async (prisma) => {
      // Mettre à jour les quantités
      for (const [reference, quantity] of stock.getStockEntries()) {
        // D'abord, trouvons le sparePartId correspondant au reference
        const sparePart = await prisma.sparePart.findUnique({
          where: { reference },
        });

        if (!sparePart) {
          throw new Error(`SparePart with reference ${reference} not found`);
        }

        await prisma.dealershipStock.upsert({
          where: {
            dealershipId_sparePartId: {
              dealershipId,
              sparePartId: sparePart.id,
            },
          },
          update: {
            quantity,
          },
          create: {
            dealershipId,
            sparePartId: sparePart.id,
            quantity,
            threshold: 5, // Valeur par défaut, à ajuster selon vos besoins
          },
        });
      }
    });
  }

  async getStockStatistics(dealershipId: string): Promise<{
    totalParts: number;
    lowStockParts: number;
    outOfStockParts: number;
    totalValue: number;
  }> {
    // Récupérer les statistiques depuis la base de données
    const stocks = await this.prisma.dealershipStock.findMany({
      where: { dealershipId },
      include: {
        sparePart: true,
      },
    });

    const lowStockThreshold = 5; // À définir selon vos besoins

    return {
      totalParts: stocks.length,
      lowStockParts: stocks.filter(
        (s) => s.quantity > 0 && s.quantity <= lowStockThreshold,
      ).length,
      outOfStockParts: stocks.filter((s) => s.quantity === 0).length,
      totalValue: stocks.reduce(
        (total, s) => total + s.quantity * s.sparePart.unitPrice,
        0,
      ),
    };
  }
}
